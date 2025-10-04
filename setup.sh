#!/bin/bash

echo "Setting up Interview Voice Bot"
echo "=============================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo ""
echo "Setting up Backend..."
echo "--------------------"

cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Check for .env file
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file..."
    echo "GROQ_API_KEY=your_groq_api_key_here" > .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your Groq API key"
    echo "   Get your free API key from: https://console.groq.com"
fi

cd ..

echo ""
echo "Setting up Frontend..."
echo "--------------------"

cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

echo ""
echo "=============================="
echo "Setup Complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in Chrome or Edge"
echo ""
echo "Note: Don't forget to add your Groq API key to backend/.env"
echo "=============================="

