@echo off
echo Starting CeylonEye Tourism Management System...
echo.

echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo To start the application:
echo 1. Open a new terminal and run: cd server && npm run dev
echo 2. Open another terminal and run: cd client && npm start
echo.
echo Make sure MongoDB is running before starting the server!
echo.
pause
