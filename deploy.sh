#!/bin/bash

# Stop any running processes
echo "Stopping any running Node.js processes..."
taskkill /F /IM node.exe 2>/dev/null || true

# Clean build files
echo "Cleaning build directories..."
rm -rf .next || true
rm -rf out || true

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Start the application in production mode
echo "Starting the application in production mode..."
npm run start 