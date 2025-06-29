from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI(title="Summarization API with Transformers")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins since frontend is in same network
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Load summarization pipeline (bart-large-cnn pour général ou pegasus-xsum pour XSum dataset)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class SummaryRequest(BaseModel):
    text: str
    max_length: int = 60
    min_length: int = 15

@app.post("/summarize")
async def summarize(req: SummaryRequest):
    summary = summarizer(
        req.text,
        max_length=req.max_length,
        min_length=req.min_length,
        do_sample=False
    )[0]["summary_text"]
    return {"summary": summary}
