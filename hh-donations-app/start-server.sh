#!/bin/bash

# H&H Donations - Robust Server Startup Script
# This script ensures the React development server stays running

echo "🚀 Starting H&H Donations Development Server..."

# Kill any existing processes on port 3000
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true

# Function to start the server
start_server() {
    echo "📦 Installing dependencies..."
    npm install --silent
    
    echo "🏁 Starting React development server..."
    npm start
}

# Function to handle cleanup on script exit
cleanup() {
    echo "🛑 Shutting down server..."
    lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Main loop with auto-restart capability
while true; do
    echo "🔄 Attempting to start server..."
    
    # Start the server
    start_server
    
    # If we reach here, the server crashed
    echo "⚠️  Server crashed or stopped unexpectedly!"
    echo "🔄 Waiting 3 seconds before restart..."
    sleep 3
    
    echo "🧹 Cleaning up crashed processes..."
    lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true
    
    echo "🔄 Restarting server..."
done