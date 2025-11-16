from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import FileResponse
from .config import settings
from .controllers import create_auth_router, create_order_router
from .services.storage import storage_service
from .services.local_storage import LocalStorageService

def create_application() -> FastAPI:
    """Factory function to create FastAPI application."""
    app = FastAPI(
        title="Banner Printing Platform API",
        description="Production-ready API for online banner printing business",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Security middleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]  # Configure properly in production
    )
    
    # Register routers
    app.include_router(create_auth_router(), prefix="/api")
    app.include_router(create_order_router(), prefix="/api")
    
    @app.get("/")
    async def root():
        return {"message": "Banner Printing Platform API", "version": "1.0.0"}
    
    @app.get("/health")
    async def health_check():
        return {"status": "healthy"}
    
    @app.get("/api/files/{file_key}")
    async def serve_file(file_key: str):
        """Serve uploaded files for local storage."""
        if not isinstance(storage_service, LocalStorageService):
            raise HTTPException(status_code=404, detail="File serving not available")
        
        file_path = storage_service.get_file_path(file_key)
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        return FileResponse(file_path)
    
    return app

app = create_application()