#!/bin/bash

# Build the React app
echo "Building React app..."
cd client
npm install
npm run build
cd ..

# Install server dependencies
echo "Installing server dependencies..."
npm install

# Run database setup
echo "Setting up database..."
npm run setup-db

echo "Build completed successfully!" 