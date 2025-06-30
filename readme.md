Deep Learning API Hub


## 🧠 Models & Services

### Text Summarization
- **Model**: [facebook/bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn)
- **Framework**: Transformers (Hugging Face)
- **Description**: Generates concise summaries from long text using BART (Bidirectional and Auto-Regressive Transformers)
- **API Port**: 8000

### Style Transfer
- **Model**: [Google Magenta Arbitrary Image Stylization](https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2)
- **Framework**: TensorFlow Hub
- **Description**: Applies artistic styles to content images using neural style transfer with configurable alpha blending
- **API Port**: 8001

### Text Completion
- **Model**: [bigscience/bloom-560m](https://huggingface.co/bigscience/bloom-560m)
- **Framework**: Transformers (Hugging Face)
- **Description**: Generates text continuations using BLOOM (BigScience Large Open-science Open-access Multilingual language model)
- **API Port**: 8002

## 🏗️ Architecture

The project uses a microservices architecture with Docker containers:

- **Frontend**: React + TypeScript with Bootstrap UI, served via Nginx
- **Backend Services**: 3 independent FastAPI services for each AI model
- **Networking**: All services communicate through a Docker bridge network
- **Reverse Proxy**: Nginx handles API routing and static file serving

## 🚀 How to Run

### Prerequisites
- Docker
- Docker Compose

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deep_learning
   ```

2. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost`
   - The web interface will be available with all three services

### Individual Service URLs

Once running, you can access individual APIs directly:

- **Text Summarization**: `http://localhost/api/summarize/`
- **Style Transfer**: `http://localhost/api/style/`
- **Text Completion**: `http://localhost/api/complete/`
- **API Documentation**: 
  - Summarization: `http://localhost/api/summarize/docs`
  - Style Transfer: `http://localhost/api/style/docs`
  - Text Completion: `http://localhost/api/complete/docs`

### Development Mode

To run services individually for development:

```bash
# Start only text summarization
docker-compose up text-summarize

# Start only style transfer
docker-compose up style-transfer

# Start only text completion
docker-compose up text-complete

# Start only frontend
docker-compose up frontend
```

## 📋 Service Details

### Text Summarizer
- **Input**: Text (any length)
- **Parameters**: min_length, max_length
- **Output**: Concise summary
- **Use Cases**: Article summarization, document processing

### Style Transfer
- **Input**: Content image + Style image
- **Parameters**: Alpha blending (0.1-1.0)
- **Output**: Stylized image (PNG format)
- **Supported Formats**: JPEG, PNG, GIF, BMP, WEBP
- **Use Cases**: Artistic image processing, creative content generation

### Text Completion
- **Input**: Text prompt
- **Parameters**: max_new_tokens, num_sequences (for multi-completion)
- **Output**: Text continuation(s)
- **Modes**: Single completion or multiple variations
- **Use Cases**: Creative writing, content generation, text assistance

## 🔧 Configuration

### Resource Requirements

The application will download AI models on first run:
- **BART model**: ~1.6GB
- **TensorFlow Hub model**: ~500MB
- **BLOOM model**: ~2GB

Ensure sufficient disk space and memory (recommended: 8GB+ RAM).

### Environment Variables

No additional environment configuration required for basic usage. All services use default ports and are configured through Docker Compose.

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Bootstrap 5, Vite
- **Backend**: FastAPI, Python 3.9
- **AI/ML**: Transformers, TensorFlow, TensorFlow Hub
- **Infrastructure**: Docker, Docker Compose, Nginx
- **Image Processing**: Pillow, NumPy