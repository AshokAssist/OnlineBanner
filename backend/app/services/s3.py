import boto3
from botocore.exceptions import ClientError
from typing import Optional
import uuid
import os
from ..config import settings

class S3Service:
    def __init__(self):
        self.client = boto3.client(
            's3',
            endpoint_url=settings.S3_ENDPOINT,
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
            region_name=settings.S3_REGION
        )
        self.bucket = settings.S3_BUCKET
        self._ensure_bucket_exists()
    
    def _ensure_bucket_exists(self):
        """Create bucket if it doesn't exist."""
        try:
            self.client.head_bucket(Bucket=self.bucket)
        except ClientError:
            try:
                self.client.create_bucket(Bucket=self.bucket)
            except ClientError as e:
                print(f"Error creating bucket: {e}")
    
    async def upload_file(self, file_content: bytes, filename: str, content_type: str) -> str:
        """Upload file to S3 and return the key."""
        file_ext = os.path.splitext(filename)[1]
        s3_key = f"uploads/{uuid.uuid4()}{file_ext}"
        
        try:
            self.client.put_object(
                Bucket=self.bucket,
                Key=s3_key,
                Body=file_content,
                ContentType=content_type
            )
            return s3_key
        except ClientError as e:
            raise Exception(f"Failed to upload file: {e}")
    
    async def get_file_url(self, s3_key: str, expires_in: int = 3600) -> str:
        """Generate presigned URL for file access."""
        try:
            url = self.client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket, 'Key': s3_key},
                ExpiresIn=expires_in
            )
            return url
        except ClientError as e:
            raise Exception(f"Failed to generate URL: {e}")
    
    async def download_file(self, s3_key: str) -> bytes:
        """Download file content from S3."""
        try:
            response = self.client.get_object(Bucket=self.bucket, Key=s3_key)
            return response['Body'].read()
        except ClientError as e:
            raise Exception(f"Failed to download file: {e}")
    
    async def delete_file(self, s3_key: str) -> bool:
        """Delete file from S3."""
        try:
            self.client.delete_object(Bucket=self.bucket, Key=s3_key)
            return True
        except ClientError:
            return False