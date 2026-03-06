"""
Todo Evolution API - FastAPI Backend
Main application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from .config.settings import settings
from .config.database import get_engine, create_db_and_tables
from .api.v1 import auth, todos


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        Configured FastAPI application instance
    """
    
    # Create FastAPI app
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="Todo Evolution API with authentication and task management",
        version="1.0.0",
        debug=settings.DEBUG
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://localhost:3001",
            "https://your-frontend-domain.com"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Startup event
    @app.on_event("startup")
    def on_startup():
        """Create database tables on startup."""
        create_db_and_tables()
    
    # Health check endpoint
    @app.get("/health", tags=["Health"])
    def health_check():
        """Check if the API is healthy."""
        return {
            "status": "healthy",
            "service": settings.PROJECT_NAME,
            "version": "1.0.0"
        }
    
    # Include routers
    app.include_router(auth.router, prefix="/v1/auth", tags=["Authentication"])
    app.include_router(todos.router, prefix="/v1/todos", tags=["Todos"])
    
    return app


# Create app instance
app = create_app()


# Root endpoint
@app.get("/")
def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to Todo Evolution API",
        "docs": "/docs",
        "health": "/health"
    }
