#!/bin/bash

cd backend

if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Please run setup.sh first."
    exit 1
fi

echo "Starting backend server..."
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

