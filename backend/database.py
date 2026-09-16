from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# PostgreSQL Database URL

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:%40aN23JA10LI@host.docker.internal:5432/automation_db"

# Create PostgreSQL engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

print("Database URL :", SQLALCHEMY_DATABASE_URL)

# Create Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for SQLAlchemy models
Base = declarative_base()


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()