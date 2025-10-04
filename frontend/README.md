# Interview Voice Bot - Frontend

Next.js frontend application for the interview voice bot with speech-to-text and text-to-speech capabilities.

## Features

- Voice-based interaction using Web Speech API
- Real-time speech recognition and synthesis
- Modern, responsive UI built with Tailwind CSS
- TypeScript for type safety
- Conversation history display

## Technology Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Web Speech API (browser-native)
- Axios for API communication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Browser Compatibility

This application uses the Web Speech API which requires:
- Chrome/Edge (recommended for best experience)
- Safari (with limited speech recognition support)

Note: Speech recognition may not work in Firefox as it lacks support for the Web Speech API.

## Usage

1. Click the microphone button to start recording your question
2. Speak your interview question clearly
3. The bot will process your question and respond via voice
4. View the conversation history in the chat interface
5. Use the clear button to start a new conversation

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

No environment variables needed for the frontend. The backend API URL is configured to `http://localhost:8000` by default.

