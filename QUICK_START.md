# 🚀 Quick Start Guide

## Get Running in 5 Minutes!

### Prerequisites Check

Before starting, make sure you have:
- [ ] Docker Desktop installed and running
- [ ] OpenAI API key (get one at https://platform.openai.com/api-keys)

---

## 🎯 Fastest Way to Start

### Step 1: Configure Environment (30 seconds)

1. Open the `.env` file in the project root
2. Add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
3. Save the file

### Step 2: Deploy with Docker (2 minutes)

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Step 3: Access the Application (10 seconds)

Open your browser to:
- **Frontend**: http://localhost:3000
- **Backend Health**: http://localhost:5000/health

---

## 🎬 Using the Application

### 1. Upload PDF
- Drag and drop your PDF file
- Or click to browse and select
- Click "Upload & Continue"

### 2. Customize Video
- Choose video style (Professional, Creative, Minimal, Dynamic)
- Select duration (Short, Medium, Long)
- Pick tone (Informative, Engaging, Formal, Casual)
- Add any additional requirements
- Click "Continue"

### 3. Processing
- Watch real-time progress
- AI analyzes your PDF
- Video is generated automatically
- Takes 30-60 seconds typically

### 4. Download
- Click "Download Video"
- Your video is ready!
- Click "Create Another" to process more PDFs

---

## 🔧 Alternative: Local Development

If you prefer not to use Docker:

### Windows:
```bash
run_local.bat
```

### Linux/Mac:
```bash
# Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py &

# Frontend (in new terminal)
cd frontend
npm install
npm start
```

---

## ✅ Verify Everything Works

### Test Backend:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "AI PDF to Video Generator is running"
}
```

### Test Frontend:
Open http://localhost:3000 in your browser

---

## 🐛 Troubleshooting

### Issue: "Port already in use"
**Solution:**
```bash
# Stop existing containers
docker-compose down

# Or change ports in docker-compose.yml
```

### Issue: "Docker is not running"
**Solution:**
- Start Docker Desktop
- Wait for it to fully start
- Try again

### Issue: "OpenAI API error"
**Solution:**
- Verify your API key in `.env`
- Check you have credits at https://platform.openai.com/account/usage
- The app has a fallback mode that works without AI

### Issue: Frontend won't load
**Solution:**
```bash
# Check if backend is running
curl http://localhost:5000/health

# Restart services
docker-compose restart
```

---

## 📊 What to Expect

### Performance:
- Upload: < 1 second
- Processing: 30-60 seconds
- Download: Instant

### File Limits:
- Max PDF size: 50MB
- Recommended: < 10MB for best performance

### Video Output:
- Format: MP4
- Resolution: 1920x1080
- FPS: 30
- Duration: Based on content and settings

---

## 🎨 Tips for Best Results

1. **PDF Quality**: Clear, well-formatted PDFs work best
2. **Content Length**: 5-10 pages is ideal
3. **Requirements**: Be specific about what you want
4. **Style**: Match style to your content type
5. **Duration**: Start with "Medium" for balanced results

---

## 📚 Next Steps

Once you're comfortable with the basics:

1. **Read the full README.md** for detailed features
2. **Check DEPLOYMENT_GUIDE.md** for production deployment
3. **Review PROJECT_STATUS.md** for technical details
4. **Run test_full_flow.py** to verify all features

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review logs: `docker-compose logs -f`
3. Read DEPLOYMENT_GUIDE.md for detailed help
4. Open an issue on GitHub

---

## 🎉 You're Ready!

That's it! You now have a fully functional AI PDF to Video Generator.

**Start creating amazing videos from your PDFs!** 🚀

---

**Pro Tip**: Bookmark http://localhost:3000 for quick access!
