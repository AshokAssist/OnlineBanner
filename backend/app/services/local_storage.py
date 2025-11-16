import os
import uuid
import aiofiles
from pathlib import Path
from typing import Optional

class LocalStorageService:
    def __init__(self):
        self.storage_path = Path("uploads")
        self.storage_path.mkdir(exist_ok=True)
    
    async def upload_file(self, file_content: bytes, filename: str, content_type: str) -> str:
        """Save file locally and return the file path."""
        file_ext = os.path.splitext(filename)[1]
        file_key = f"{uuid.uuid4()}{file_ext}"
        file_path = self.storage_path / file_key
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
        
        return file_key
    
    async def get_file_url(self, file_key: str, expires_in: int = 3600) -> str:
        """Return local file URL."""
        return f"/api/files/{file_key}"
    
    async def download_file(self, file_key: str) -> bytes:
        """Read file content from local storage."""
        file_path = self.storage_path / file_key
        if not file_path.exists():
            raise Exception(f"File not found: {file_key}")
        
        async with aiofiles.open(file_path, 'rb') as f:
            return await f.read()
    
    async def delete_file(self, file_key: str) -> bool:
        """Delete file from local storage."""
        try:
            file_path = self.storage_path / file_key
            if file_path.exists():
                file_path.unlink()
            return True
        except Exception:
            return False
    
    def get_file_path(self, file_key: str) -> Path:
        """Get full file path for serving files."""
        return self.storage_path / file_key