@echo off
echo Deploying to GitHub Pages...
copy download.html index.html
git add index.html
git commit -m "Update GitHub Pages"
git push
echo Done!
