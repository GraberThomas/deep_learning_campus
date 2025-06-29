FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the BART model to cache it in the Docker layer
RUN python -c "from transformers import pipeline; pipeline('summarization', model='facebook/bart-large-cnn')"

COPY app.py .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]