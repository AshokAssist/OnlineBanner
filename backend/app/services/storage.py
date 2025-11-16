from .local_storage import LocalStorageService
from .s3 import S3Service
from ..config import settings

def get_storage_service():
    """Get storage service based on configuration."""
    if settings.STORAGE_TYPE == "local":
        return LocalStorageService()
    else:
        return S3Service()

# Create singleton instance
storage_service = get_storage_service()