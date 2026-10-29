
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


TicketStatus = Literal["open", "in_progress", "resolved", "closed"]
TicketPriority = Literal["low", "medium", "high", "urgent"]


class TicketCreate(BaseModel):
    subject: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=1, max_length=10000)
    customer_email: str = Field(min_length=3, max_length=255)
    priority: TicketPriority = "medium"
    category: str | None = Field(default=None, max_length=100)


class TicketUpdate(BaseModel):
    subject: str | None = Field(default=None, min_length=3, max_length=200)
    description: str | None = Field(default=None, min_length=1, max_length=10000)
    customer_email: str | None = Field(default=None, min_length=3, max_length=255)
    status: TicketStatus | None = None
    priority: TicketPriority | None = None
    category: str | None = Field(default=None, max_length=100)


class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    subject: str
    description: str
    customer_email: str
    status: str
    priority: str
    category: str | None
    created_at: datetime
    updated_at: datetime
