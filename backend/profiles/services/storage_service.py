"""
Storage service for managing file uploads and downloads.
Supports both local storage and S3-compatible storage (MinIO, AWS S3).
"""
import os
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Tuple, Optional
from django.conf import settings
from django.urls import reverse
import logging

logger = logging.getLogger(__name__)


class StorageService:
    """Service for storing and retrieving files."""
    
    def __init__(self):
        self.backend = settings.STORAGE_BACKEND
        self.media_root = settings.MEDIA_ROOT
        
    def save_file(self, file_bytes: bytes, filename: str, subfolder: str = 'exports') -> Tuple[str, str]:
        """
        Save file to storage.
        Returns tuple of (file_path, download_url).
        """
        if self.backend == 's3':
            return self._save_to_s3(file_bytes, filename, subfolder)
        else:
            return self._save_to_local(file_bytes, filename, subfolder)
    
    def _save_to_local(self, file_bytes: bytes, filename: str, subfolder: str) -> Tuple[str, str]:
        """Save file to local media directory."""
        try:
            # Create directory structure
            target_dir = Path(self.media_root) / subfolder
            target_dir.mkdir(parents=True, exist_ok=True)
            
            # Save file
            file_path = target_dir / filename
            with open(file_path, 'wb') as f:
                f.write(file_bytes)
            
            # Generate download URL
            relative_path = f"{subfolder}/{filename}"
            download_url = f"{settings.MEDIA_URL}{relative_path}"
            
            # If running on localhost, prepend the full URL
            if not download_url.startswith('http'):
                base_url = settings.WEB_ORIGIN or 'http://localhost:8000'
                download_url = f"{base_url}{download_url}"
            
            logger.info(f"Saved file locally: {file_path}")
            return str(file_path), download_url
            
        except Exception as e:
            logger.error(f"Error saving file locally: {e}", exc_info=True)
            raise
    
    def _save_to_s3(self, file_bytes: bytes, filename: str, subfolder: str) -> Tuple[str, str]:
        """Save file to S3-compatible storage."""
        try:
            import boto3
            from botocore.client import Config
            from botocore.exceptions import ClientError
            
            # Configure S3 client
            s3_client = boto3.client(
                's3',
                endpoint_url=settings.STORAGE_ENDPOINT,
                aws_access_key_id=settings.STORAGE_ACCESS_KEY,
                aws_secret_access_key=settings.STORAGE_SECRET_KEY,
                config=Config(signature_version='s3v4'),
                region_name='us-east-1'  # Required for some S3-compatible services
            )
            
            bucket_name = settings.STORAGE_BUCKET
            object_key = f"{subfolder}/{filename}"
            
            # Upload file
            s3_client.put_object(
                Bucket=bucket_name,
                Key=object_key,
                Body=file_bytes,
                ContentType=self._get_content_type(filename)
            )
            
            # Generate presigned URL (1 hour expiry)
            download_url = s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': bucket_name,
                    'Key': object_key
                },
                ExpiresIn=3600  # 1 hour
            )
            
            logger.info(f"Saved file to S3: {object_key}")
            return object_key, download_url
            
        except ImportError:
            logger.error("boto3 is required for S3 storage. Install with: pip install boto3")
            raise
        except Exception as e:
            logger.error(f"Error saving file to S3: {e}", exc_info=True)
            raise
    
    def _get_content_type(self, filename: str) -> str:
        """Get content type based on file extension."""
        ext = Path(filename).suffix.lower()
        content_types = {
            '.pdf': 'application/pdf',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.doc': 'application/msword',
            '.json': 'application/json',
            '.txt': 'text/plain',
        }
        return content_types.get(ext, 'application/octet-stream')
    
    def delete_file(self, file_path: str) -> bool:
        """Delete file from storage."""
        if self.backend == 's3':
            return self._delete_from_s3(file_path)
        else:
            return self._delete_from_local(file_path)
    
    def _delete_from_local(self, file_path: str) -> bool:
        """Delete file from local storage."""
        try:
            path = Path(file_path)
            if path.exists():
                path.unlink()
                logger.info(f"Deleted local file: {file_path}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting local file: {e}", exc_info=True)
            return False
    
    def _delete_from_s3(self, object_key: str) -> bool:
        """Delete file from S3 storage."""
        try:
            import boto3
            from botocore.client import Config
            
            s3_client = boto3.client(
                's3',
                endpoint_url=settings.STORAGE_ENDPOINT,
                aws_access_key_id=settings.STORAGE_ACCESS_KEY,
                aws_secret_access_key=settings.STORAGE_SECRET_KEY,
                config=Config(signature_version='s3v4'),
                region_name='us-east-1'
            )
            
            s3_client.delete_object(
                Bucket=settings.STORAGE_BUCKET,
                Key=object_key
            )
            
            logger.info(f"Deleted S3 file: {object_key}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting S3 file: {e}", exc_info=True)
            return False
    
    def get_signed_url(self, file_path: str, expires_in: int = 3600) -> Optional[str]:
        """
        Get signed URL for file download.
        For local storage, returns direct URL.
        For S3, generates presigned URL.
        """
        if self.backend == 's3':
            try:
                import boto3
                from botocore.client import Config
                
                s3_client = boto3.client(
                    's3',
                    endpoint_url=settings.STORAGE_ENDPOINT,
                    aws_access_key_id=settings.STORAGE_ACCESS_KEY,
                    aws_secret_access_key=settings.STORAGE_SECRET_KEY,
                    config=Config(signature_version='s3v4'),
                    region_name='us-east-1'
                )
                
                url = s3_client.generate_presigned_url(
                    'get_object',
                    Params={
                        'Bucket': settings.STORAGE_BUCKET,
                        'Key': file_path
                    },
                    ExpiresIn=expires_in
                )
                
                return url
            except Exception as e:
                logger.error(f"Error generating signed URL: {e}", exc_info=True)
                return None
        else:
            # For local storage, return direct URL
            filename = Path(file_path).name
            relative_path = f"exports/{filename}"
            download_url = f"{settings.MEDIA_URL}{relative_path}"
            
            if not download_url.startswith('http'):
                base_url = settings.WEB_ORIGIN or 'http://localhost:8000'
                download_url = f"{base_url}{download_url}"
            
            return download_url
