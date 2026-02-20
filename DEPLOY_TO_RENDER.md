# 🚀 Deploy to Render.com - Step by Step

## Why Render.com?
- ✅ FREE tier (perfect for your app)
- ✅ Supports Python backend + React frontend
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variables
- ✅ SSL certificates included
- ✅ No credit card required for free tier

---

## 📋 Step-by-Step Deployment (15 minutes)

### **STEP 1: Create Render Account** (2 minutes)

1. Open: https://render.com
2. Click **"Get Started"**
3. Click **"Sign up with GitHub"**
4. Authorize Render to access your repositories
5. You're logged in!

---

### **STEP 2: Deploy Backend (Python/Flask)** (5 minutes)

1. **On Render Dashboard:**
   - Click **"New +"** (top right)
   - Select **"Web Service"**

2. **Connect Repository:**
   - Find and select: `ai-pdf-video-generator`
   - Click **"Connect"**

3. **Configure Backend:**
   ```
   Name: pdf-video-backend
   Region: Choose closest to you (e.g., Oregon USA)
   Branch: main
   Root Directory: (leave empty)
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
   ```

4. **Select Plan:**
   - Choose **"Free"** plan
   - Click **"Advanced"**

5. **Add Environment Variables:**
   Click **"Add Environment Variable"** and add:
   
   ```
   Key: OPENAI_API_KEY
   Value: sk-your-actual-openai-key-here
   
   Key: SECRET_KEY
   Value: your-random-secret-key-here
   
   Key: FLASK_ENV
   Value: production
   
   Key: PYTHON_VERSION
   Value: 3.11.0
   ```

6. **Health Check:**
   - Health Check Path: `/health`

7. **Click "Create Web Service"**

8. **Wait for deployment** (3-5 minutes)
   - You'll see build logs
   - When done, you'll get a URL like: `https://pdf-video-backend.onrender.com`
   - **SAVE THIS URL!** You'll need it for frontend

---

### **STEP 3: Deploy Frontend (React)** (5 minutes)

1. **On Render Dashboard:**
   - Click **"New +"** again
   - Select **"Static Site"**

2. **Connect Repository:**
   - Select same repository: `ai-pdf-video-generator`
   - Click **"Connect"**

3. **Configure Frontend:**
   ```
   Name: pdf-video-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

4. **Add Environment Variable:**
   Click **"Add Environment Variable"**:
   
   ```
   Key: REACT_APP_API_URL
   Value: https://pdf-video-backend.onrender.com
   ```
   
   ⚠️ **IMPORTANT:** Replace with YOUR actual backend URL from Step 2!

5. **Click "Create Static Site"**

6. **Wait for deployment** (2-3 minutes)
   - When done, you'll get a URL like: `https://pdf-video-frontend.onrender.com`

---

### **STEP 4: Test Your App!** (2 minutes)

1. **Open your frontend URL:**
   - Example: `https://pdf-video-frontend.onrender.com`

2. **Test the flow:**
   - Upload a PDF
   - Customize settings
   - Generate video
   - Download result

3. **If it works:** 🎉 Congratulations! Your app is live!

4. **If there are errors:**
   - Check Render logs (click on service → Logs tab)
   - Verify environment variables are correct
   - Make sure backend URL in frontend is correct

---

## 🔧 Troubleshooting

### Backend won't start:
- Check logs in Render dashboard
- Verify `OPENAI_API_KEY` is set correctly
- Make sure `gunicorn` is in requirements.txt (it is!)

### Frontend can't connect to backend:
- Verify `REACT_APP_API_URL` points to your backend URL
- Make sure backend URL includes `https://`
- Check CORS is enabled (it is in your code!)

### "Free instance will spin down with inactivity":
- This is normal for free tier
- First request after inactivity takes 30-60 seconds
- Upgrade to paid plan ($7/month) for always-on

---

## 📊 Your Live URLs

After deployment, you'll have:

**Frontend (User Interface):**
```
https://pdf-video-frontend.onrender.com
```

**Backend (API):**
```
https://pdf-video-backend.onrender.com
```

**Health Check:**
```
https://pdf-video-backend.onrender.com/health
```

---

## 🔄 Auto-Deployments

Every time you push to GitHub:
- Render automatically rebuilds and deploys
- No manual steps needed!

To update your app:
```bash
git add .
git commit -m "Update app"
git push origin main
```

Render will auto-deploy in 2-3 minutes!

---

## 💰 Pricing

**Free Tier Includes:**
- ✅ 750 hours/month (enough for one service)
- ✅ Automatic SSL
- ✅ Custom domains
- ✅ Auto-deploys from GitHub
- ⚠️ Spins down after 15 min inactivity

**Paid Tier ($7/month per service):**
- ✅ Always on (no spin down)
- ✅ Faster builds
- ✅ More resources

---

## 🎯 Next Steps

1. **Custom Domain** (Optional):
   - Go to service settings
   - Add your domain
   - Update DNS records

2. **Environment Variables:**
   - Can update anytime in Render dashboard
   - Changes trigger auto-redeploy

3. **Monitoring:**
   - Check logs in Render dashboard
   - Set up email alerts

4. **Share Your App:**
   - Share your frontend URL
   - Users can start creating videos!

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Your App Logs:** Render Dashboard → Your Service → Logs

---

## ✅ Checklist

Before deploying:
- [ ] GitHub repository is public or Render has access
- [ ] You have your OpenAI API key ready
- [ ] You've read through this guide

After deploying:
- [ ] Backend is running (check health endpoint)
- [ ] Frontend loads correctly
- [ ] Can upload PDF
- [ ] Can generate video
- [ ] Can download video

---

**Ready to deploy? Go to https://render.com and follow the steps above!** 🚀

**Estimated time: 15 minutes**
**Cost: FREE**
**Difficulty: Easy** ⭐⭐⭐

---

Good luck! Your AI PDF to Video Generator will be live soon! 🎬✨
