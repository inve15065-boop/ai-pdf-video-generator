# 🚂 Deploy to Railway.app (Recommended for Video Generation)

## Why Railway?
- ✅ Supports Docker (FFmpeg included)
- ✅ Free $5 credit monthly
- ✅ Automatic deployments from GitHub
- ✅ Better for video processing
- ✅ Faster than Render free tier

---

## 📋 Step-by-Step Deployment

### **Step 1: Create Railway Account** (2 minutes)

1. Go to: https://railway.app
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway
4. You get **$5 free credit** per month!

---

### **Step 2: Deploy Backend** (3 minutes)

1. **On Railway Dashboard:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**

2. **Select Repository:**
   - Find: `inve15065-boop/ai-pdf-video-generator`
   - Click to select

3. **Configure:**
   - Railway will auto-detect Dockerfile
   - Click **"Deploy"**

4. **Add Environment Variables:**
   - Click on your service
   - Go to **"Variables"** tab
   - Click **"New Variable"**
   - Add:
     ```
     OPENAI_API_KEY = sk-your-key-here
     PORT = 5000
     ```

5. **Get Your URL:**
   - Go to **"Settings"** tab
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://your-app.up.railway.app`)

---

### **Step 3: Deploy Frontend** (2 minutes)

**Option A: On Railway**
1. Click **"New"** → **"GitHub Repo"**
2. Select same repository
3. Click **"Add variables"**:
   ```
   REACT_APP_API_URL = https://your-backend-url.up.railway.app
   ```
4. Railway will build and deploy

**Option B: On Vercel (Easier for frontend)**
1. Go to: https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import: `inve15065-boop/ai-pdf-video-generator`
4. Settings:
   ```
   Framework: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   
   Environment Variable:
   REACT_APP_API_URL = https://your-railway-backend.up.railway.app
   ```
5. Click **"Deploy"**

---

## ✅ What You Get:

### With Railway:
- ✅ **Real MP4 videos** (not images!)
- ✅ FFmpeg installed automatically
- ✅ Better performance
- ✅ More memory
- ✅ Faster processing

### Video Features:
- ✅ Multiple scenes
- ✅ Smooth transitions
- ✅ Text animations
- ✅ Gradient backgrounds
- ✅ Professional quality
- ✅ 1920x1080 HD

---

## 💰 Pricing:

**Railway:**
- $5 free credit/month
- ~$0.000463/minute of usage
- Enough for 10,000+ minutes free!
- Only pay if you exceed $5/month

**Vercel (Frontend):**
- 100% FREE for frontend
- Unlimited bandwidth
- Automatic SSL

---

## 🎯 Quick Commands:

### Check if it's working:
```bash
# Test backend
curl https://your-app.up.railway.app/health

# Should return:
{"status":"healthy","message":"AI PDF to Video Generator is running"}
```

---

## 🔧 Troubleshooting:

### Backend not starting:
1. Check Railway logs (click on service → Logs)
2. Verify OPENAI_API_KEY is set
3. Check Dockerfile builds successfully

### Frontend can't connect:
1. Verify REACT_APP_API_URL is correct
2. Make sure backend URL has no trailing slash
3. Check CORS is enabled (it is!)

---

## 📊 Comparison:

| Feature | Render Free | Railway |
|---------|-------------|---------|
| FFmpeg | ❌ No | ✅ Yes (Docker) |
| Video Generation | ❌ Fails | ✅ Works |
| Memory | 512MB | 512MB+ |
| Speed | Slow | Fast |
| Cost | Free | $5 credit/month |
| Reliability | Medium | High |

---

## 🚀 Recommended Setup:

**Best Combination:**
- **Backend**: Railway (for video processing)
- **Frontend**: Vercel (free, fast, reliable)

This gives you:
- ✅ Real video generation
- ✅ Fast performance
- ✅ Reliable deployment
- ✅ Free or very cheap

---

## 📝 Summary:

1. Deploy backend to **Railway** (supports Docker/FFmpeg)
2. Deploy frontend to **Vercel** (free, fast)
3. Connect them with environment variables
4. Enjoy real video generation! 🎬

---

**Railway is the solution for real video generation!** 🚂✨
