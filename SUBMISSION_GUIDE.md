# 100x Interview Submission Guide

This guide will help you customize and deploy the voice bot for your 100x interview submission.

## Personalization

Before submitting, customize the bot to represent YOU authentically.

### Step 1: Update the System Prompt

Edit `backend/main.py` and modify the `SYSTEM_PROMPT` variable (starting around line 27):

```python
SYSTEM_PROMPT = """You are a professional candidate being interviewed for an AI Agent Team position at 100x. 
Answer questions authentically and professionally based on the following profile:

Background: [YOUR BACKGROUND - Replace with your actual background]

Superpower: [YOUR #1 SUPERPOWER - What makes you exceptional]

Growth Areas:
1. [AREA 1 - What you want to improve]
2. [AREA 2 - Another growth area]
3. [AREA 3 - Third area of development]

Misconception: [COMMON MISCONCEPTION - What do people misunderstand about you]

Pushing Boundaries: [HOW YOU PUSH LIMITS - Your approach to growth and challenges]

Keep responses conversational, authentic, and concise (2-4 sentences typically). Show enthusiasm for the role 
while remaining professional."""
```

### Step 2: Test Locally

1. Start both services:
```bash
# Terminal 1
./run-backend.sh

# Terminal 2
./run-frontend.sh
```

2. Open http://localhost:3000 in Chrome/Edge

3. Test with the sample questions:
   - What should we know about your life story?
   - What's your #1 superpower?
   - What are the top 3 areas you'd like to grow in?
   - What misconception do your coworkers have about you?
   - How do you push your boundaries and limits?

4. Ensure responses reflect YOUR authentic voice

## Deployment Options

### Option 1: Vercel + Railway (Recommended)

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set root directory to `frontend`
4. Deploy

**Backend (Railway):**
1. Sign up at [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Select `backend` directory
4. Add environment variable: `GROQ_API_KEY`
5. Deploy

**Connect them:**
1. Get your Railway backend URL
2. Update `frontend/src/components/VoiceBot.tsx` line 64:
```typescript
const response = await axios.post('https://your-backend-url.railway.app/chat', {
```
3. Redeploy frontend

**Cost:** Both have free tiers suitable for this assessment

### Option 2: Docker + Cloud Run

See `DEPLOYMENT.md` for detailed Docker instructions.

### Option 3: Single Server (Cheaper)

Deploy both on a single VPS (DigitalOcean, Linode, etc.):
1. Use Docker Compose (see `DEPLOYMENT.md`)
2. Set up Nginx as reverse proxy
3. Configure SSL with Let's Encrypt

## Pre-Submission Checklist

- [ ] System prompt updated with YOUR information
- [ ] Tested all sample interview questions
- [ ] Responses sound natural and authentic
- [ ] Backend deployed and accessible via HTTPS
- [ ] Frontend deployed and accessible via HTTPS
- [ ] Microphone permissions work correctly
- [ ] Speech recognition works in Chrome/Edge
- [ ] Text-to-speech plays responses clearly
- [ ] No API keys exposed in frontend code
- [ ] CORS configured for production domains
- [ ] Tested on mobile device (if applicable)

## Email Submission Template

```
To: bhumika@100x.inc
Subject: GEN AI: GEN AI ROUND 1 ASSESSMENT (LINKEDIN)

Dear 100x Team,

I'm excited to submit my assessment for the AI Agent Team position.

Application URL: https://your-app-url.vercel.app

Key Features:
- Voice-based interview interaction
- Natural language processing with Groq LLM
- Real-time speech recognition and synthesis
- Modern, responsive UI
- No manual API key entry required

Technical Stack:
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- AI: Groq API (Llama 3.1)
- Voice: Web Speech API

The application is fully functional and ready for testing. Please use Chrome or Edge for the best experience.

I've attached my resume as requested.

Best regards,
[Your Name]
[Your LinkedIn Profile]
[Your Phone Number]
```

## Testing Instructions for Reviewers

Include this in your submission or as a separate document:

```
# Testing Guide for Reviewers

1. Open the application in Chrome or Edge (required for speech recognition)
2. Click the blue microphone button
3. Allow microphone permissions when prompted
4. Ask any of these questions:
   - What should we know about your life story?
   - What's your #1 superpower?
   - What are the top 3 areas you'd like to grow in?
   - What misconception do your coworkers have about you?
   - How do you push your boundaries and limits?

5. The bot will respond via voice and text
6. Continue the conversation naturally
7. Click the trash icon to start a new conversation

Note: The application works best in Chrome or Edge. If speech recognition doesn't work, 
please check browser permissions and ensure microphone access is granted.
```

## Common Deployment Issues

### CORS Errors
Update `backend/main.py`:
```python
allow_origins=["https://your-frontend-domain.vercel.app"],
```

### Speech API Not Working in Production
- Ensure site uses HTTPS (required by browsers)
- Check microphone permissions
- Verify browser compatibility

### Backend URL Not Found
- Confirm backend is running and accessible
- Check environment variables
- Update URL in frontend code

## Tips for a Strong Submission

1. **Test thoroughly**: Ensure all features work before submitting
2. **Personalize**: Make sure responses reflect YOUR authentic voice
3. **Document well**: Clear instructions help reviewers
4. **Optimize performance**: Fast responses create better impressions
5. **Handle errors gracefully**: Show error messages to users
6. **Mobile-friendly**: Test on different screen sizes if possible

## Additional Resources

- [Groq Console](https://console.groq.com) - Get API key and check usage
- [Vercel Docs](https://vercel.com/docs) - Frontend deployment
- [Railway Docs](https://docs.railway.app) - Backend deployment
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Browser compatibility

## Questions?

If you encounter issues:
1. Check `QUICKSTART.md` for setup issues
2. Review `DEPLOYMENT.md` for deployment problems
3. Consult `README.md` for architecture details

Good luck with your submission!

