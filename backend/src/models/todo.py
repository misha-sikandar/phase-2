from sqlmodel import Field, SQLModel
from datetime import datetime
from typing import Optional
from enum import Enum
import uuid


class TodoStatus(str, Enum):
    """Todo item status options."""
    pending = "pending"
    in_progress = "in-progress"
    completed = "completed"
    archived = "archived"


class TodoPriority(str, Enum):
    """Todo item priority levels."""
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class Todo(SQLModel, table=True):
    """
    Todo model for task management.
    Each todo belongs to a user.
    """

    __tablename__ = "todos"

    # Primary Key - UUID
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, index=True)

    # Task information
    title: str = Field(max_length=200, index=True)
    description: Optional[str] = Field(default=None, max_length=2000)

    # Status and priority
    status: TodoStatus = Field(default=TodoStatus.pending, index=True)
    priority: TodoPriority = Field(default=TodoPriority.medium, index=True)

    # Dates
    due_date: Optional[datetime] = Field(default=None)
    completed_at: Optional[datetime] = Field(default=None)

    # Foreign key to user
    user_id: str = Field(foreign_key="users.id", index=True)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
