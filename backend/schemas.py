
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime


# ==========================================
# USER SCHEMAS
# Phase 4: Authentication
# ==========================================

# User Registration
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


# User Login
class UserLogin(BaseModel):
    name: str
    password: str


# User Response
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


# JWT Token Response
class Token(BaseModel):
    access_token: str
    token_type: str


# ==========================================
# WORKFLOW SCHEMAS
# Phase 5: Workflow CRUD APIs
# Phase 6: Visual Workflow Editor
# ==========================================

# Create Workflow
class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None
    workflow_json: Dict[str, Any]


# Update Workflow
class WorkflowUpdate(BaseModel):
    name: str
    description: Optional[str] = None
    workflow_json: Dict[str, Any]


# Workflow Response
class WorkflowOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    workflow_json: Dict[str, Any]
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True


# ==========================================
# EXECUTION SCHEMAS
# Phase 3: Database Design
# ==========================================

class ExecutionOut(BaseModel):
    id: int
    workflow_id: int
    status: str
    logs: Optional[str] = None
    output: Optional[Dict[str, Any]] = None
    started_at: datetime
    finished_at: Optional[datetime] = None

    class Config:
        from_attributes = True