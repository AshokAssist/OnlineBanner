from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
import uuid
from ..database import Base

class FileRecord(Base):
    __tablename__ = "file_records"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    s3_key = Column(String, nullable=False)
    s3_bucket = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())