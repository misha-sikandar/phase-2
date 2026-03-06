from sqlmodel import Field, SQLModel
from datetime import datetime
from typing import Optional
import uuid


class User(SQLModel, table=True):
    """
    User model for authentication and user management.
    Stored in NeonDB PostgreSQL database.
    """
    
    __tablename__ = "users"
    
    # Primary Key - UUID for security
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        index=True,
        nullable=False
    )
    
    # Email - Unique and indexed for fast lookups
    email: str = Field(unique=True, index=True, max_length=255, nullable=False)
    
    # Password Hash (never store plain passwords!)
    password_hash: str = Field(max_length=255, nullable=False)
    
    # Optional user information
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    
    # Account status
    is_active: bool = Field(default=True, nullable=False)
    is_verified: bool = Field(default=False, nullable=False)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
