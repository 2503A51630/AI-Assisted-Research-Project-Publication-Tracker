import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext

from database import Base, engine, SessionLocal
import models

from models import User

from routers.project import router as project_router
from routers.publication import router as publication_router
from routers.user import router as user_router
from routers.auth import router as auth_router


# ======================================================
# LOAD ENVIRONMENT VARIABLES
# ======================================================

load_dotenv()


# ======================================================
# CREATE DATABASE TABLES
# ======================================================

Base.metadata.create_all(bind=engine)


# ======================================================
# PASSWORD HASHING
# ======================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# ======================================================
# CREATE INITIAL ADMIN
# ======================================================

def create_initial_admin():

    admin_username = os.getenv(
        "ADMIN_USERNAME"
    )

    admin_email = os.getenv(
        "ADMIN_EMAIL"
    )

    admin_password = os.getenv(
        "ADMIN_PASSWORD"
    )

    # If Admin settings are not configured,
    # do not create an Admin automatically.

    if not all([
        admin_username,
        admin_email,
        admin_password
    ]):

        print(
            "Initial Admin settings are not configured. "
            "Skipping Admin creation."
        )

        return

    db = SessionLocal()

    try:

        existing_admin = (
            db.query(User)
            .filter(
                User.username == admin_username
            )
            .first()
        )

        # Admin already exists.

        if existing_admin:

            print(
                f"Admin user '{admin_username}' "
                "already exists."
            )

            return

        # Hash the password before storing it.

        hashed_password = pwd_context.hash(
            admin_password
        )

        admin_user = User(
            username=admin_username,
            email=admin_email,
            hashed_password=hashed_password,
            role="Admin"
        )

        db.add(admin_user)

        db.commit()

        print(
            f"Initial Admin user "
            f"'{admin_username}' created successfully."
        )

    finally:

        db.close()


# Run initial Admin creation.

create_initial_admin()


# ======================================================
# FASTAPI APPLICATION
# ======================================================

app = FastAPI(
    title="AI-Assisted Research Project & Publication Tracker",
    description=(
        "Backend API for managing research "
        "projects and publications"
    ),
    version="1.0.0"
)


# ======================================================
# CORS CONFIGURATION
# ======================================================

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5174"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        # Local development
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:5174",
        "http://127.0.0.1:5174",

        # Render production frontend
        "https://ai-research-tracker-frontend.onrender.com",

        # Environment-variable frontend URL
        FRONTEND_URL,
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


# ======================================================
# API ROUTERS
# ======================================================

app.include_router(
    project_router
)

app.include_router(
    publication_router
)

app.include_router(
    user_router
)

app.include_router(
    auth_router
)


# ======================================================
# HOME ENDPOINT
# ======================================================

@app.get("/")
def home():

    return {
        "message": "AI Research Tracker is running!"
    }