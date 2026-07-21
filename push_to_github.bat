@echo off
echo =======================================================
echo  Pushing Admission Anytime Project to GitHub
echo =======================================================
cd /d "%~dp0"

:: Stage changes
echo [1/3] Staging files...
git add .

:: Commit changes
echo [2/3] Committing updates...
git commit -m "feat: convert homepage trust section to 1x2 cards grid on mobile"

:: Push changes
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
