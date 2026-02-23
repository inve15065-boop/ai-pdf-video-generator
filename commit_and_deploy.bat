@echo off
echo ========================================
echo AI PDF to Video Generator - Deployment
echo ========================================
echo.

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Adding all changes...
git add .
echo.

echo Step 3: Committing changes...
git commit -m "Fix video generation: robust error handling, remove gtts, optimize MoviePy"
echo.

echo Step 4: Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Next steps:
echo 1. Go to Render dashboard: https://dashboard.render.com
echo 2. Find service: pdf-video-backend
echo 3. Click "Manual Deploy" - "Deploy latest commit"
echo 4. Wait for deployment (5-10 minutes)
echo 5. Test at: https://ai-pdf-video-generator.vercel.app
echo.
echo Backend URL: https://pdf-video-backend.onrender.com/health
echo Frontend URL: https://ai-pdf-video-generator.vercel.app
echo.
pause
