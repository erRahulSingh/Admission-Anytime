@echo off
echo =======================================================
echo  Pushing Admission Anytime Project to GitHub
echo =======================================================
cd /d "%~dp0"

if exist vercel.json (
    del /f /q vercel.json
)

echo [1/3] Staging files...
git add -A

echo [2/3] Committing updates...
git commit -m "fix: remove vercel.json to resolve Vercel Root Directory build error"

echo [3/3] Pushing code to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo Trying fallback push...
    git push origin master
)

echo =======================================================
echo  Git Push Completed successfully!
echo =======================================================
pause
