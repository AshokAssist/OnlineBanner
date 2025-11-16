from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile
from ..models.file import FileRecord
from ..repositories.base import BaseRepository
from .storage import storage_service
from ..utils.validators import validate_file_upload, validate_image_dimensions
import io

class FileService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.file_repo = BaseRepository(FileRecord, db)
        self.storage_service = storage_service
    
    async def upload_file(self, file: UploadFile) -> FileRecord:
        """Upload file and create record."""
        # Validate file
        validate_file_upload(file)
        
        # Read file content
        file_content = await file.read()
        
        # Validate image dimensions if it's an image
        if file.content_type.startswith('image/'):
            validate_image_dimensions(io.BytesIO(file_content))
        
        # Upload to storage
        file_key = await self.storage_service.upload_file(
            file_content=file_content,
            filename=file.filename,
            content_type=file.content_type
        )
        
        # Create file record
        file_record = FileRecord(
            filename=file_key.split('/')[-1] if '/' in file_key else file_key,
            original_filename=file.filename,
            content_type=file.content_type,
            file_size=len(file_content),
            s3_key=file_key,
            s3_bucket="local" if hasattr(self.storage_service, 'storage_path') else self.storage_service.bucket
        )
        
        return await self.file_repo.create(file_record)
    
    async def get_file_url(self, file_id: str) -> str:
        """Get presigned URL for file access."""
        file_record = await self.file_repo.get(file_id)
        if not file_record:
            raise ValueError("File not found")
        
        return await self.storage_service.get_file_url(file_record.s3_key)
    
    async def download_file(self, file_id: str) -> bytes:
        """Download file content."""
        file_record = await self.file_repo.get(file_id)
        if not file_record:
            raise ValueError("File not found")
        
        return await self.storage_service.download_file(file_record.s3_key)