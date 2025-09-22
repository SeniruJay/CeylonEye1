#!/bin/bash

echo "Starting CeylonEye Tourism Management System..."
echo

echo "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Error installing server dependencies"
    exit 1
fi

echo
echo "Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "Error installing client dependencies"
    exit 1
fi

echo
echo "Dependencies installed successfully!"
echo
echo "To start the application:"
echo "1. Open a new terminal and run: cd server && npm run dev"
echo "2. Open another terminal and run: cd client && npm start"
echo
echo "Make sure MongoDB is running before starting the server!"
echo
