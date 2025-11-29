from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from .config import settings
from .controllers import create_auth_router, create_order_router


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
    
    
    return app

app = create_application()