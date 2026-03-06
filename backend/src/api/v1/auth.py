"""
Authentication API endpoints.
Handles user registration, login, and profile management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from datetime import timedelta

from ...config.database import get_engine
from ...models.user import User
from ...schemas.auth import (
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
    Token,
    LoginResponse,
    TokenData
)
from ...utils.security import hash_password, verify_password
from ...utils.jwt import create_access_token, decode_access_token
from ...config.settings import settings

router = APIRouter()
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """
    Dependency to get current authenticated user from JWT token.
    
    Args:
        credentials: HTTP Authorization header with Bearer token
        
    Returns:
        Current user from database
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode token
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Get user from database
    engine = get_engine()
    with Session(engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()
        
        if user is None:
            raise credentials_exception
        
        return user


@router.post("/signup", response_model=LoginResponse)
def signup(user_data: UserCreate):
    """
    Register a new user.
    
    Args:
        user_data: User registration data
        
    Returns:
        Access token and user information
        
    Raises:
        HTTPException: If email already registered
    """
    engine = get_engine()
    
    with Session(engine) as session:
        # Check if user already exists
        statement = select(User).where(User.email == user_data.email)
        existing_user = session.exec(statement).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        user = User(
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            first_name=user_data.first_name,
            last_name=user_data.last_name
        )
        
        session.add(user)
        session.commit()
        session.refresh(user)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user.id},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.from_orm(user)
        )


@router.post("/login", response_model=LoginResponse)
def login(login_data: UserLogin):
    """
    Authenticate user and return access token.
    
    Args:
        login_data: User login credentials
        
    Returns:
        Access token and user information
        
    Raises:
        HTTPException: If credentials are invalid
    """
    engine = get_engine()
    
    with Session(engine) as session:
        # Find user by email
        statement = select(User).where(User.email == login_data.email)
        user = session.exec(statement).first()
        
        # Verify credentials
        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user.id},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.from_orm(user)
        )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user's profile.
    
    Returns:
        Current user information
    """
    return UserResponse.from_orm(current_user)


@router.put("/me", response_model=UserResponse)
def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update current user's profile information.

    Args:
        user_update: User update data

    Returns:
        Updated user information
    """
    engine = get_engine()

    with Session(engine) as session:
        # Update fields using dict() for Pydantic v1 compatibility
        update_data = user_update.dict(exclude_unset=True)

        for field, value in update_data.items():
            if field == "email" and value != current_user.email:
                # Check if new email already exists
                statement = select(User).where(User.email == value)
                existing = session.exec(statement).first()
                if existing:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email already registered"
                    )
            setattr(current_user, field, value)

        session.add(current_user)
        session.commit()
        session.refresh(current_user)

        return UserResponse.from_orm(current_user)
