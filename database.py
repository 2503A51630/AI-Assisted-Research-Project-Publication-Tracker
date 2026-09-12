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
)


# ------------------------------------------
# PostgreSQL configuration
# ------------------------------------------

if DATABASE_TYPE.lower() == "postgresql":

    POSTGRES_USER = os.getenv(
        "POSTGRES_USER"
    )

    POSTGRES_PASSWORD = os.getenv(
        "POSTGRES_PASSWORD"
    )

    POSTGRES_DB = os.getenv(
        "POSTGRES_DB"
    )

    POSTGRES_HOST = os.getenv(
        "POSTGRES_HOST",
        "localhost"
    )

    POSTGRES_PORT = os.getenv(
        "POSTGRES_PORT",
        "5432"
    )

    if not all([
        POSTGRES_USER,
        POSTGRES_PASSWORD,
        POSTGRES_DB,
    ]):
        raise RuntimeError(
            "PostgreSQL environment variables "
            "are not configured."
        )

    DATABASE_URL = (
        f"postgresql+psycopg://"
        f"{POSTGRES_USER}:"
        f"{POSTGRES_PASSWORD}@"
        f"{POSTGRES_HOST}:"
        f"{POSTGRES_PORT}/"
        f"{POSTGRES_DB}"
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

if DATABASE_TYPE.lower() == "sqlite":
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