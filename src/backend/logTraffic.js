// src/backend/logTraffic.js
// Global Express middleware for Layer 1 Traffic Capture

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE = path.join(__dirname, '../../logs.json');

function getClientIp(req) {
  // Handle x-forwarded-for safely, fallback to req.ip
  const xff = req.headers['x-forwarded-for'];
  if (xff) {
    // x-forwarded-for may be a comma-separated list
    return xff.split(',')[0].trim();
  }
  return req.ip || req.connection.remoteAddress || '';
}


function classifyRequest(req) {
  const url = req.originalUrl || '';
  const urlLower = String(url).toLowerCase();

  let bodyStr = '';
  if (req.body === undefined || req.body === null) {
    bodyStr = '';
  } else if (typeof req.body === 'string') {
    bodyStr = req.body;
  } else {
    try {
      bodyStr = JSON.stringify(req.body);
    } catch (e) {
      bodyStr = String(req.body);
    }
  }
  const bodyLower = String(bodyStr).toLowerCase();

  // --- CRITICAL (case-insensitive) ---
  if (urlLower.includes('../')) {
    return { severity: 'CRITICAL', reason: 'Path traversal attempt (../) detected in URL' };
  }
  if (urlLower.includes('etc/passwd')) {
    return { severity: 'CRITICAL', reason: 'Attempt to access etc/passwd detected' };
  }
  if (urlLower.includes('.env')) {
    return { severity: 'CRITICAL', reason: 'Attempt to access .env file detected' };
  }
  if (urlLower.includes('phpinfo')) {
    return { severity: 'CRITICAL', reason: 'phpinfo probe detected in URL' };
  }
  if (urlLower.includes('shell')) {
    return { severity: 'CRITICAL', reason: 'Shell access pattern detected in URL' };
  }
  if (bodyLower.includes('<script>')) {
    return { severity: 'CRITICAL', reason: 'Possible XSS attack: <script> tag detected in body' };
  }
  if (bodyLower.includes('select')) {
    return { severity: 'CRITICAL', reason: 'Possible SQL injection: SELECT detected in body' };
  }
  if (bodyLower.includes("' or 1=1") || bodyLower.includes('" or 1=1')) {
    return { severity: 'CRITICAL', reason: "Possible SQL injection: ' OR 1=1 pattern detected" };
  }
  if (bodyLower.includes('drop table')) {
    return { severity: 'CRITICAL', reason: 'Possible destructive SQLi: DROP TABLE in body' };
  }

  // --- HIGH (case-insensitive) ---
  const highPatterns = ['/admin', '/wp-admin', '/phpmyadmin', '/config', '/backup', '/login', '/db', '/database'];
  for (const pat of highPatterns) {
    if (urlLower.includes(pat.toLowerCase())) {
      return { severity: 'HIGH', reason: `Suspicious URL pattern detected: ${pat}` };
    }
  }

  // --- MEDIUM (case-insensitive) ---
  if (urlLower.includes('?id=') || urlLower.includes('?user=')) {
    return { severity: 'MEDIUM', reason: 'Suspicious query parameter detected' };
  }
  if (url.length > 100) {
    return { severity: 'MEDIUM', reason: `Abnormally long URL detected (${url.length} chars)` };
  }

  // --- LOW (default) ---
  return { severity: 'LOW', reason: 'Normal traffic' };
}

// --- PERSISTENT ATTACKER SCORING (Layer 4) - synchronous, robust implementation ---
const scoreFilePath = path.join(__dirname, '../../threatScores.json');

function updateThreatScoreSync(ip, severity, isCredentialAttempt = false) {
  const now = new Date().toISOString();
  let threatData = {};

  try {
    if (fs.existsSync(scoreFilePath)) {
      const raw = fs.readFileSync(scoreFilePath, 'utf8') || '{}';
      try {
        threatData = JSON.parse(raw);
      } catch (e) {
        // corrupted file: reset to empty object (do not crash)
        console.error('threatScores.json parse error — resetting to empty object', e);
        threatData = {};
      }
    } else {
      threatData = {};
    }
  } catch (err) {
    console.error('Failed reading threatScores.json (continuing with empty):', err);
    threatData = {};
  }

  if (!ip) ip = 'unknown';
  if (!threatData[ip]) {
    threatData[ip] = { score: 0, threat_level: 'NORMAL', last_seen: now };
  }

  const addMap = { LOW: 1, MEDIUM: 5, HIGH: 15, CRITICAL: 25 };
  const delta = (addMap[String(severity).toUpperCase()] || 0) + (isCredentialAttempt ? 30 : 0);

  threatData[ip].score = (Number(threatData[ip].score) || 0) + delta;

  if (threatData[ip].score < 20) threatData[ip].threat_level = 'NORMAL';
  else if (threatData[ip].score >= 20 && threatData[ip].score < 50) threatData[ip].threat_level = 'SUSPICIOUS';
  else threatData[ip].threat_level = 'MALICIOUS';

  threatData[ip].last_seen = now;

  try {
    fs.writeFileSync(scoreFilePath, JSON.stringify(threatData, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed writing threatScores.json (best-effort):', err);
  }

  return { score: threatData[ip].score, threat_level: threatData[ip].threat_level, last_seen: threatData[ip].last_seen };
}

function logTraffic(req, res, next) {
  // preserve existing classification logic
  const { severity, reason } = classifyRequest(req);
  const ip = getClientIp(req) || 'unknown';
  const original = String(req.originalUrl || req.url || '');

  // detect credential_attempt (server.js appends a credential_attempt on POST /admin-login)
  const isCredentialAttempt = req.method === 'POST' && /\/admin-login$/i.test(original);

  // Always run scoring logic synchronously for every request
  let score = 0;
  let threat_level = 'NORMAL';
  try {
    const updated = updateThreatScoreSync(ip, severity, isCredentialAttempt);
    score = updated.score;
    threat_level = updated.threat_level;
  } catch (err) {
    console.error('Failed to update threat score (sync):', err);
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    ip,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'] || '',
    severity,
    reason,
    score,
    threat_level,
    headers: req.headers,
    body: req.body && Object.keys(req.body).length > 0 ? req.body : undefined
  };

  if (logEntry.body === undefined) delete logEntry.body;

  // Add to in-memory cache for fast live updates
  recentLogs.push(logEntry);
  if (recentLogs.length > MAX_MEMORY_LOGS) {
    recentLogs.shift(); // Remove oldest
  }

  // append to logs.json (non-blocking callback)
  fs.appendFile(LOG_FILE, JSON.stringify(logEntry) + '\n', 'utf8', (err) => {
    if (err) {
      console.error('Traffic log error (append):', err);
    }
  });

  next();
}

// --- IN-MEMORY CACHE FOR LIVE UPDATES ---
const recentLogs = [];
const MAX_MEMORY_LOGS = 2000;

export { logTraffic, recentLogs };
