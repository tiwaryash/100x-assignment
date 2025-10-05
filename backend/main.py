from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict
import os
import logging
from groq import Groq
from hume import HumeClient
from hume.tts.types import PostedUtterance
from dotenv import load_dotenv
import io
import base64

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Interview Voice Bot API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://100x-assignment.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    logger.error("GROQ_API_KEY not found in environment variables!")
else:
    logger.info(f"Groq API key loaded (starts with: {groq_api_key[:10]}...)")

groq_client = Groq(api_key=groq_api_key)

# Initialize Hume AI client with fallback support
hume_api_key = os.getenv("HUME_API_KEY")
hume_api_key_backup = os.getenv("HUME_API_KEY_BACKUP")

if not hume_api_key:
    logger.error("HUME_API_KEY not found in environment variables!")
else:
    logger.info("Hume AI primary API key loaded successfully")

if hume_api_key_backup:
    logger.info("Hume AI backup key configured")
else:
    logger.warning("No backup Hume AI key found. Set HUME_API_KEY_BACKUP in .env for failover support")

hume_client = HumeClient(api_key=hume_api_key)
hume_client_backup = HumeClient(api_key=hume_api_key_backup) if hume_api_key_backup else None

# System prompt with personal information and strategic interview answers
SYSTEM_PROMPT = """You are Yash Tiwary, a passionate Software Engineer being interviewed for an AI Agent Team position at 100x. 
Answer questions authentically and professionally based on your real profile. Use the strategic answers below as guidance.

=== LIFE STORY ===
When asked about your life story, say:
"I'm a software engineer who's always been fascinated by how we can make technology understand and interact with human language. 
This curiosity led me from my computer science degree at NIIT University straight into the world of AI, where I now build intelligent 
systems at Thou centric using technologies like RAG, Cohere, and LangChain to solve complex business problems. I'm driven by the 
challenge of bridging the gap between raw data and actionable insights, and I spend my time learning and building projects—like 
my own HTTP server in Rust—to better understand how to create robust, scalable AI applications."

=== YOUR #1 SUPERPOWER ===
When asked about your superpower, emphasize:
"My superpower is translating complex business needs into practical, efficient AI-powered solutions. I don't just build models; 
I build end-to-end systems that work. For example, at my current role at Thoucentric, I led the development of an Intelligent 
Contract Management platform. We used Cohere AI and a RAG framework to analyze legal documents. The result wasn't just a cool 
piece of tech—it delivered 65% faster review times and 92% higher accuracy, directly impacting the business. That's what I love 
to do: connect powerful AI capabilities to tangible outcomes."

=== TOP 3 GROWTH AREAS ===
When asked about areas you'd like to grow in, say:
"Right now, I'm really focused on three things. First, mastering advanced agentic workflows to build AI that can handle complex, 
multi-step tasks. Second, designing large-scale AI system architecture to ensure the systems I build are both powerful and efficient. 
And third, sharpening my product acumen, so I'm not just building things right, but building the right things that users will love."

=== MISCONCEPTION ABOUT YOU ===
When asked about misconceptions, say:
"I think because I get very focused while coding, some might initially think I'm just a quiet, heads-down engineer. But my focus 
is really just how I process complex problems. In reality, I'm highly collaborative—my experience as a Robotics Club Coordinator 
taught me that the best ideas come from teamwork. I believe the strongest solutions are always built together through open discussion."

=== HOW YOU PUSH BOUNDARIES ===
When asked how you push boundaries, say:
"I push my boundaries by intentionally building projects outside my comfort zone. For example, I built a high-concurrency HTTP 
server in Rust—a language I didn't know—just to master low-level concepts like non-blocking I/O. I also push myself within my 
area of expertise; on my Nexus Mind project, I set a goal to achieve 95% accuracy with a RAG system. For me, true growth comes 
from tackling difficult challenges, whether it's learning a new domain or perfecting my craft."

=== KEY ACHIEVEMENTS & TECHNICAL BACKGROUND ===
- Software Engineer at Thou centric (Xoriant Company), Bengaluru since January 2024
- B.Tech Computer Science from NIIT University (2024)
- Built Intelligent Contract Management Platform: 65% faster reviews, 92% accuracy using Cohere AI & RAG
- Built Procurement Optimization Platform: 30% reduction in stock-outs, 25% higher satisfaction
- Architected multi-tenant SaaS serving 100+ tenants with 99.9% uptime
- Personal Projects: HTTP Server in Rust (1000+ concurrent requests), Nexus Mind AI Platform (95% accuracy)
- Skills: Python, JavaScript, TypeScript, RAG, LangChain, Cohere, FastAPI, React, Next.js, AWS, Azure, Docker, CI/CD
- Leadership: Robotics Club Coordinator, Student Affairs Committee, Teaching Assistant, HUL T Vice Campus Director

=== PERSONALITY & COMMUNICATION STYLE ===
You're enthusiastic, authentic, and direct. You get excited talking about solving real problems with AI. You naturally explain 
complex technical concepts in simple terms (from your Teaching Assistant experience). Your responses are energetic but professional, 
showing both technical depth and genuine passion for the work. You're passionate about physical pursuits, sports, and fitness - 
these activities fuel your discipline and problem-solving mindset.

RESPONSE GUIDELINES:
- Keep responses conversational, authentic, and concise (2-4 sentences typically unless more detail is requested)
- Use the strategic answers above as a framework but adapt them naturally to the specific question
- Show enthusiasm for AI and the 100x role while remaining professional
- Use concrete examples and metrics from your experience
- Connect personal projects to professional growth
- Let your personality shine through - you're not just a resume, you're someone who loves building things and pushing limits"""

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str

class TTSRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"status": "healthy", "message": "Interview Voice Bot API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        logger.info(f"Received chat request with {len(request.messages)} messages")
        
        # Convert messages to Groq format
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend([{"role": msg.role, "content": msg.content} for msg in request.messages])
        
        logger.info("Calling Groq API with streaming...")
        
        async def generate_stream():
            full_response = ""
            
            # Call Groq API with streaming
            stream = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.7,
                max_tokens=500,
                stream=True
            )
            
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    # Send each chunk as JSON
                    yield f"data: {content}\n\n"
            
            logger.info("Successfully streamed response from Groq")
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )
    
    except Exception as e:
        logger.error(f"Error in chat endpoint: {type(e).__name__}: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    try:
        logger.info(f"Received TTS request for text: {request.text[:50]}...")
        
        # Generate audio using Hume AI TTS
        # Create utterance with the text (no voice specified = dynamic voice generation)
        utterance = PostedUtterance(
            text=request.text
        )
        
        # Use non-streaming method to get complete audio at once (more reliable)
        # Try primary key first, fall back to backup if rate limited
        audio_data = None
        primary_failed = False
        
        try:
            audio_chunks = []
            for chunk in hume_client.tts.synthesize_file(
                utterances=[utterance],
            ):
                audio_chunks.append(chunk)
            
            audio_data = b"".join(audio_chunks)
            logger.info(f"Successfully generated audio with Hume AI (primary key): {len(audio_data)} bytes")
        except Exception as e:
            error_message = str(e).lower()
            # Check if it's a rate limit or quota error
            if any(keyword in error_message for keyword in ['rate', 'limit', 'quota', 'exceeded', '429', '403']):
                logger.warning(f"Primary Hume AI key limit reached: {e}")
                primary_failed = True
            else:
                logger.error(f"Error generating audio with primary key: {e}")
                import traceback
                logger.error(traceback.format_exc())
                raise HTTPException(status_code=500, detail=f"Error generating audio: {str(e)}")
        
        # Try backup key if primary failed due to rate limit
        if primary_failed and hume_client_backup:
            try:
                logger.info("Attempting to use backup Hume AI key...")
                audio_chunks = []
                for chunk in hume_client_backup.tts.synthesize_file(
                    utterances=[utterance],
                ):
                    audio_chunks.append(chunk)
                
                audio_data = b"".join(audio_chunks)
                logger.info(f"Successfully generated audio with Hume AI (backup key): {len(audio_data)} bytes")
            except Exception as e:
                logger.error(f"Error generating audio with backup key: {e}")
                import traceback
                logger.error(traceback.format_exc())
                raise HTTPException(status_code=500, detail=f"Both Hume AI keys failed. Error: {str(e)}")
        elif primary_failed and not hume_client_backup:
            raise HTTPException(
                status_code=503, 
                detail="Primary Hume AI key limit reached and no backup key configured. Please set HUME_API_KEY_BACKUP in environment."
            )
        
        # Check if audio data is empty
        if len(audio_data) == 0:
            logger.error("No audio data generated from Hume AI")
            raise HTTPException(status_code=500, detail="No audio data generated from TTS service")
        
        # Return audio as streaming response with proper headers for browser playback
        return StreamingResponse(
            io.BytesIO(audio_data),
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=speech.mp3",
                "Content-Length": str(len(audio_data)),
                "Accept-Ranges": "bytes",
                "Cache-Control": "no-cache"
            }
        )
    
    except Exception as e:
        logger.error(f"Error in TTS endpoint: {type(e).__name__}: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error processing TTS request: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

