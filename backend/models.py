from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

# ==========================================
# USERS TABLE
# Phase 3: Database Design
# Phase 4: Authentication
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    # One user can have many workflows
    workflows = relationship(
        "Workflow",
        back_populates="owner"
    )

# ==========================================
# WORKFLOWS TABLE
# Phase 3: Database Design
# Phase 5: Workflow CRUD APIs
# Phase 6: Visual Workflow Editor
# ==========================================

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # Stores React Flow nodes and edges as JSON
    workflow_json = Column(JSON, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Every workflow belongs to one user
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # Relationship with User
    owner = relationship(
        "User",
        back_populates="workflows"
    )

    # Relationship with Executions
    executions = relationship(
        "Execution",
        back_populates="workflow"
    )


# ==========================================
# EXECUTIONS TABLE
# Phase 3: Database Design
# ==========================================

class Execution(Base):
    __tablename__ = "executions"

    id = Column(Integer, primary_key=True, index=True)

    workflow_id = Column(
        Integer,
        ForeignKey("workflows.id"),
        nullable=False
    )

    status = Column(String, nullable=False)
    logs = Column(Text, nullable=True)
    output = Column(JSON, nullable=True)
    error = Column(Text, nullable=True)

    started_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    finished_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    # Relationship with Workflow
    workflow = relationship(
        "Workflow",
        back_populates="executions"
    )





