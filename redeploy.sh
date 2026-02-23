#!/bin/bash

echo "🚀 Redeploying AI PDF to Video Generator..."

# Test video generation locally first
echo "📹 Testing video generation..."
python test_video.py

if [ $? -eq 0 ]; then
    echo "✅ Video generation test passed!"
else
    echo "❌ Video generation test failed. Please check the logs."
    exit 1
fi

# Clean up test files
rm -f outputs/test_session.*

echo "🧹 Cleaning up unnecessary files..."
rm -f test_video.py
rm -f redeploy.sh

echo "📦 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Commit and push changes to GitHub"
echo "2. Redeploy backend on Railway/Render"
echo "3. Test the full application flow"
echo ""
echo "Backend URL: https://pdf-video-backend.onrender.com"
echo "Frontend URL: https://ai-pdf-video-generator.vercel.app"