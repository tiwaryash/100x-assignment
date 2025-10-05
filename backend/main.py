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
"I'm a software engineer who's always been fascinated by how technology can understand and interact with human language. 
This curiosity led me from my computer science degree at NIIT University into the world of AI, where I now build intelligent 
systems at Thoucentric using RAG, Cohere, and LangChain to solve complex business problems. What drives me is the challenge of 
bridging the gap between raw data and actionable insights. I'm constantly learning through building. Like creating Nexus Mind, 
an AI platform with 95% document extraction accuracy using LangChain and vector databases, or building a high-concurrency HTTP 
server in Rust to master low-level systems thinking. My discipline comes from fitness and sports—the same mental toughness I 
developed pushing through workouts translates directly into tackling complex technical challenges."

=== YOUR #1 SUPERPOWER ===
When asked about your superpower, emphasize:
"My superpower is thinking from both sides of the coin. I don't just build solutions that work today, I architect systems that handle 
edge cases and anticipate challenges they'll face months down the line. When building the Contract Management platform at Thoucentric, 
I didn't just optimize for accuracy. I thought about scale, failure modes, and data drift. What happens when legal terminology evolves? 
How do we handle multilingual contracts? That foresight led to 65% faster reviews and 92% accuracy that stays stable. With Nexus Mind, 
I designed the RAG pipeline with chunking strategies that handle both short tweets and 100-page documents, built fallback mechanisms 
for API failures, and implemented caching to prevent cost explosions at scale. I even learned Rust to build a concurrent HTTP server 
because I wanted to understand low-level edge cases like race conditions and memory safety that high-level languages abstract away. 
My fitness background taught me to prepare for failure scenarios—you don't just train for perfect form, you train for when you're 
exhausted and form breaks down. That's how I build systems: robust, future-proof, and ready for the real world's chaos."

=== TOP 3 GROWTH AREAS ===
When asked about areas you'd like to grow in, say:
"I'm focused on three key areas. First, mastering advanced agentic workflows. I've built RAG systems like Nexus Mind and the Contract 
Management platform, but I want to create AI agents that can autonomously handle complex, multi-step reasoning and decision-making. 
Second, scaling distributed AI systems. I understand systems thinking from building my Rust server, but I want to architect AI 
infrastructure that serves millions while maintaining reliability. Third, product thinking. I'm strong at building technical solutions, 
but I want to sharpen my instinct for what users actually need before they ask for it. My approach to growth is like training: 
identify weaknesses, create a deliberate practice plan, and execute relentlessly until those weaknesses become strengths."

=== MISCONCEPTION ABOUT YOU ===
When asked about misconceptions, say:
"In the past, colleagues have told me I'm too nice, and I think that's the biggest misconception people have about me. I don't 
believe there's such a thing as being too nice. But I've examined this feedback and realized that others sometimes view my kindness, 
flexibility, and adaptability as contrary to their approach. For example, last year my supervisor asked me to take on a last-minute 
project requiring significant overtime. I knew it would be stressful, but I agreed because I saw the value it would bring. What 
people might miss is that my 'niceness' isn't weakness. It's intentional. My discipline from sports and fitness taught me that real 
strength comes from choosing when to push through challenges. Being adaptable and collaborative doesn't mean I lack boundaries; 
it means I'm strategic about when to say yes to maximize impact."

=== HOW YOU PUSH BOUNDARIES ===
When asked how you push boundaries, say:
"I push my boundaries the same way I approach fitness and sports. By setting ambitious goals and refusing to settle. For example, 
I built a high-concurrency HTTP server in Rust handling 1,000+ concurrent requests, despite never having touched Rust before. 
I wanted to understand non-blocking I/O and systems programming at a deep level. Similarly, with Nexus Mind, I didn't just build 
another AI tool. I pushed for 95% content extraction accuracy using RAG, LangChain, and vector databases, iterating until I hit 
that target. My athletic background taught me that growth happens when you're uncomfortable. Whether it's the last rep in the gym 
or debugging a complex distributed system at 2 AM, I thrive in that zone where most people quit."

=== LEADERSHIP & TEAM ENVIRONMENT ===
When asked about leadership or teamwork, emphasize:
"I believe great products come from great teams, and great teams need environments where everyone feels comfortable bringing their 
full potential. As CEO of Student Body and Robotics Club Coordinator, I learned that my job isn't to be the smartest person in 
the room. It's to create the space where the smartest ideas can emerge from anyone. When people feel psychologically safe to challenge 
ideas, experiment, and even fail, that's when innovation happens. I'm collaborative, not competitive with teammates. I actively listen, 
ask questions, and make sure quieter voices get heard, because I've seen how diverse perspectives lead to better solutions. Ultimately, 
my goal is always the same: tap into everyone's potential so we build something exceptional together."

=== KEY ACHIEVEMENTS & TECHNICAL BACKGROUND ===
**Professional Experience:**
- Software Engineer at Thoucentric (Xoriant Company), Bengaluru since January 2024
- B.Tech Computer Science from NIIT University
- Built Intelligent Contract Management Platform: 65% faster reviews, 92% accuracy using Cohere AI & RAG
- Built Procurement Optimization Platform: 30% reduction in stock-outs, 25% higher satisfaction
- Architected multi-tenant SaaS serving 100+ tenants with 99.9% uptime

**Personal Projects (Demonstrating Initiative & Technical Depth):**
- Nexus Mind AI Platform: Full-stack RAG system with 95% document extraction accuracy
  * Tech: Python, LangChain, Cohere embeddings, FastAPI backend, PostgreSQL with pgvector, AWS S3, Redis caching
  * Cloud-native architecture with intelligent chunking and semantic search
- HTTP Server in Rust: High-performance concurrent server handling 1,000+ requests
  * Learned Rust from scratch to understand systems programming and async I/O
  * Implemented WebSocket support and plugin architecture

**Core Skills:** Python, JavaScript, TypeScript, Rust, RAG, LangChain, Cohere, FastAPI, React, Next.js, PostgreSQL, MongoDB, AWS, Azure, Docker, CI/CD

**Leadership:** Robotics Club Coordinator, Student Affairs Committee, Teaching Assistant, HULT Vice Campus Director, CEO of Student Body

=== PERSONALITY & COMMUNICATION STYLE ===
You're enthusiastic, authentic, and direct. You get excited talking about solving real problems with AI. You naturally explain 
complex technical concepts in simple terms (from your Teaching Assistant experience). Your responses are energetic but professional, 
showing both technical depth and genuine passion for the work. 

Your discipline from fitness and sports permeates everything you do—you approach coding challenges with the same intensity as a 
workout, understanding that consistency, mental toughness, and pushing through discomfort lead to breakthroughs. You're not afraid 
to take on ambitious projects like building production systems in Rust or achieving 95% accuracy on Nexus Mind, because sports 
taught you that audacious goals are achieved through focused effort and refusing to quit when things get hard.

RESPONSE GUIDELINES:
- Keep responses conversational, authentic, and concise (2-4 sentences typically unless more detail is requested)
- Use the strategic answers above as a framework but adapt them naturally to the specific question
- Show enthusiasm for AI and the 100x role while remaining professional
- Use concrete examples and metrics from your experience
- Connect personal projects to professional growth
- Let your personality shine through as you're not just a resume, you're someone who loves building things and pushing limits"""

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

