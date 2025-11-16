import os
from typing import List

class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./banner.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # Storage
    STORAGE_TYPE: str = os.getenv("STORAGE_TYPE", "local")  # "local" or "s3"
    LOCAL_STORAGE_PATH: str = os.getenv("LOCAL_STORAGE_PATH", "./uploads")
    
    # S3 Configuration (if using S3)
    S3_ENDPOINT: str = os.getenv("S3_ENDPOINT", "http://localhost:9000")
    S3_ACCESS_KEY: str = os.getenv("S3_ACCESS_KEY", "minioadmin")
    S3_SECRET_KEY: str = os.getenv("S3_SECRET_KEY", "minioadmin")
    S3_BUCKET: str = os.getenv("S3_BUCKET", "banner-files")
    
    # Email Configuration
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    BUSINESS_EMAIL: str = os.getenv("BUSINESS_EMAIL", "your-business@gmail.com")
    EMAIL_PASSWORD: str = os.getenv("EMAIL_PASSWORD", "your-app-password")
    
    # File Upload
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".ai", ".psd"]
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB

settings = Settings()