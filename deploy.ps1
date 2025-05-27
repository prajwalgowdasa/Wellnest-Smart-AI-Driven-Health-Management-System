# Stop any running processes
Write-Host "Stopping any running Node.js processes..." -ForegroundColor Green
taskkill /F /IM node.exe 2>$null

# Clean build files
Write-Host "Cleaning build directories..." -ForegroundColor Green
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
if (Test-Path out) { Remove-Item -Recurse -Force out }

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

# Build the application
Write-Host "Building the application..." -ForegroundColor Green
npm run build

# Start the application in production mode
Write-Host "Starting the application in production mode..." -ForegroundColor Green
npm run start 