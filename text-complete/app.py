from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI(title="Text Completion API (French with Bloom)")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins since frontend is in same network
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Load the Bloom model
generator = pipeline(
    "text-generation",
    model="bigscience/bloom-560m",
    pad_token_id=3
)

class CompletionRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 50

class MultiCompletionRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 50
    num_sequences: int = 3

@app.post("/complete", summary="Generate a single text completion")
async def complete_text(req: CompletionRequest):
    """
    Generates a single continuation of the prompt using Bloom-560m.
    """
    outputs = generator(
        req.prompt,
        max_new_tokens=req.max_new_tokens,
        num_return_sequences=1,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        truncation=True
    )
    return {"completion": outputs[0]["generated_text"]}

@app.post("/multi-complete", summary="Generate multiple text completions")
async def multi_complete_text(req: MultiCompletionRequest):
    """
    Generates multiple continuations of the prompt using Bloom-560m.
    """
    outputs = generator(
        req.prompt,
        max_new_tokens=req.max_new_tokens,
        num_return_sequences=req.num_sequences,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        truncation=True
    )
    completions = [out["generated_text"] for out in outputs]
    return {"completions": completions}
