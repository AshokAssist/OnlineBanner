import os
from typing import Optional
from PIL import Image
from fastapi import UploadFile, HTTPException
from ..config import settings

def validate_file_upload(file) -> None:
    """Validate uploaded file for security and constraints."""
    
    # Handle case where file is not an UploadFile object
    if not hasattr(file, 'filename'):
        print(f"DEBUG: Invalid file object type: {type(file)}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file object type: {type(file)}"
        )
    
    # Check file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    if hasattr(file, 'size') and file.size and file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
        )
    
    # Validate MIME type
    allowed_mime_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg", 
        ".png": "image/png",
        ".pdf": "application/pdf"
    }
    
    expected_mime = allowed_mime_types.get(file_ext)
    if expected_mime and hasattr(file, 'content_type') and file.content_type != expected_mime:
        raise HTTPException(
            status_code=400,
            detail="File content type does not match extension"
        )

def validate_image_dimensions(file_content: bytes, max_width: int = 5000, max_height: int = 5000) -> Optional[tuple]:
    """Validate image dimensions for security."""
    try:
        with Image.open(file_content) as img:
            width, height = img.size
            if width > max_width or height > max_height:
                raise HTTPException(
                    status_code=400,
                    detail=f"Image dimensions too large. Maximum: {max_width}x{max_height}"
                )
            return width, height
    except Exception:
        # Not an image or corrupted
        return None