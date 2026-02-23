FROM python:3.11-slim

WORKDIR /app

# Install system dependencies including FFmpeg and fonts
RUN apt-get update && apt-get install -y \
    ffmpeg \
    poppler-utils \
    fonts-dejavu-core \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for MoviePy
ENV IMAGEIO_FFMPEG_EXE=/usr/bin/ffmpeg
ENV FFMPEG_BINARY=/usr/bin/ffmpeg

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p uploads outputs && chmod 755 uploads outputs

# Expose port
EXPOSE 5000

# Run the application with gunicorn and increased timeout
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "600", "--workers", "1", "--worker-class", "sync", "app:app"]
