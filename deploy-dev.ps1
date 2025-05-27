# Stop any running processes
Write-Host "Stopping any running Node.js processes..." -ForegroundColor Green
taskkill /F /IM node.exe 2>$null

# Clean dependencies
Write-Host "Cleaning node_modules..." -ForegroundColor Green
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }

# Clean cached files
Write-Host "Cleaning build and cache directories..." -ForegroundColor Green
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
if (Test-Path .cache) { Remove-Item -Recurse -Force .cache }

# Install dependencies
Write-Host "Installing dependencies with legacy peer deps..." -ForegroundColor Green
npm install --legacy-peer-deps

# Start the development server
Write-Host "Starting the application in development mode..." -ForegroundColor Green
Write-Host "The application will be available at http://localhost:3000" -ForegroundColor Cyan
npm run dev 