from execution_engine import execute_workflow
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.exc import SQLAlchemyError
import jwt

import models
import schemas
import auth
from database import engine, get_db

import os
from dotenv import load_dotenv
load_dotenv()

TEST_DB_FAILURE = os.getenv("TEST_DB_FAILURE", "false").lower() == "true"


# ==========================================
# DATABASE TABLE CREATION
# Phase 3: Database Design
# ==========================================

models.Base.metadata.create_all(bind=engine)


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI()


# ==========================================
# CORS - FRONTEND CONNECTION
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# JWT AUTHENTICATION
# Phase 4: Authentication
# ==========================================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Validate JWT token and get the current user.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode JWT token
        payload = jwt.decode(
            token,
            auth.SECRET_KEY,
            algorithms=[auth.ALGORITHM]
        )

        # Email is stored inside JWT 'sub'
        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

    except jwt.PyJWTError:
        raise credentials_exception

    # Find user using email
    user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if user is None:
        raise credentials_exception

    return user


# ==========================================
# BASIC API ROUTES
# ==========================================

@app.get("/")
def read_root():
    return {
        "Backend": "Running Successfully"
    }


@app.get("/api/data")
def get_data():
    return {
        "status": "Connected",
        "message": "Hello from FastAPI Backend!"
    }


# ==========================================
# PHASE 4: AUTHENTICATION
# ==========================================


# ------------------------------------------
# REGISTER USER
# ------------------------------------------

