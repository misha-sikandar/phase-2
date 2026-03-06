"""
Todo schemas for request/response validation.
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.todo import TodoStatus, TodoPriority


# ============ Request Schemas ============

class TodoCreate(BaseModel):
    """Schema for creating a todo."""
    
    title: str
    description: Optional[str] = None
    status: TodoStatus = TodoStatus.pending
    priority: TodoPriority = TodoPriority.medium
    due_date: Optional[datetime] = None


class TodoUpdate(BaseModel):
    """Schema for updating a todo."""
    
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TodoStatus] = None
    priority: Optional[TodoPriority] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None


# ============ Response Schemas ============

class TodoResponse(BaseModel):
    """Schema for todo response data."""
    
    id: str
    title: str
    description: Optional[str] = None
    status: TodoStatus
    priority: TodoPriority
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class TodoListResponse(BaseModel):
    """Schema for list of todos with pagination."""
    
    items: list[TodoResponse]
    total: int
    limit: int
    offset: int
