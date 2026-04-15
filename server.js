// server.js (rewritten - clean, deterministic, ES module)

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { logTraffic, recentLogs } from './src/backend/logTraffic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// --- SIMPLE SESSION STORE (in-memory) ---
const sessions = {}; // { sessionId: { userId, timestamp, ip } }

function createSession(userId, ip) {
  const sessionId = Math.random().toString(36).substr(2, 20) + Date.now().toString(36);
  sessions[sessionId] = { userId, timestamp: Date.now(), ip };
  // Clean up old sessions (older than 24 hours)
  Object.keys(sessions).forEach(id => {
    if (Date.now() - sessions[id].timestamp > 86400000) delete sessions[id];
  });
  return sessionId;
}

function getSession(sessionId) {
  const session = sessions[sessionId];
  return session && Date.now() - session.timestamp < 86400000 ? session : null;
}

// --- MANDATORY MIDDLEWARE ORDER ---
app.use(logTraffic);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- SIMPLE COOKIE PARSER ---
app.use((req, res, next) => {
  const cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) cookies[name] = decodeURIComponent(value);
    });
  }
  req.cookies = cookies;
  
  // Override res.cookie to work without cookie-parser
  res.cookie = function(name, value, options = {}) {
    let cookieStr = \`\${name}=\${encodeURIComponent(value)}\`;
    if (options.maxAge) cookieStr += \`; Max-Age=\${Math.floor(options.maxAge / 1000)}\`;
    if (options.httpOnly) cookieStr += '; HttpOnly';
    if (options.sameSite) cookieStr += \`; SameSite=\${options.sameSite}\`;
    res.setHeader('Set-Cookie', cookieStr);
  };
  
  // Override res.clearCookie
  res.clearCookie = function(name) {
    res.setHeader('Set-Cookie', \`\${name}=; Max-Age=0; HttpOnly\`);
  };
  
  next();
});

// --- INITIALIZE IN-MEMORY LOG CACHE ---
const logPath = path.join(__dirname, 'logs.json');
try {
  if (fs.existsSync(logPath)) {
    const raw = fs.readFileSync(logPath, 'utf8');
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const parsed = lines.map(line => {
      try { return JSON.parse(line); } catch (e) { return null; }
    }).filter(item => item && typeof item === 'object' && !Array.isArray(item));
    
    // Load last 2000 logs into memory
    const recentToLoad = parsed.slice(-2000);
    recentLogs.push(...recentToLoad);
    console.log(`✅ Loaded ${recentLogs.length} existing logs into memory cache`);
  } else {
    console.warn('logs.json not found, starting with empty cache');
  }
} catch (err) {
  console.warn('Could not load logs.json into cache on startup:', err.message);
}

// Ensure cache has some demo data for Vercel
if (recentLogs.length === 0) {
  const now = new Date().toISOString();
  recentLogs.push(
    { timestamp: now, ip: '::1', method: 'GET', url: '/logs', severity: 'LOW', threat_level: 'none' },
    { timestamp: now, ip: '192.168.1.1', method: 'GET', url: '/', severity: 'LOW', threat_level: 'none' },
    { timestamp: now, ip: '10.0.0.5', method: 'POST', url: '/api/logs', severity: 'MEDIUM', threat_level: 'low' }
  );
  console.log('✅ Initialized with demo logs for testing');
}


// --- EARLY DECEPTION MIDDLEWARE ---
// Catches path-traversal, ".env" and "etc/passwd" probes before static + SPA fallback.
app.use((req, res, next) => {
  const original = req.originalUrl || req.url || '';
  if (!original) return next();

  // quick, case-insensitive substring checks
  const wantsEtc = /etc\/passwd/i.test(original);
  const wantsEnv = /(^|\/)\.env(\/|$)|(^|\.)\.env(\?|$)/i.test(original) || /(^|\/)\.env/i.test(original) || /\.env/i.test(original);
  const wantsTraversal = /\.\.\//.test(original);

  if (wantsEtc || wantsEnv || wantsTraversal) {
    // fake /etc/passwd
    if (wantsEtc || wantsTraversal) {
      const fakePasswd = [
        'root:x:0:0:root:/root:/bin/bash',
        'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin',
        'mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false'
      ].join('\n') + '\n';
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(fakePasswd);
    }

    // fake .env
    if (wantsEnv) {
      const fakeEnv = [
        'DB_HOST=localhost',
        'DB_USER=admin',
        'DB_PASS=SuperSecret123',
        'JWT_SECRET=FakeSecretKey',
        'AWS_SECRET=FakeAWSKey'
      ].join('\n') + '\n';
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send(fakeEnv);
    }
  }

  return next();
});

app.use(express.static(path.join(__dirname, 'dist')));

// --- LAYER 3: DECEPTION ADMIN TRAP ---
// Single GET /admin (professional fake login page)
app.get('/admin', (req, res) => {
  const error = req.query.error ? decodeURIComponent(req.query.error) : '';
  res.setHeader('Content-Type', 'text/html');
  res.send(\`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Admin Login</title>
  <style>
    :root{--bg:#0f172a;--panel:#111827;--muted:#94a3b8;--accent:#3b82f6;--error:#ef4444}
    html,body{height:100%;margin:0;background:var(--bg);color:#e6eef8;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif}
    .wrap{min-height:100%;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.25));border:1px solid rgba(255,255,255,0.03);box-shadow:0 8px 30px rgba(2,6,23,0.7);padding:28px;border-radius:12px;max-width:420px;width:100%}
    h1{margin:0 0 18px;font-size:20px;text-align:center}
    label{display:block;margin-bottom:6px;font-size:13px;color:var(--muted)}
    input{width:100%;padding:12px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:#071026;color:#fff;font-size:15px;margin-bottom:16px;box-sizing:border-box}
    input:focus{outline:none;box-shadow:0 0 0 4px rgba(59,130,246,0.12)}
    button{width:100%;padding:12px;border-radius:8px;border:none;background:var(--accent);color:#fff;font-weight:600;cursor:pointer;transition:background 0.2s}
    button:hover{background:#2563eb}
    .meta{margin-top:12px;text-align:center;color:#9aa6b2;font-size:13px}
    .error{background:rgba(239,68,68,0.1);border:1px solid var(--error);color:var(--error);padding:12px;border-radius:8px;margin-bottom:16px;font-size:13px;text-align:center}
    @media (max-width:480px){.card{padding:18px}}
  </style>
</head>
<body>
  <div class="wrap">
    <form class="card" method="POST" action="/admin-login">
      <h1>🔒 Admin Panel</h1>
      \${error ? '<div class="error">❌ ' + error + '</div>' : ''}
      <label for="username">Username</label>
      <input id="username" name="username" type="text" autocomplete="username" required autofocus />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required />
      <button type="submit">Login</button>
      <div class="meta">Restricted — authorized personnel only</div>
    </form>
  </div>
</body>
</html>\`);
});

// Single POST /admin-login (append credentials to logs.json)
app.post('/admin-login', (req, res) => {
  const username = String(req.body?.username || '');
  const password = String(req.body?.password || '');
  const xff = req.headers['x-forwarded-for'];
  const ip = xff ? String(xff).split(',')[0].trim() : (req.ip || req.socket?.remoteAddress || '');

  // Log attempt
  const entry = {
    type: 'credential_attempt',
    username,
    password,
    ip,
    userAgent: req.headers['user-agent'] || '',
    timestamp: new Date().toISOString()
  };

  const logPath = path.join(__dirname, 'logs.json');
  fs.appendFile(logPath, JSON.stringify(entry) + '\n', (err) => {
    if (err) console.error('Failed to append credential log:', err);
  });

  // Check credentials (admin / naanbatman)
  if (username === 'admin' && password === 'naanbatman') {
    // Valid login - create session
    const sessionId = createSession('admin', ip);
    res.cookie('admin_session', sessionId, {
      httpOnly: true,
      maxAge: 86400000, // 24 hours
      sameSite: 'lax'
    });
    return res.redirect('/admin/panel');
  } else {
    // Invalid login - redirect back with error
    return res.redirect('/admin?error=Invalid+credentials');
  }
});

// --- Deception routes (placed BEFORE SPA fallback) ---
// match if path contains ../ OR contains etc/passwd anywhere
app.get(/^.*(\.\.\/|etc\/passwd).*$/i, (req, res) => {
  const original = req.originalUrl || req.url || '';
  if (!/\.\.\/|etc\/passwd/i.test(original)) return res.status(404).end();
  const fakePasswd = [
    'root:x:0:0:root:/root:/bin/bash',
    'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin',
    'mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false'
  ].join('\n') + '\n';
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(fakePasswd);
});

// match if path contains ".env" anywhere
app.get(/^.*\.env.*$/i, (req, res) => {
  const original = req.originalUrl || req.url || '';
  if (!/\.env/i.test(original)) return res.status(404).end();
  const fakeEnv = [
    'DB_HOST=localhost',
    'DB_USER=admin',
    'DB_PASS=SuperSecret123',
    'JWT_SECRET=FakeSecretKey',
    'AWS_SECRET=FakeAWSKey'
  ].join('\n') + '\n';
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(fakeEnv);
});

// --- AUTHENTICATION MIDDLEWARE ---
function isAuthenticated(req, res, next) {
  const sessionId = req.cookies?.admin_session;
  if (sessionId && getSession(sessionId)) {
    return next();
  }
  return res.redirect('/admin');
}

// --- ADMIN PANEL - UNIFIED DASHBOARD WITH LOGS ---
app.get('/admin/panel', isAuthenticated, (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Admin Panel — SIEM Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b1220;
      --panel: #0f1724;
      --accent: #4f46e5;
      --accent-hover: #4338ca;
      --text: #e6eef8;
      --muted: #94a3b8;
      --border: rgba(255,255,255,0.04);
      --green: #10b981;
      --yellow: #f59e0b;
      --orange: #ffb020;
      --red: #ef4444;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Inter, system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    
    .container { max-width: 1400px; margin: 0 auto; }
    
    header {
      background: linear-gradient(180deg, rgba(79,70,229,0.1), rgba(0,0,0,0.3));
      border-bottom: 1px solid var(--border);
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    h1 { font-size: 24px; font-weight: 700; }
    
    .header-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .user-info {
      font-size: 13px;
      color: var(--muted);
    }
    
    button {
      background: var(--accent);
      border: none;
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }
    
    button:hover { background: var(--accent-hover); }
    
    .logout-btn {
      background: #dc2626;
    }
    
    .logout-btn:hover { background: #b91c1c; }
    
    .main-content { padding: 20px; }
    
    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }
    
    .tab {
      padding: 12px 20px;
      background: none;
      border: none;
      color: var(--muted);
      cursor: pointer;
      font-weight: 600;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
    }
    
    .tab:hover { color: var(--text); }
    
    .tab.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
    
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    
    .panel {
      background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2));
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .stat-card {
      background: rgba(79,70,229,0.1);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
    }
    
    .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; }
    .stat-value { font-size: 28px; font-weight: 700; color: var(--accent); margin-top: 8px; }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 13px;
    }
    
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
    th { font-weight: 600; color: var(--muted); }
    
    tr:hover { background: rgba(255,255,255,0.01); }
    
    .search-box {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      width: 100%;
      max-width: 300px;
    }
    
    .refresh-info {
      font-size: 12px;
      color: var(--muted);
      margin-top: 8px;
    }
    
    .severity-low { color: var(--green); }
    .severity-medium { color: var(--yellow); }
    .severity-high { color: var(--orange); }
    .severity-critical { color: var(--red); }
  </style>
</head>
<body>
  <header>
    <div class="container" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <h1>🔒 Admin Control Panel</h1>
      <div class="header-right">
        <div class="user-info">Logged in as: <strong>admin</strong></div>
        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>
  </header>

  <div class="main-content container">
    <div class="tabs">
      <button class="tab active" onclick="switchTab('dashboard')">📊 Dashboard</button>
      <button class="tab" onclick="switchTab('logs')">📋 Logs</button>
    </div>

    <!-- DASHBOARD TAB -->
    <div id="dashboard" class="tab-content active">
      <div class="panel">
        <h2 style="margin-bottom: 20px;">Traffic Summary</h2>
        <div class="stats" id="statsContainer">
          <div class="stat-card">
            <div class="stat-label">Total Requests</div>
            <div class="stat-value" id="statTotal">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">High Severity</div>
            <div class="stat-value" id="statHigh">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Critical</div>
            <div class="stat-value" id="statCritical">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Unique IPs</div>
            <div class="stat-value" id="statIPs">0</div>
          </div>
        </div>
        
        <h3 style="margin-top: 24px; margin-bottom: 12px;">Recent Activity (Last 10)</h3>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>IP</th>
              <th>Method</th>
              <th>URL</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody id="dashboardTable">
            <tr><td colspan="5" style="text-align: center; color: var(--muted);">Loading...</td></tr>
          </tbody>
        </table>
        
        <div class="refresh-info">🔄 Auto-updating every 3 seconds | Last update: <span id="dashLastUpdate">-</span></div>
      </div>
    </div>

    <!-- LOGS TAB -->
    <div id="logs" class="tab-content">
      <div class="panel">
        <h2 style="margin-bottom: 16px;">Request Logs</h2>
        <input type="text" id="searchBox" class="search-box" placeholder="Search by IP, method, URL, severity..." />
        
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>Method</th>
              <th>URL</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="logsTable">
            <tr><td colspan="6" style="text-align: center; color: var(--muted);">Loading logs...</td></tr>
          </tbody>
        </table>
        
        <div class="refresh-info">
          Total: <strong id="totalCount">0</strong> | 
          Displayed: <strong id="displayedCount">0</strong> |
          🔄 Auto-updating every 3 seconds | 
          Last update: <span id="logsLastUpdate">-</span>
        </div>
      </div>
    </div>
  </div>

  <script>
    let allLogs = [];
    
    function switchTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
      document.querySelector(\`button[onclick="switchTab('\${tabName}')"]\`).classList.add('active');
    }
    
    async function fetchLogs() {
      try {
        const res = await fetch('/api/logs?limit=2000', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch logs');
        allLogs = await res.json() || [];
        updateDashboard();
        updateLogs();
        return allLogs;
      } catch (err) {
        console.error('Error fetching logs:', err);
        return [];
      }
    }
    
    function updateDashboard() {
      const logs = allLogs;
      const stats = {
        total: logs.length,
        high: logs.filter(l => l.severity === 'HIGH').length,
        critical: logs.filter(l => l.severity === 'CRITICAL').length,
        ips: new Set(logs.map(l => l.ip)).size
      };
      
      document.getElementById('statTotal').textContent = stats.total;
      document.getElementById('statHigh').textContent = stats.high;
      document.getElementById('statCritical').textContent = stats.critical;
      document.getElementById('statIPs').textContent = stats.ips;
      
      const tbody = document.getElementById('dashboardTable');
      tbody.innerHTML = logs.slice(-10).reverse().map(log => \`
        <tr>
          <td style="font-size: 12px;">\${new Date(log.timestamp).toLocaleTimeString()}</td>
          <td><code style="background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">\${log.ip}</code></td>
          <td><strong>\${log.method}</strong></td>
          <td style="font-size: 12px;">\${log.url}</td>
          <td><span class="severity-\${String(log.severity || 'unknown').toLowerCase()}">\${log.severity || 'UNKNOWN'}</span></td>
        </tr>
      \`).join('');
      
      document.getElementById('dashLastUpdate').textContent = new Date().toLocaleTimeString();
    }
    
    function updateLogs() {
      const query = (document.getElementById('searchBox')?.value || '').toLowerCase().trim();
      const filtered = allLogs.filter(log => {
        const searchStr = (log.timestamp + ' ' + log.ip + ' ' + log.method + ' ' + log.url + ' ' + (log.severity || '')).toLowerCase();
        return !query || searchStr.includes(query);
      });
      
      const tbody = document.getElementById('logsTable');
      tbody.innerHTML = filtered.reverse().map(log => \`
        <tr>
          <td style="font-size: 12px;">\${new Date(log.timestamp).toLocaleTimeString()}</td>
          <td><code style="background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">\${log.ip}</code></td>
          <td><strong>\${log.method}</strong></td>
          <td style="font-size: 12px;">\${log.url}</td>
          <td><span class="severity-\${String(log.severity || 'unknown').toLowerCase()}">\${log.severity || 'UNKNOWN'}</span></td>
          <td>\${log.status || 'N/A'}</td>
        </tr>
      \`).join('') || '<tr><td colspan="6" style="text-align: center; color: var(--muted);">No logs match your search</td></tr>';
      
      document.getElementById('totalCount').textContent = allLogs.length;
      document.getElementById('displayedCount').textContent = filtered.length;
      document.getElementById('logsLastUpdate').textContent = new Date().toLocaleTimeString();
    }
    
    document.getElementById('searchBox')?.addEventListener('input', updateLogs);
    
    // Initial load and auto-refresh every 3 seconds
    fetchLogs();
    setInterval(fetchLogs, 3000);
  </script>
</body>
</html>\`);
});

// --- LOGOUT ENDPOINT ---
app.get('/api/admin/logout', (req, res) => {
  const sessionId = req.cookies?.admin_session;
  if (sessionId) delete sessions[sessionId];
  res.clearCookie('admin_session');
  res.redirect('/admin');
});

// --- SIEM-style dashboard & API routes (placed BEFORE SPA fallback) ---
app.get('/api/logs', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Content-Type', 'application/json');
  
  // Return from in-memory cache (instant) - default 500 recent logs
  const limit = parseInt(req.query.limit || '500', 10);
  const capped = Math.min(limit, 2000);
  const recent = recentLogs.slice(-capped);
  
  return res.json(recent);
});

app.get('/api/threats', (req, res) => {
  const scorePath = path.join(__dirname, 'threatScores.json');
  try {
    if (!fs.existsSync(scorePath)) return res.json({});
    const raw = fs.readFileSync(scorePath, 'utf8');
    if (!raw) return res.json({});
    try {
      const parsed = JSON.parse(raw);
      return res.json(parsed);
    } catch(err){
      console.error('Failed to parse threatScores.json', err);
      return res.json({});
    }
  } catch (err) {
    console.error('Failed to read threatScores.json', err);
    return res.status(500).json({ error: 'failed to read threat scores' });
  }
});

// Dashboard UI (vanilla JS + Chart.js CDN)
app.get('/dashboard', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>SIEM Dashboard — ToyLand</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
  <style>
    :root{--bg:#0f172a;--panel:#0b1220;--muted:#94a3b8;--accent:#4f46e5;--card:#0f1724;--glass:rgba(255,255,255,0.02)}
    *{box-sizing:border-box}
    html,body{height:100%}
    body{margin:0;background:var(--bg);color:#e6eef8;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial}

    .container{max-width:1200px;margin:28px auto;padding:28px;display:block}
    header{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}
    h1{margin:0;font-size:28px;font-weight:800}
    .subtitle{color:var(--muted);font-size:13px}

    .dashboard-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}

    .card{background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.04);padding:18px;border-radius:12px;box-shadow:0 10px 30px rgba(2,6,23,0.6)}

    /* Metrics (4 columns) */
    .metrics{grid-column:1 / -1;display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
    .metric{padding:20px;border-radius:10px;background:var(--card);display:flex;flex-direction:column;gap:8px}
    .metric .label{color:var(--muted);font-size:14px}
    .metric .value{font-size:32px;font-weight:800;color:#ffffff}

    /* Charts area */
    .charts{display:grid;grid-template-columns:2fr 3fr;gap:24px}
    .chart-card{padding:18px;border-radius:10px;background:var(--card);display:flex;flex-direction:column;gap:12px;height:320px}
    .chart-canvas{flex:1;min-height:300px}

    .ip-card{padding:18px;border-radius:10px;background:var(--card);height:320px;display:flex;flex-direction:column;gap:12px}
    .ip-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
    .ip-item{display:flex;justify-content:space-between;align-items:center;color:#e6eef8;font-size:13px}
    .ip-score{font-weight:700;color:#a78bfa}

    .controls{display:flex;gap:12px;align-items:center}
    .btn{background:var(--accent);border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:700}
    .muted{color:var(--muted);font-size:13px}

    canvas{width:100% !important;height:300px !important}

    @media (max-width:1100px){.charts{grid-template-columns:1fr;}.metrics{grid-template-columns:repeat(2,1fr)}.ip-card{height:auto}}
    @media (max-width:640px){.metrics{grid-template-columns:1fr}.header{flex-direction:column;align-items:flex-start}}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>SIEM Dashboard</h1>
        <div class="subtitle">Real data from <code>logs.json</code> and <code>threatScores.json</code></div>
      </div>
      <div class="controls">
        <div class="muted">Updated live from server</div>
        <button id="refresh" class="btn">Refresh</button>
      </div>
    </header>

    <section class="dashboard-grid">
      <div class="metrics">
        <div class="card metric"><div class="label">Total Requests</div><div id="totalRequests" class="value">—</div></div>
        <div class="card metric"><div class="label">CRITICAL Requests</div><div id="criticalRequests" class="value">—</div></div>
        <div class="card metric"><div class="label">MALICIOUS IPs</div><div id="maliciousIps" class="value">—</div></div>
        <div class="card metric"><div class="label">Credential Attempts</div><div id="credentialAttempts" class="value">—</div></div>
      </div>

      <div class="card charts" style="grid-column:span 8">
        <div class="chart-card">
          <div style="display:flex;justify-content:space-between;align-items:center"><div class="muted">Severity Distribution</div><div class="muted" id="sevLegendNote"></div></div>
          <div class="chart-canvas"><canvas id="severityChart" aria-label="Severity distribution chart"></canvas></div>
        </div>
        <div class="chart-card">
          <div style="display:flex;justify-content:space-between;align-items:center"><div class="muted">Requests by hour</div><div class="muted" id="timelineNote"></div></div>
          <div class="chart-canvas"><canvas id="hourlyChart" aria-label="Hourly requests chart"></canvas></div>
        </div>
      </div>

      <div class="card ip-card" style="grid-column:span 4">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="muted">Top 5 IP Scores</div>
          <div class="muted" id="lastUpdated">—</div>
        </div>
        <div style="flex:1;display:flex;gap:12px;align-items:stretch">
          <div style="flex:1"><canvas id="ipBarChart" aria-label="Top IP scores"></canvas></div>
        </div>
        <ul id="topIpList" class="ip-list"></ul>
      </div>
    </section>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    // Strict: use only /api/logs and /api/threats — no placeholder or hardcoded numbers
    const COLORS = { LOW:'#10b981', MEDIUM:'#f59e0b', HIGH:'#ef4444', CRITICAL:'#7f1d1d' };

    async function fetchData(){
      const [lRes, tRes] = await Promise.all([fetch('/api/logs'), fetch('/api/threats')]);
      const logs = await lRes.json().catch(()=>[]);
      const threats = await tRes.json().catch(()=>({}));
      return { logs, threats };
    }

    function aggregateLogs(logs){
      const total = logs.length || 0;
      const critical = logs.filter(r => String(r.severity||'').toUpperCase() === 'CRITICAL').length;
      const creds = logs.filter(r => r.type === 'credential_attempt' || (r.username && r.password)).length;

      const sev = { LOW:0, MEDIUM:0, HIGH:0, CRITICAL:0 };
      const hours = new Map();

      for(const row of logs){
        const s = String(row.severity||'').toUpperCase();
        if(sev.hasOwnProperty(s)) sev[s]++;

        const ts = row.timestamp || row.time || null;
        if(!ts) continue;
        const d = new Date(ts);
        if(isNaN(d)) continue;
        const label = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0') + ' ' + String(d.getHours()).padStart(2,'0') + ':00';
        hours.set(label, (hours.get(label)||0) + 1);
      }

      const hourLabels = Array.from(hours.keys()).sort((a,b)=> new Date(a) - new Date(b));
      const hourData = hourLabels.map(k=> hours.get(k) || 0);

      return { total, critical, creds, sev, hourLabels, hourData };
    }

    function aggregateThreats(threats){
      const entries = Object.entries(threats || {}).map(([ip,info]) => ({ ip, score: Number(info.score||0), level: String(info.threat_level||'') }));
      const malicious = entries.filter(e => String(e.level||'').toUpperCase() === 'MALICIOUS').length;
      const top = entries.sort((a,b)=> b.score - a.score).slice(0,5);
      return { malicious, top };
    }

    // Chart instances
    let severityChart = null, hourlyChart = null, ipChart = null;

    function renderMetrics(metrics, threatsAgg){
      document.getElementById('totalRequests').textContent = metrics.total;
      document.getElementById('criticalRequests').textContent = metrics.critical;
      document.getElementById('maliciousIps').textContent = threatsAgg.malicious;
      document.getElementById('credentialAttempts').textContent = metrics.creds;
      document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
    }

    function renderSeverityChart(sev){
      const labels = ['LOW','MEDIUM','HIGH','CRITICAL'];
      const data = labels.map(l => sev[l] || 0);
      const ctx = document.getElementById('severityChart').getContext('2d');
      if(severityChart) severityChart.destroy();
      severityChart = new Chart(ctx, {
        type: 'pie',
        data: { labels, datasets: [{ data, backgroundColor: labels.map(l=>COLORS[l]) }] },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{color:'#cbd5e1',boxWidth:12} } } }
      });
    }

    function renderHourlyChart(labels, dataPoints){
      const ctx = document.getElementById('hourlyChart').getContext('2d');
      if(hourlyChart) hourlyChart.destroy();
      hourlyChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label:'Requests', data: dataPoints, borderColor:'#60a5fa', backgroundColor:'rgba(96,165,250,0.08)', fill:true, tension:0.4, pointRadius:2 }] },
        options: { responsive:true, maintainAspectRatio:false, scales:{ x:{ ticks:{ color:'#9aa6b2' } }, y:{ ticks:{ color:'#9aa6b2' }, beginAtZero:true } }, plugins:{ legend:{ display:false } } }
      });
    }

    function renderIpChart(top){
      const labels = top.map(t=>t.ip);
      const data = top.map(t=>t.score);
      const ctx = document.getElementById('ipBarChart').getContext('2d');
      if(ipChart) ipChart.destroy();
      ipChart = new Chart(ctx, { type:'bar', data:{ labels, datasets:[{ data, backgroundColor:'#a78bfa' }] }, options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, scales:{ x:{ beginAtZero:true, ticks:{color:'#9aa6b2'} }, y:{ ticks:{color:'#cbd5e1'} } }, plugins:{ legend:{ display:false } } } });

      const list = document.getElementById('topIpList');
      list.innerHTML = '';
      if(top.length === 0){
        const li = document.createElement('li'); li.className='ip-item'; li.textContent = 'No IP scores available'; list.appendChild(li); return;
      }
      for(const t of top){
        const li = document.createElement('li'); li.className='ip-item';
        const ip = document.createElement('div'); ip.textContent = t.ip;
        const sc = document.createElement('div'); sc.className = 'ip-score'; sc.textContent = t.score;
        li.appendChild(ip); li.appendChild(sc); list.appendChild(li);
      }
    }

    async function refreshDashboard(){
      const { logs, threats } = await fetchData();
      const logsAgg = aggregateLogs(logs);
      const threatsAgg = aggregateThreats(threats);

      renderMetrics(logsAgg, threatsAgg);
      renderSeverityChart(logsAgg.sev);
      renderHourlyChart(logsAgg.hourLabels, logsAgg.hourData);
      renderIpChart(threatsAgg.top);
    }

    document.getElementById('refresh').addEventListener('click', refreshDashboard);
    // initial render
    refreshDashboard();

    // start polling every 2 seconds
    const dashboardInterval = setInterval(refreshDashboard, 2000);
    window.addEventListener('beforeunload', () => clearInterval(dashboardInterval));
  </script>
</body>
</html>`);
});// Logs UI
app.get('/logs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Logs — SIEM</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  :root{--bg:#0b1220;--panel:#0f1724;--muted:#94a3b8;--accent:#4f46e5;--glass: rgba(255,255,255,0.03)}
  body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;background:var(--bg);color:#e6eef8}
  .wrap{max-width:1100px;margin:28px auto;padding:20px}
  header{display:flex;justify-content:space-between;align-items:center;gap:12px}
  .search{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);color:#e6eef8;padding:8px 10px;border-radius:8px;min-width:280px}
  .btn{background:var(--accent);border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:600}
  table{width:100%;border-collapse:collapse;margin-top:18px}
  th,td{padding:10px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.03);font-size:13px}
  th{color:var(--muted);font-weight:600}
  .sev-LOW{color:#10b981}
  .sev-MEDIUM{color:#f59e0b}
  .sev-HIGH{color:#ffb020}
  .sev-CRITICAL{color:#ef4444}
  .row:hover{background:rgba(255,255,255,0.01)}
  .meta{color:#94a3b8;font-size:13px;margin-top:8px}
  @media (max-width:720px){table{font-size:12px}th,td{padding:8px}}
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <div>
        <h2 style="margin:0">Request Logs</h2>
        <div class="meta">Showing parsed contents of <code>logs.json</code> | Total: <span id="totalCount">0</span> | Displayed: <span id="displayedCount">0</span></div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <input id="q" class="search" placeholder="Search by ip, url, method, severity..." autocomplete="off" />
        <button id="reload" class="btn">Refresh</button>
      </div>
    </header>

    <table id="logsTable" role="table" aria-live="polite">
      <thead><tr><th>Timestamp</th><th>IP</th><th>Method</th><th>URL</th><th>Severity</th><th>Threat Level</th></tr></thead>
      <tbody></tbody>
    </table>
  </div>

  <script>
    function colorClass(sev){
      if(!sev) return 'sev-UNKNOWN';
      const upper = String(sev).toUpperCase();
      return 'sev-' + (upper || 'UNKNOWN');
    }

    async function loadLogs() {
      try {
        const res = await fetch('/api/logs', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch logs');
        const logs = await res.json();
        return Array.isArray(logs) ? logs : [];
      } catch (err) {
        console.error('Error loading logs:', err);
        return [];
      }
    }

    function renderTable(rows, filter) {
      try {
        const tbody = document.querySelector('#logsTable tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        const q = String(filter || '').toLowerCase().trim();
        
        // Update total count
        const totalEl = document.getElementById('totalCount');
        if (totalEl) totalEl.textContent = rows.length;
        
        let displayedCount = 0;
        
        for (const r of rows) {
          if (!r) continue;
          
          const ts = String(r.timestamp || r.time || '');
          const ip = String(r.ip || r.client || '');
          const method = String(r.method || '').toUpperCase() || '-';
          const url = String(r.url || r.path || '');
          const severity = String(r.severity || 'LOW').toUpperCase();
          const level = String(r.threat_level || r.threatLevel || '-');
          
          // Build searchable text from all fields
          const searchText = (ts + ' ' + ip + ' ' + method + ' ' + url + ' ' + severity + ' ' + level).toLowerCase();
          
          // Skip if filter doesn't match
          if (q && searchText.indexOf(q) === -1) {
            continue;
          }
          
          displayedCount++;
          
          const tr = document.createElement('tr');
          tr.className = 'row';
          tr.innerHTML = '<td>' + ts + '</td><td>' + ip + '</td><td>' + method + '</td><td>' + url + '</td><td><span class="' + colorClass(severity) + '">' + severity + '</span></td><td>' + level + '</td>';
          tbody.appendChild(tr);
        }
        
        // Update displayed count
        const displayedEl = document.getElementById('displayedCount');
        if (displayedEl) displayedEl.textContent = displayedCount;
        
      } catch (err) {
        console.error('Error rendering table:', err);
      }
    }

    async function refresh() {
      try {
        const logs = await loadLogs();
        const inputEl = document.getElementById('q');
        const filterValue = inputEl ? inputEl.value : '';
        renderTable(logs, filterValue);
      } catch (err) {
        console.error('Error in refresh:', err);
      }
    }

    // Initialize page
    try {
      const searchInput = document.getElementById('q');
      const reloadBtn = document.getElementById('reload');
      
      if (searchInput && reloadBtn) {
        reloadBtn.addEventListener('click', function() { refresh(); });
        searchInput.addEventListener('input', function() { refresh(); });
        searchInput.addEventListener('change', function() { refresh(); });
        
        // Initial load
        refresh();
        
        // Auto-refresh every 2 seconds
        setInterval(refresh, 2000);
      } else {
        console.error('Required elements not found');
      }
    } catch (err) {
      console.error('Initialization error:', err);
    }
  </script>
</body>
</html>`);
});

// --- SPA fallback (last) ---
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Export for Vercel serverless
export default app;

// Start server locally (not in Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}
