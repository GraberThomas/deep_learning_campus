from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from PIL import Image
import io

app = FastAPI(
    title="Universal Style Transfer API",
    description="Apply artistic style transfer to images using TensorFlow Hub. Supports JPEG, PNG, GIF, BMP, WEBP and more.",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins since frontend is in same network
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

hub_model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')

def load_image_pil(file_bytes, max_dim=512):
    """
    Loads any image format supported by PIL, converts to RGB, rescales
    to have longest side = max_dim while maintaining aspect ratio,
    and returns a TensorFlow tensor [1, H, W, 3] normalized [0,1].
    """
    img = Image.open(io.BytesIO(file_bytes)).convert('RGB')
    original_size = img.size
    scale = max_dim / max(original_size)
    new_size = (round(original_size[0]*scale), round(original_size[1]*scale))
    img = img.resize(new_size, Image.LANCZOS)

    img_array = np.array(img) / 255.0
    tensor = tf.convert_to_tensor(img_array, dtype=tf.float32)
    tensor = tensor[tf.newaxis, :]
    return tensor

def tensor_to_image_bytes(tensor):
    """
    Converts a TensorFlow tensor [1,H,W,3] or [H,W,3] to PNG bytes.
    """
    tensor = tensor * 255
    tensor = np.array(tensor, dtype=np.uint8)
    if tensor.ndim == 4:
        tensor = tensor[0]
    img = Image.fromarray(tensor)
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf.read()

def apply_style_transfer(content_tensor, style_tensor, alpha=None):
    """
    Runs the style transfer model. If alpha is set, blends result with content.
    Alpha: 0.0 = original content, 1.0 = full style transfer
    """
    stylized_tensor = hub_model(tf.constant(content_tensor), tf.constant(style_tensor))[0]
    stylized_tensor = tf.image.resize(stylized_tensor, tf.shape(content_tensor)[1:3])
    if alpha is not None:
        # Invert alpha so 1.0 = full style, 0.0 = original content
        return (1 - alpha) * content_tensor + alpha * stylized_tensor
    else:
        return stylized_tensor

@app.post("/style-transfer", summary="Stylize with alpha blending")
async def style_transfer(
    content_file: UploadFile = File(..., description="Content image (any format supported by Pillow)"),
    style_file: UploadFile = File(..., description="Style image (any format supported by Pillow)"),
    alpha: float = Query(1.0, ge=0.0, le=1.0, description="Style strength: 0=original content, 1=full style transfer")
):
    """
    Applies style transfer and blends with original content image by alpha.
    Alpha: 0.0 = original content, 1.0 = full style transfer
    """
    try:
        content_bytes = await content_file.read()
        style_bytes = await style_file.read()
        content_image = load_image_pil(content_bytes)
        style_image = load_image_pil(style_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error loading images: {str(e)}")

    blended_tensor = apply_style_transfer(content_image, style_image, alpha=alpha)
    img_bytes = tensor_to_image_bytes(blended_tensor)
    return StreamingResponse(io.BytesIO(img_bytes), media_type="image/png")

@app.post("/style-transfer-raw", summary="Stylize without blending")
async def style_transfer_raw(
    content_file: UploadFile = File(..., description="Content image (any format supported by Pillow)"),
    style_file: UploadFile = File(..., description="Style image (any format supported by Pillow)")
):
    """
    Applies style transfer only, returns the stylized image without blending.
    """
    try:
        content_bytes = await content_file.read()
        style_bytes = await style_file.read()
        content_image = load_image_pil(content_bytes)
        style_image = load_image_pil(style_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error loading images: {str(e)}")

    stylized_tensor = apply_style_transfer(content_image, style_image)
    img_bytes = tensor_to_image_bytes(stylized_tensor)
    return StreamingResponse(io.BytesIO(img_bytes), media_type="image/png")
