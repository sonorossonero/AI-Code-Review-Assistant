from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
from anthropic import Anthropic
import time
import logging
import secrets
import hashlib
from functools import lru_cache

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Get API key and credentials from environment variables
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY must be set in environment variables")

# Authentication credentials
AUTH_USERNAME = os.getenv("AUTH_USERNAME", "admin")
AUTH_PASSWORD = os.getenv("AUTH_PASSWORD", "password123")

# Initialize FastAPI app and security
app = FastAPI(title="Code Review API")
security = HTTPBasic()

# Initialize Anthropic client
anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    #     allow_origins=[
    #     "http://localhost:5173",  # Local development
    #     "https://your-frontend-domain.vercel.app",  # Production frontend URL
    # ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Rate limiting configuration
RATE_LIMIT_DURATION = timedelta(minutes=1)
RATE_LIMIT_REQUESTS = 10
rate_limit_store = {}

# Models
class CodeReviewRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=10000)
    language: str = Field(..., pattern="^(python|javascript)$")

class CodeReviewResponse(BaseModel):
    feedback: dict
    error: Optional[str] = None

# Authentication function
def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    is_username_correct = secrets.compare_digest(credentials.username, AUTH_USERNAME)
    is_password_correct = secrets.compare_digest(credentials.password, AUTH_PASSWORD)
    
    if not (is_username_correct and is_password_correct):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials

# Rate limiting middleware
async def check_rate_limit(request: Request):
    client_ip = request.client.host
    current_time = datetime.now()
    
    if client_ip in rate_limit_store:
        requests = rate_limit_store[client_ip]
        requests = [req_time for req_time in requests 
                   if current_time - req_time < RATE_LIMIT_DURATION]
        
        if len(requests) >= RATE_LIMIT_REQUESTS:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again later."
            )
        
        requests.append(current_time)
        rate_limit_store[client_ip] = requests
    else:
        rate_limit_store[client_ip] = [current_time]
    
    return True

# Cache function for code reviews
@lru_cache(maxsize=100)
def get_cached_review(code_hash: str, language: str) -> dict:
    """
    Cache wrapper for code reviews. Uses code hash as key to avoid storing large code strings.
    """
    logger.info(f"Cache miss for code review in {language}")
    return None

def generate_review_prompt(code: str, language: str) -> str:
    return f"""You are an expert code reviewer. Review the following {language} code and provide feedback.
Your response must be a valid JSON object with exactly this format:
{{
    "summary": "Brief overview of the code quality",
    "improvements": ["Specific improvement 1", "Specific improvement 2"],
    "best_practices": ["Best practice 1", "Best practice 2"]
}}

Code to review:
```{language}
{code}
```

Remember: Your entire response must be a valid JSON object that can be parsed by json.loads()."""

# Endpoints
@app.post("/api/review", 
         response_model=CodeReviewResponse, 
         dependencies=[Depends(check_rate_limit), Depends(verify_credentials)])
async def review_code(request: CodeReviewRequest):
    try:
        # Log request
        logger.info(f"Received code review request for language: {request.language}")
        start_time = time.time()

        # Generate hash for caching
        code_hash = hashlib.sha256(request.code.encode()).hexdigest()
        
        # Check cache
        cached_review = get_cached_review(code_hash, request.language)
        if cached_review:
            logger.info("Returning cached review")
            return CodeReviewResponse(feedback=cached_review)

        # Generate prompt and get review
        prompt = generate_review_prompt(request.code, request.language)
        response = anthropic_client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Parse response
        feedback = response.content[0].text
        import json
        feedback_dict = json.loads(feedback)
        
        # Update cache
        get_cached_review.cache_info()
        get_cached_review(code_hash, request.language)
        
        # Log completion
        duration = time.time() - start_time
        logger.info(f"Code review completed in {duration:.2f} seconds")
        
        return CodeReviewResponse(feedback=feedback_dict)
    
    except Exception as e:
        logger.error(f"Error processing code review: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}