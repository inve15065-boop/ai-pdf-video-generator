# 🎬 AI PDF to Video Generator

Transform your PDF documents into engaging videos with AI-powered content analysis and creative video generation.

## ✨ Features

- 📄 PDF text and image extraction
- 🤖 AI-powered content transformation using OpenAI
- 🎨 Creative video styling with dynamic gradients and patterns
- 🎯 Customizable video styles, duration, and tone
- 🎭 Multiple color schemes and visual effects
- 📱 Modern, responsive web interface
- 🚀 Production-ready with Docker support

## 🛠️ Tech Stack

- **Backend**: Python 3.11, Flask
- **AI/ML**: OpenAI GPT-3.5
- **PDF Processing**: PyPDF2
- **Video Generation**: MoviePy, Pillow
- **Text-to-Speech**: gTTS
- **Frontend**: React.js 18, Material-UI
- **Deployment**: Docker, Docker Compose

## 🚀 Quick Start

### Option 1: Local Development

1. **Set up environment:**
   ```bash
   # Copy environment template
   copy .env.example .env    # Windows
   cp .env.example .env      # Linux/Mac
   
   # Edit .env and add your OpenAI API key
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   pip install -r requirements.txt
   
   # Frontend
   cd frontend
   npm install
   cd ..
   ```

3. **Verify installation:**
   ```bash
   python verify_install.py
   ```

4. **Run the application:**
   ```bash
   # Backend (Terminal 1)
   python app.py
   
   # Frontend (Terminal 2)
   cd frontend
   npm start
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Option 2: Docker Deployment

1. **Make sure Docker Desktop is running**

2. **Deploy with one command:**
   ```bash
   deploy.bat
   ```
   Or on Linux/Mac:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 📋 Prerequisites

### For Local Development:
- Python 3.8 or higher
- Node.js 16 or higher
- FFmpeg (for video generation)

### For Docker Deployment:
- Docker Desktop
- Docker Compose

## 🔧 Configuration

1. **Copy the environment file:**
   ```bash
   copy doc_2026-02-18_16-09-08.env .env
   ```

2. **Update `.env` with your API keys:**
   ```env
   OPENAI_API_KEY=your-openai-api-key-here
   SECRET_KEY=your-secret-key-here
   ```

## 📖 Usage

1. **Upload PDF**: Drag and drop or click to select your PDF file
2. **Customize**: Choose video style, duration, and tone
3. **Process**: AI analyzes and transforms your content
4. **Download**: Get your generated video

## 🎨 Video Customization Options

- **Styles**: Professional, Creative, Minimal, Dynamic
- **Duration**: Short (1-2 min), Medium (3-5 min), Long (5+ min)
- **Tone**: Informative, Engaging, Formal, Casual

## 📁 Project Structure

```
.
├── app.py                  # Main Flask application
├── services/               # Backend services
│   ├── pdf_processor.py    # PDF extraction
│   ├── ai_transformer.py   # AI content transformation
│   └── video_generator.py  # Video creation
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.js          # Main app component
│   └── public/
├── uploads/                # Uploaded PDFs (auto-created)
├── outputs/                # Generated videos (auto-created)
├── docker-compose.yml      # Docker orchestration
├── Dockerfile              # Backend Docker image
└── requirements.txt        # Python dependencies
```

## 🔌 API Endpoints

- `GET /health` - Health check
- `POST /upload` - Upload PDF file
- `POST /process/<session_id>` - Process PDF and generate video
- `GET /download/<session_id>` - Download generated video
- `GET /status/<session_id>` - Check processing status

## 🐛 Troubleshooting

### Backend won't start:
- Check if port 5000 is available
- Verify Python dependencies: `pip install -r requirements.txt`
- Check `.env` file exists

### Frontend won't start:
- Check if port 3000 is available
- Install dependencies: `cd frontend && npm install`
- Clear cache: `npm cache clean --force`

### Video generation fails:
- Ensure FFmpeg is installed
- Check OpenAI API key is valid
- Verify sufficient disk space in `outputs/` folder

### Docker issues:
- Ensure Docker Desktop is running
- Try: `docker-compose down && docker-compose up --build`
- Check logs: `docker-compose logs -f`

## 🔒 Security Notes

- Change `SECRET_KEY` in `.env` for production
- Never commit `.env` file to version control
- Use environment-specific API keys
- Implement rate limiting for production use
- Add authentication for multi-user deployments

## 📊 Performance Tips

- PDFs under 10MB process faster
- Shorter videos (1-2 min) generate quicker
- Use simple styles for faster rendering
- Consider using Redis for job queuing in production

## 🚀 Production Deployment

### Deploy to Cloud (AWS, Azure, GCP):

1. **Build Docker images:**
   ```bash
   docker-compose build
   ```

2. **Push to container registry:**
   ```bash
   docker tag pdf-video-backend:latest your-registry/pdf-video-backend
   docker push your-registry/pdf-video-backend
   ```

3. **Deploy using your cloud provider's container service**

### Environment Variables for Production:
```env
FLASK_ENV=production
OPENAI_API_KEY=your-key
SECRET_KEY=random-secure-key
MAX_FILE_SIZE=50MB
```

## 📝 License

This project is provided as-is for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📧 Support

For issues and questions, please open a GitHub issue or contact the development team.

---

Made with ❤️ using AI and modern web technologies