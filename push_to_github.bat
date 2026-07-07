@echo off
echo =======================================================
echo  Pushing Admission Anytime Project to GitHub
echo =======================================================
cd /d "%~dp0"

:: Initialize Git if not already done
if not exist ".git" (
    echo [1/4] Initializing Git repository...
    git init
) else (
    echo [1/4] Git repository already initialized.
)

:: Set/Update Remote URL
git remote remove origin >nul 2>&1
git remote add origin https://github.com/erRahulSingh/Admission-Anytime.git
echo [2/4] Remote origin set to: https://github.com/erRahulSingh/Admission-Anytime.git

:: Stage changes
echo [3/4] Staging files...
git add .

:: Commit changes
echo [4/4] Committing updates...
git commit -m "Upgrade site footer, admin CRM modules, layout exclusion routes, and premium Facebook Ads landing page"

:: Push changes
echo [5/5] Pushing code to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo Trying fallback push to master branch...
    git push -u origin master
)

echo =======================================================
echo  Git Push Completed successfully!
echo =======================================================
pause
