# 🚀 Simple Deployment Guide

## Backend is Already Running ✅
- URL: https://pdf-video-backend.onrender.com
- Health: https://pdf-video-backend.onrender.com/health

## Deploy Frontend on Render:

1. **Go to**: https://dashboard.render.com
2. **Click**: "New +" → "Static Site"
3. **Select**: `inve15065-boop/ai-pdf-video-generator`
4. **Configure**:
   ```
   Name: pdf-video-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```
5. **Environment Variable**:
   ```
   REACT_APP_API_URL = https://pdf-video-backend.onrender.com
   ```
6. **Click**: "Create Static Site"

## That's It!
Your app will be live in 2-3 minutes.
