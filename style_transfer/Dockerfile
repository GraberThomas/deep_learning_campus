FROM python:3.9-slim

WORKDIR /app

# Install system dependencies required for TensorFlow and image processing
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the TensorFlow Hub model to cache it in the Docker layer
RUN python -c "import tensorflow_hub as hub; hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')"

COPY app.py .

# Copy the style and test image directories
COPY img_style/ ./img_style/
COPY img_test/ ./img_test/

# Expose port
EXPOSE 8001

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]
