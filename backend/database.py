import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from .env file
load_dotenv()

# Fetch database connection string from environment variables
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

print("Database URL :", SQLALCHEMY_DATABASE_URL)

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create Base class for ORM models
Base = declarative_base()

# Dependency to yield a database session per request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()