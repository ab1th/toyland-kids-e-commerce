# 🚀 Deployment Guide - Railway.app

Your ToyLand E-Commerce app is ready to be deployed **live online** in just 3 minutes!

## ✅ What's Already Set Up
- Node.js + Express server configured
- React frontend built to `/dist`
- Environment variables ready (`process.env.PORT`)
- GitHub repo synced and ready
- `npm start` script added to package.json

## 🎯 Fastest Deployment (Without CLI)

### Step 1: Go to Railway.app
1. Open https://railway.app
2. Click **"Start a new project"**
3. Choose **"Deploy from GitHub repo"**

### Step 2: Connect Your GitHub Account
1. Click **"GitHub"** from the options
2. Authorize Railway to access your GitHub
3. Select the **`toyland-kids-e-commerce`** repository

### Step 3: Configure Deployment
1. Railway will auto-detect it's a **Node.js** app ✅
2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`
4. **Port:** Keep as default (Railway sets `PORT` env var automatically)
5. Click **"Deploy"** 🚀

### Step 4: Wait for Build (2-3 minutes)
- Watch the build logs
- Once you see "✅ Deployment successful", you're online!

## 🌐 Get Your Live URL

Once deployed:
1. Go to your Railway project
2. Click the **"Deployments"** tab
3. Find your domain (looks like: `toylandapp-production.up.railway.app`)
4. Visit: `https://yourdomain.up.railway.app` ✅

## 📊 Test Your Deployed App

Visit these URLs on your live domain:
- `https://yourdomain.up.railway.app/` - Main e-commerce site
- `https://yourdomain.up.railway.app/logs` - SIEM logs dashboard
- `https://yourdomain.up.railway.app/api/logs` - API endpoint

Try the search on `/logs` - it should work perfectly! 🎉

## 🔐 Important Notes

### Data Persistence
- Your `logs.json` will be reset on each deployment
- For production: Add MongoDB Atlas (free tier available)

### Custom Domain (Optional)
You can add a free custom domain from Freenom.com to your Railway app:
1. Register free domain: `.tk`, `.ml`, `.ga` from https://freenom.com
2. Go to Railway project → Settings → Domains
3. Add custom domain and point to Railway nameservers

## 📜 Build Pipeline

The deployment will:
```bash
npm run build          # Builds React app to /dist
npm start              # Starts Express server (serves /dist + API)
```

## 🆘 Troubleshooting

**Build fails?**
- Check logs in Railway dashboard
- Ensure `npm run build` works locally: `npm run build && npm start`

**Can't connect?**
- Check if port 3000 is exposed (Railway does this automatically)
- Verify server.js is running: should see "Server listening on port 3000"

**Logs endpoint returns 500?**
- The `logs.json` file doesn't persist between deploys
- This is normal for free tier
- In production, integrate a database

## 🎉 You're Done!

Your app is now **live online** with:
- ✅ Free domain (yourdomain.up.railway.app)
- ✅ Free SSL/HTTPS
- ✅ Auto-scaling
- ✅ Git auto-deploy (push to `main` = auto-redeploy)

Enjoy! 🚀
