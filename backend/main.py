from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from youtube_extractor import get_transcript
from ai_generator import generate_thread, generate_linkedin_post
from fastapi.middleware.cors import CORSMiddleware
import time
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ FIX 1: Robust YouTube ID extraction
def extract_video_id(url):
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    if match:
        return match.group(1)
    raise ValueError("Invalid YouTube URL")

@app.post("/generate-content")
def generate(url: str, generate_thread_flag: bool = True, generate_linkedin_flag: bool = True):
    
    video_id = extract_video_id(url)
    transcript = get_transcript(video_id)

    if not transcript or len(transcript) < 100:
        return {"error": "Transcript not available"}

    transcript = transcript[:4000]

    response = {}

    # ✅ FIX 2: Safe execution for thread
    if generate_thread_flag:
        try:
            thread = generate_thread(transcript)
            response["thread"] = thread.replace("\\n", "\n")
        except Exception as e:
            print("Thread Error:", e)
            response["thread"] = "Error generating thread"

        # ✅ FIX 3: small delay (important for Ollama)
        time.sleep(1)

    # ✅ FIX 4: Safe execution for LinkedIn
    if generate_linkedin_flag:
        try:
            linkedin = generate_linkedin_post(transcript)
            response["linkedin"] = linkedin
        except Exception as e:
            print("LinkedIn Error:", e)
            response["linkedin"] = "Error generating LinkedIn post"

    return response