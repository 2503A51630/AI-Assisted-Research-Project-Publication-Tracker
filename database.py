import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# Load .env when running locally
load_dotenv()


# ------------------------------------------
# Database configuration
# ------------------------------------------

DATABASE_TYPE = os.getenv(
    "DATABASE_TYPE",
    "sqlite"
).lower()


# ------------------------------------------
# PostgreSQL configuration
# ------------------------------------------

if DATABASE_TYPE == "postgresql":

    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise RuntimeError(
            "DATABASE_URL is not configured for PostgreSQL."
        )

    # Convert Render-style URLs to SQLAlchemy psycopg URL
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace(
            "postgres://",
            "postgresql+psycopg://",
            1
        )

    elif DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1
        )


# ------------------------------------------
# SQLite configuration
# ------------------------------------------

else:

    DATABASE_URL = (
        "sqlite:///./data/"
        "research_tracker.db"
    )


# ------------------------------------------
# SQLAlchemy engine
# ------------------------------------------

connect_args = {}

if DATABASE_TYPE == "sqlite":
    connect_args = {
        "check_same_thread": False
    }


engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)


# ------------------------------------------
# SQLAlchemy Base
# ------------------------------------------

Base = declarative_base()


# ------------------------------------------
# Database session
# ------------------------------------------

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ------------------------------------------
# FastAPI database dependency
# ------------------------------------------

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()