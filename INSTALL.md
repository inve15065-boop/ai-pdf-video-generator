# 🚀 Installation Guide

## Prerequisites

Before installing, make sure you have:
- Python 3.8 or higher
- Node.js 16 or higher
- npm (comes with Node.js)
- Git

## Quick Install

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/ai-pdf-video-generator.git
cd ai-pdf-video-generator
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-actual-key-here
```

### 3. Install Backend Dependencies
```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
venv\Scripts\activate    # Windows
source venv/bin/activate # Linux/Mac

# Install Python packages
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 5. Run the Application

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d
```

**Option B: Manual Start**

Terminal 1 (Backend):
```bash
python app.py
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Troubleshooting

### Python packages fail to install
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port already in use
Change the port in the respective config files or stop the conflicting service.

## Next Steps

After installation, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for cloud deployment options.
