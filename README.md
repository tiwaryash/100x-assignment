# Interview Voice Bot for 100x

A full-stack AI-powered voice bot application designed for conducting interviews for the AI Agent Team position at 100x. The application features natural voice interaction using speech-to-text and text-to-speech technologies, powered by Groq's LLM API.

## Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Voice Input**: Web Speech API (Speech Recognition)
- **Voice Output**: Web Speech API (Speech Synthesis)
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **LLM Integration**: Groq API (llama-3.1-70b-versatile)
- **API Design**: RESTful architecture
- **CORS**: Enabled for local development

## Features

- Real-time voice interaction with natural language processing
- Professional interview responses tailored to the candidate profile
- Modern, intuitive user interface
- Conversation history tracking
- Browser-native speech recognition and synthesis (no external APIs required for voice)
- Responsive design for various screen sizes

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Groq API key (free tier available at [console.groq.com](https://console.groq.com))
- Chrome or Edge browser (recommended for best speech API support)

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```bash
GROQ_API_KEY=your_groq_api_key_here
```

5. Start the backend server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

1. **Start Conversation**: Click the blue microphone button to begin speaking
2. **Ask Questions**: Speak your interview question clearly
3. **Listen to Response**: The bot will respond via voice automatically
4. **Review History**: All conversations are displayed in the chat interface
5. **Stop Speaking**: Click the mute button to interrupt the bot's response
6. **Clear Chat**: Use the trash icon to start a fresh conversation

## Sample Interview Questions

The bot is designed to answer questions such as:

- What should we know about your life story in a few sentences?
- What's your number one superpower?
- What are the top 3 areas you'd like to grow in?
- What misconception do your coworkers have about you?
- How do you push your boundaries and limits?

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
100x-assignment/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── README.md           # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   │   ├── layout.tsx  # Root layout
│   │   │   ├── page.tsx    # Home page
│   │   │   └── globals.css # Global styles
│   │   └── components/
│   │       └── VoiceBot.tsx # Main voice bot component
│   ├── package.json        # Node dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── README.md          # Frontend documentation
└── README.md              # This file
```

## Technology Choices

### Why Groq?
- Free tier with generous limits
- Fast inference with high-quality responses
- Access to powerful open-source models (Llama 3.1)
- Simple API integration

### Why Web Speech API?
- Browser-native, no external API costs
- Low latency for real-time interaction
- No additional setup required
- Good accuracy for English speech

### Why Next.js + FastAPI?
- Next.js provides excellent developer experience and performance
- FastAPI offers high-performance async Python with automatic API documentation
- Clear separation of concerns between frontend and backend
- Easy deployment to various platforms

## Deployment Considerations

### Frontend Deployment
The frontend can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any static hosting service

### Backend Deployment
The backend can be deployed to:
- Railway
- Render
- Heroku
- AWS EC2/ECS
- Google Cloud Run

### Environment Configuration
When deploying, ensure:
1. Backend URL is updated in frontend (currently `http://localhost:8000`)
2. CORS origins are updated in backend to allow production domain
3. Groq API key is set as an environment variable
4. HTTPS is enabled for production (required for Web Speech API on some browsers)

## Browser Compatibility

### Fully Supported
- Chrome 25+
- Edge 79+
- Safari 14.1+ (with some limitations)

### Limited Support
- Firefox (does not support Web Speech Recognition API)
- Opera (based on Chromium, should work)

For best results, use Chrome or Edge.

## Development

### Running in Development Mode

Backend:
```bash
cd backend
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
npm start
```

Backend:
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Troubleshooting

### Speech Recognition Not Working
- Ensure you're using Chrome or Edge
- Check microphone permissions in browser settings
- Verify microphone is working in system settings

### Backend Connection Error
- Verify backend is running on `http://localhost:8000`
- Check CORS settings if accessing from different domain
- Ensure Groq API key is correctly set

### Voice Synthesis Not Working
- Check browser audio settings
- Verify system volume is not muted
- Try refreshing the page

## License

This project is created for the 100x interview assessment.

## Contact

For questions or issues, please contact the repository owner.

