# 🚀 Deployment Guide - Render.com (Free Tier)

Your Toyland E-Commerce + SIEM Logging app is now configured for deployment on **Render.com**, a free platform that provides auto-scaling, free domains, and easy GitHub integration.

## Quick Start Steps

### 1. Create a Render Account
- Go to https://render.com
- Sign up with GitHub (recommended for auto-deployment)
- Authorize Render to access your GitHub account

### 2. Create a New Web Service
- Click "New +" and select "Web Service"
- Select your repository: `ab1th/toyland-kids-e-commerce`
- Connect your GitHub account if prompted

### 3. Configure the Service
Fill in these details:
- **Name**: `toyland-ecommerce`
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (or paid if you want 24/7 uptime)

### 4. Add Environment Variables (Optional)
- **NODE_ENV**: `production`
- **PORT**: `3000` (leave blank for Render to assign automatically)

### 5. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy your app
- Wait 5-10 minutes for the first deployment
- Your app URL will be shown: `https://<your-service-name>.onrender.com`

## Features Included

✅ **Free Domain**: `https://toyland-ecommerce.onrender.com`
✅ **Auto-Deploy**: Push to GitHub → Render auto-redeploys
✅ **SSL/HTTPS**: Free SSL certificate included
✅ **Node.js Support**: Runs `npm start` (your Express server)
✅ **React Build**: Automatically builds and serves your React frontend
✅ **Logging Dashboard**: Full access to your `/logs` endpoint and search

## Testing Your Deployment

Once deployed, test these endpoints:
1. **Home Page**: `https://toyland-ecommerce.onrender.com/`
2. **Logs Dashboard**: `https://toyland-ecommerce.onrender.com/logs`
3. **API Endpoint**: `https://toyland-ecommerce.onrender.com/api/logs`

### Test the Search Feature
On the `/logs` page, try searching for:
- `GET` - Filter by HTTP method
- `high` - Filter by severity level
- An IP address - Filter by source IP

## Port Notes
- Render automatically detects `PORT` from environment or defaults to `3000`
- Your `server.js` uses `process.env.PORT || 3000`, so it will work automatically

## Future Deployments
Simply push changes to your `main` branch on GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically detect the push and redeploy your app!

## Free Tier Limitations
- **Sleep Mode**: Free tier services spin down after 15 minutes of inactivity
- **Build Time**: Limited to 5 minutes per build
- **Bandwidth**: Standard free tier limits apply

## Upgrade When Needed
- For 24/7 uptime, upgrade to a paid plan (starts at $7/month)
- Click "Settings" in your Render dashboard and upgrade anytime

## Need Help?
- Render Docs: https://render.com/docs
- Check deployment logs in Render dashboard: Settings → Logs
- GitHub connection issues: Check OAuth permissions in Render account settings
