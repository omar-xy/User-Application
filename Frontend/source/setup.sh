#!/bin/bash

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Build the frontend
echo "Building the frontend..."
npm run build

# Start the frontend server
echo "Starting the frontend server..."
npm run start