"""
Authentication schemas for request/response validation.
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# ============ Request Schemas ============

class UserCreate(BaseModel):
    """Schema for user registration."""
    
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login."""
    
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None


# ============ Response Schemas ============

class UserResponse(BaseModel):
    """Schema for user response data."""
    
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class Token(BaseModel):
    """Schema for JWT token response."""
    
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for decoded token data."""
    
    user_id: Optional[str] = None
    email: Optional[str] = None


# ============ Combined Response Schemas ============

class LoginResponse(BaseModel):
    """Schema for login response with user data."""
    
    access_token: str
    token_type: str
    user: UserResponse
    
    class Config:
        orm_mode = True