@app.post(
    "/register",
    response_model=schemas.UserOut,
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user using:
    name + email + password
    """

    # Check whether email already exists
    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password before storing it
    hashed_password = auth.get_password_hash(
        user.password
    )

    # Store user
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ------------------------------------------
# LOGIN USER
# ------------------------------------------

@app.post(
    "/login",
    response_model=schemas.Token
)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login using:
    email + password

    OAuth2PasswordRequestForm uses the field name
    'username' internally, so here that value
    is treated as the user's email.
    """

    email = form_data.username

    # Find user by email
    user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    # Verify email and password
    if not user or not auth.verify_password(
        form_data.password,
        user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT token
    access_token = auth.create_access_token(
        data={
            "sub": user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ------------------------------------------
# PROTECTED PROFILE
# ------------------------------------------

@app.get(
    "/profile",
    response_model=schemas.UserOut
)
def get_profile(
    current_user: models.User = Depends(get_current_user)
):
    """
    Return currently authenticated user's profile.
    """

    return current_user


# ==========================================
# PHASE 5: WORKFLOW CRUD APIs
# ==========================================


# ------------------------------------------
# CREATE WORKFLOW
# ------------------------------------------

@app.post(
    "/workflows",
    response_model=schemas.WorkflowOut,
    status_code=status.HTTP_201_CREATED
)
def create_workflow(
    workflow: schemas.WorkflowCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Create a workflow and store its React Flow
    nodes and edges as JSON.
    """

    new_workflow = models.Workflow(
        name=workflow.name,
        description=workflow.description,
        workflow_json=workflow.workflow_json,
        user_id=current_user.id
    )

    db.add(new_workflow)
    db.commit()
    db.refresh(new_workflow)

    return new_workflow


# ------------------------------------------
# LIST WORKFLOWS
# ------------------------------------------

@app.get(
    "/workflows",
    response_model=list[schemas.WorkflowOut]
)
def list_workflows(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Return all workflows belonging to
    the currently logged-in user.
    """

    workflows = db.query(models.Workflow).filter(
        models.Workflow.user_id == current_user.id
    ).all()

    return workflows


# ------------------------------------------
# GET SINGLE WORKFLOW
# ------------------------------------------

@app.get(
    "/workflows/{workflow_id}",
    response_model=schemas.WorkflowOut
)
def get_workflow(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get one workflow belonging to
    the currently logged-in user.
    """

    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.user_id == current_user.id
    ).first()

    if workflow is None:
        raise HTTPException(
            status_code=404,
            detail="Workflow not found"
        )

    return workflow


# ------------------------------------------
# UPDATE WORKFLOW
# ------------------------------------------

@app.put(
    "/workflows/{workflow_id}",
    response_model=schemas.WorkflowOut
)
def update_workflow(
    workflow_id: int,
    workflow: schemas.WorkflowUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update a workflow belonging to
    the currently logged-in user.
    """

    db_workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.user_id == current_user.id
    ).first()

    if db_workflow is None:
        raise HTTPException(
            status_code=404,
            detail="Workflow not found"
        )

    db_workflow.name = workflow.name
    db_workflow.description = workflow.description
    db_workflow.workflow_json = workflow.workflow_json

    db.commit()
    db.refresh(db_workflow)

    return db_workflow


# ------------------------------------------
# DELETE WORKFLOW
# ------------------------------------------

@app.delete(
    "/workflows/{workflow_id}"
)
def delete_workflow(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Delete a workflow belonging to
    the currently logged-in user.
    """

    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.user_id == current_user.id
    ).first()

    if workflow is None:
        raise HTTPException(
            status_code=404,
            detail="Workflow not found"
        )

    db.query(models.Execution).filter(
        models.Execution.workflow_id == workflow_id
    ).delete(synchronize_session=False)

    db.delete(workflow)
    db.commit()

    return {
        "message": "Workflow deleted successfully"
    }
# ==========================================
# PHASE 10 + PHASE 12
# WORKFLOW EXECUTION ENGINE
# Database Failure Handling
# ==========================================

@app.post("/workflows/{workflow_id}/execute")
def execute_saved_workflow(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Execute a saved workflow belonging to
    the currently logged-in user.

    Phase 12:
    - Handle database failures
    - Handle workflow execution failures
    - Preserve execution history
    """

    # ------------------------------------------
    # Find workflow
    # ------------------------------------------

    try:

        workflow = db.query(models.Workflow).filter(
            models.Workflow.id == workflow_id,
            models.Workflow.user_id == current_user.id
        ).first()

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Database failure: {str(e)}"
        )

    if workflow is None:

        raise HTTPException(
            status_code=404,
            detail="Workflow not found"
        )

    # ------------------------------------------
    # Create execution history
    # ------------------------------------------

    execution = models.Execution(
        workflow_id=workflow.id,
        status="running"
    )

    try:

        db.add(execution)
        db.commit()
        db.refresh(execution)

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Database failure while creating execution: {str(e)}"
        )

    # ------------------------------------------
    # Execute workflow
    # ------------------------------------------



    try:

        print("===================================")
        print("EXECUTING WORKFLOW ID:", workflow.id)
        print("WORKFLOW JSON:", workflow.workflow_json)
        print("===================================")

        result = execute_workflow(
            workflow.workflow_json
        )


    except Exception as e:

        # --------------------------------------
        # Save failed execution
        # --------------------------------------

        execution.status = "failed"
        execution.error = str(e)
        execution.finished_at = func.now()

        try:

            db.commit()
            db.refresh(execution)

        except SQLAlchemyError as db_error:

            db.rollback()

            raise HTTPException(
                status_code=500,
                detail=(
                    "Database failure while saving "
                    f"execution error: {str(db_error)}"
                )
            )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    # ------------------------------------------
    # Save successful execution
    # ------------------------------------------

    execution.status = "completed"
    execution.logs = "\n".join(
        result.get("logs", [])
    )
    execution.output = result
    execution.finished_at = func.now()


    if TEST_DB_FAILURE:
        execution.status = "failed"
        execution.error = "TEST: Simulated database failure"

    
    try:
        
        db.commit()
        db.refresh(execution)
    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Database failure while saving execution: {str(e)}"
        )

    if TEST_DB_FAILURE:
        raise HTTPException(
            status_code=500,
            detail="Database failure while saving execution: TEST: Simulated database failure"
        )

    return result



    
# ==========================================
# PHASE 11: EXECUTION HISTORY
# ==========================================

@app.get("/workflows/{workflow_id}/executions")
def get_execution_history(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get previous executions of a workflow
    belonging to the currently logged-in user.
    """

    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.user_id == current_user.id
    ).first()

    if workflow is None:
        raise HTTPException(
            status_code=404,
            detail="Workflow not found"
        )

    executions = db.query(models.Execution).filter(
        models.Execution.workflow_id == workflow_id
    ).order_by(
        models.Execution.id.desc()
    ).all()

    return executions   

    