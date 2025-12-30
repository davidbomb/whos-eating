@echo off
echo Building application for GitHub Pages...
cd whos-eating-app
call npm run build -- --configuration production --base-href=/whos-eating/
echo.
echo Build complete! Files are in whos-eating-app\dist\whos-eating-app\browser
echo.
echo To deploy manually, you can use:
echo npx angular-cli-ghpages --dir=dist/whos-eating-app/browser
pause

