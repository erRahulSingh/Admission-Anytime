@echo off
echo =======================================================
echo  Fixing Vercel Build - Deleting vercel.json
echo =======================================================
cd /d "%~dp0"

:: Delete vercel.json
if exist vercel.json (
    del /f /q vercel.json
    echo [OK] vercel.json deleted!
) else (
    echo [SKIP] vercel.json not found
)

:: Stage ALL changes including deletions
echo [1/3] Staging files...
git add -A

:: Commit
echo [2/3] Committing fix...
git commit -m "fix: delete vercel.json causing cd frontend build failure on Vercel"

:: Push
echo [3/3] Pushing to GitHub...
git push origin main

echo =======================================================
echo  DONE! Vercel will auto-rebuild now.
echo =======================================================
pause
