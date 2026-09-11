from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite database stored in the Docker persistent volume
DATABASE_URL = "sqlite:///./data/research_tracker.db"

# Create the database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# Base class for SQLAlchemy models
Base = declarative_base()

# Database session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# Dependency used by FastAPI routes
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()