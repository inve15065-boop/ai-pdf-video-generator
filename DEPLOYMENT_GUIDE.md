# 🚀 Deployment Guide - AI PDF to Video Generator

## Pre-Deployment Checklist

### ✅ Required
- [ ] OpenAI API key configured in `.env`
- [ ] `.env` file created from template
- [ ] Docker Desktop installed and running (for Docker deployment)
- [ ] Python 3.8+ installed (for local deployment)
- [ ] Node.js 16+ installed (for local deployment)

### ⚙️ Optional
- [ ] Custom SECRET_KEY set in `.env`
- [ ] Azure Speech Services configured (for advanced TTS)
- [ ] SSL certificates for HTTPS
- [ ] Domain name configured
- [ ] CDN setup for static assets

## Deployment Options

### 1. 🏠 Local Development (Fastest for Testing)

**Windows:**
```bash
run_local.bat
```

**Linux/Mac:**
```bash
# Install Python dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start backend
python app.py &

# Install and start frontend
cd frontend
npm install
npm start
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

### 2. 🐳 Docker Deployment (Recommended for Production)

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Manual Docker Commands:**
```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health: http://localhost:5000/health

---

### 3. ☁️ Cloud Deployment

#### AWS (Elastic Beanstalk / ECS)

1. **Install AWS CLI:**
   ```bash
   pip install awscli
   aws configure
   ```

2. **Create ECR repositories:**
   ```bash
   aws ecr create-repository --repository-name pdf-video-backend
   aws ecr create-repository --repository-name pdf-video-frontend
   ```

3. **Build and push images:**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

   # Build and tag
   docker build -t pdf-video-backend .
   docker tag pdf-video-backend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/pdf-video-backend:latest

   # Push
   docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/pdf-video-backend:latest
   ```

4. **Deploy to ECS or Elastic Beanstalk**

#### Azure (Container Instances / App Service)

1. **Install Azure CLI:**
   ```bash
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   az login
   ```

2. **Create resource group:**
   ```bash
   az group create --name pdf-video-rg --location eastus
   ```

3. **Create container registry:**
   ```bash
   az acr create --resource-group pdf-video-rg --name pdfvideoacr --sku Basic
   ```

4. **Build and push:**
   ```bash
   az acr build --registry pdfvideoacr --image pdf-video-backend:latest .
   ```

5. **Deploy to Container Instances:**
   ```bash
   az container create \
     --resource-group pdf-video-rg \
     --name pdf-video-app \
     --image pdfvideoacr.azurecr.io/pdf-video-backend:latest \
     --dns-name-label pdf-video-app \
     --ports 5000
   ```

#### Google Cloud (Cloud Run / GKE)

1. **Install gcloud CLI:**
   ```bash
   curl https://sdk.cloud.google.com | bash
   gcloud init
   ```

2. **Build and push to Container Registry:**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/pdf-video-backend
   ```

3. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy pdf-video-backend \
     --image gcr.io/PROJECT_ID/pdf-video-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

#### Heroku

1. **Install Heroku CLI:**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   heroku login
   ```

2. **Create app:**
   ```bash
   heroku create pdf-video-generator
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set OPENAI_API_KEY=your-key
   heroku config:set SECRET_KEY=your-secret
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

---

## Environment Configuration

### Development (.env)
```env
FLASK_ENV=development
OPENAI_API_KEY=sk-...
SECRET_KEY=dev-secret-key
DEBUG=True
```

### Production (.env)
```env
FLASK_ENV=production
OPENAI_API_KEY=sk-...
SECRET_KEY=random-secure-production-key-change-this
DEBUG=False
MAX_FILE_SIZE=50MB
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## Monitoring & Maintenance

### Health Checks
```bash
# Check backend health
curl http://localhost:5000/health

# Check with Docker
docker-compose ps
docker-compose logs backend
```

### Log Management
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Backup Strategy
```bash
# Backup uploads and outputs
tar -czf backup-$(date +%Y%m%d).tar.gz uploads/ outputs/

# Restore
tar -xzf backup-20260219.tar.gz
```

### Scaling

**Docker Compose (Multiple Instances):**
```bash
docker-compose up -d --scale backend=3
```

**Kubernetes (Production):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pdf-video-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pdf-video-backend
  template:
    metadata:
      labels:
        app: pdf-video-backend
    spec:
      containers:
      - name: backend
        image: your-registry/pdf-video-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: openai
```

---

## Security Hardening

### 1. API Key Management
- Use environment variables, never hardcode
- Rotate keys regularly
- Use different keys for dev/staging/prod

### 2. HTTPS/SSL
```bash
# Generate self-signed cert (dev only)
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Production: Use Let's Encrypt
certbot --nginx -d yourdomain.com
```

### 3. Rate Limiting
Add to `app.py`:
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/upload', methods=['POST'])
@limiter.limit("10 per minute")
def upload_pdf():
    # ...
```

### 4. Input Validation
- Validate file types and sizes
- Sanitize user inputs
- Implement CSRF protection

### 5. Firewall Rules
```bash
# Allow only necessary ports
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

---

## Performance Optimization

### 1. Caching
```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'redis'})

@app.route('/status/<session_id>')
@cache.cached(timeout=60)
def get_status(session_id):
    # ...
```

### 2. CDN for Static Assets
- Use CloudFlare, AWS CloudFront, or Azure CDN
- Serve frontend build from CDN

### 3. Database Optimization
- Add indexes for frequently queried fields
- Use connection pooling
- Implement query caching

### 4. Video Processing Queue
```python
from celery import Celery

celery = Celery('tasks', broker='redis://localhost:6379/0')

@celery.task
def process_video_async(session_id, requirements):
    # Process video in background
    pass
```

---

## Troubleshooting

### Issue: Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Issue: Docker build fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Issue: Out of memory
```bash
# Increase Docker memory limit
# Docker Desktop → Settings → Resources → Memory

# Or in docker-compose.yml:
services:
  backend:
    mem_limit: 2g
```

### Issue: Video generation slow
- Reduce video resolution in `services/video_generator.py`
- Use simpler color schemes
- Implement background job processing

---

## Testing

### Run Full Test Suite
```bash
python test_full_flow.py
```

### Manual API Testing
```bash
# Health check
curl http://localhost:5000/health

# Upload PDF
curl -X POST -F "pdf=@test.pdf" -F "requirements=Create video" http://localhost:5000/upload

# Check status
curl http://localhost:5000/status/SESSION_ID
```

---

## Support & Maintenance

### Regular Tasks
- [ ] Monitor disk space (uploads/outputs folders)
- [ ] Review logs for errors
- [ ] Update dependencies monthly
- [ ] Backup data weekly
- [ ] Test disaster recovery quarterly

### Updates
```bash
# Update Python dependencies
pip install --upgrade -r requirements.txt

# Update Node dependencies
cd frontend
npm update

# Update Docker images
docker-compose pull
docker-compose up -d
```

---

## Success Metrics

Monitor these KPIs:
- Upload success rate
- Average processing time
- Video generation success rate
- API response times
- Error rates
- User satisfaction

---

**Need Help?** Open an issue on GitHub or contact the development team.
