@echo off
echo =======================================================
echo  Fixing Vercel Build and MongoDB Connection
echo =======================================================
cd /d "%~dp0"

:: Delete root vercel.json if exists
if exist vercel.json (
    del /f /q vercel.json
    echo [OK] Root vercel.json deleted!
)

:: Delete fix script after use
if exist fix_vercel.bat (
    del /f /q fix_vercel.bat
    echo [OK] fix_vercel.bat cleaned up!
)

:: Stage ALL changes including deletions
echo [1/3] Staging files...
git add -A

:: Commit
echo [2/3] Committing fix...
git commit -m "fix: resolve querySrv ECONNREFUSED with Google DNS servers and automatic direct shard fallback"

:: Push
echo [3/3] Pushing to GitHub...
git push origin main

echo =======================================================
echo  DONE! Both frontend and backend will auto-redeploy.
echo =======================================================
pause
