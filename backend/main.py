from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Interview Voice Bot API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# System prompt with personal information
SYSTEM_PROMPT = """You are a professional candidate being interviewed for an AI Agent Team position at 100x. 
Answer questions authentically and professionally based on the following profile:

Background: A passionate software engineer with 3+ years of experience in full-stack development and AI/ML integration. 
Strong foundation in computer science with expertise in building scalable applications.

Superpower: Rapid learning and adaptation - ability to quickly master new technologies and frameworks, 
then apply them to solve real-world problems effectively.

Growth Areas:
1. System design at scale - deepening knowledge of distributed systems and microservices architecture
2. Machine learning operations (MLOps) - improving deployment and monitoring of AI models in production
3. Technical leadership - developing skills to mentor teams and drive technical decisions

Misconception: Colleagues often think I'm purely technical and task-focused, but I deeply value collaboration 
and human connection. I believe the best solutions come from understanding people's needs, not just writing code.

Pushing Boundaries: I regularly participate in hackathons, contribute to open-source projects, and build 
side projects with emerging technologies. I also dedicate time to learning from failure - I maintain a 
'lessons learned' journal where I analyze what didn't work and why.

Keep responses conversational, authentic, and concise (2-4 sentences typically). Show enthusiasm for the role 
while remaining professional."""

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {"status": "healthy", "message": "Interview Voice Bot API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Convert messages to Groq format
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend([{"role": msg.role, "content": msg.content} for msg in request.messages])
        
        # Call Groq API
        completion = groq_client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=500,
        )
        
        response_text = completion.choices[0].message.content
        
        return ChatResponse(response=response_text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

