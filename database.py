import os
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# Load .env file when running locally
load_dotenv()


# =========================================================
# Database configuration
# =========================================================

DATABASE_TYPE = os.getenv(
    "DATABASE_TYPE",
    "sqlite"
).lower()


# =========================================================
# PostgreSQL configuration
# =========================================================

if DATABASE_TYPE == "postgresql":

    # -----------------------------------------------------
    # Option 1:
    # Use DATABASE_URL directly when provided.
    # This is useful for Render.
    # -----------------------------------------------------

    DATABASE_URL = os.getenv("DATABASE_URL")

    # -----------------------------------------------------
    # Option 2:
    # Build the PostgreSQL URL from separate variables.
    # This is used by Docker Compose locally.
    # -----------------------------------------------------

    if not DATABASE_URL:

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
            "postgres"
        )

        POSTGRES_PORT = os.getenv(
            "POSTGRES_PORT",
            "5432"
        )

        # Make sure required values exist
        if not all([
            POSTGRES_USER,
            POSTGRES_PASSWORD,
            POSTGRES_DB
        ]):
            raise RuntimeError(
                "PostgreSQL configuration is incomplete. "
                "Check POSTGRES_USER, POSTGRES_PASSWORD "
                "and POSTGRES_DB."
            )

        # URL-encode username and password.
        # This prevents special characters in the password
        # from breaking the PostgreSQL connection URL.
        encoded_user = quote_plus(
            POSTGRES_USER
        )

        encoded_password = quote_plus(
            POSTGRES_PASSWORD
        )

        encoded_database = quote_plus(
            POSTGRES_DB
        )

        DATABASE_URL = (
            "postgresql+psycopg://"
            f"{encoded_user}:"
            f"{encoded_password}@"
            f"{POSTGRES_HOST}:"
            f"{POSTGRES_PORT}/"
            f"{encoded_database}"
        )

    # -----------------------------------------------------
    # Support Render-style PostgreSQL URLs
    # -----------------------------------------------------

    elif DATABASE_URL.startswith(
        "postgres://"
    ):

        DATABASE_URL = DATABASE_URL.replace(
            "postgres://",
            "postgresql+psycopg://",
            1
        )

    elif DATABASE_URL.startswith(
        "postgresql://"
    ):

        DATABASE_URL = DATABASE_URL.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1
        )


# =========================================================
# SQLite configuration
# =========================================================

else:

    DATABASE_URL = (
        "sqlite:///./data/"
        "research_tracker.db"
    )


# =========================================================
# SQLAlchemy engine
# =========================================================

connect_args = {}

if DATABASE_TYPE == "sqlite":

    connect_args = {
        "check_same_thread": False
    }


engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)


# =========================================================
# SQLAlchemy Base
# =========================================================

Base = declarative_base()


# =========================================================
# Database session
# =========================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# =========================================================
# FastAPI database dependency
# =========================================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()