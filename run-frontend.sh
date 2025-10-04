#!/bin/bash

cd frontend

if [ ! -d "node_modules" ]; then
    echo "Node modules not found. Please run setup.sh first."
    exit 1
fi

echo "Starting frontend development server..."
npm run dev

