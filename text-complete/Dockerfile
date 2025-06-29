FROM python:3.9-slim

WORKDIR /app

# Install system dependencies required for PyTorch and transformers
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the Bloom model to cache it in the Docker layer
RUN python -c "from transformers import pipeline; pipeline('text-generation', model='bigscience/bloom-560m', pad_token_id=3)"

COPY app.py .

EXPOSE 8002

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8002"]
