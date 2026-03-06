from sqlmodel import create_engine
from .settings import settings

# Global engine instance
engine = None


def get_engine():
    """
    Get or create the SQLModel engine.
    Uses singleton pattern to avoid creating multiple engines.
    """
    global engine
    
    if engine is None:
        # Import psycopg for connection args
        try:
            import psycopg
            connect_args = {"sslmode": "require"}
        except ImportError:
            connect_args = {}
        
        engine = create_engine(
            settings.DATABASE_URL,
            echo=settings.DEBUG,  # Show SQL queries in debug mode
            pool_pre_ping=True,   # Enable connection health checks
            pool_size=10,         # Connection pool size
            max_overflow=20,      # Max connections beyond pool_size
            connect_args=connect_args
        )
    
    return engine


def create_db_and_tables():
    """Create all database tables."""
    from sqlmodel import SQLModel
    from src.models.user import User  # Import all models
    from src.models.todo import Todo
    
    engine = get_engine()
    SQLModel.metadata.create_all(engine)
