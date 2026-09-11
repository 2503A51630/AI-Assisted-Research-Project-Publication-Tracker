from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models

from routers.project import router as project_router
from routers.publication import router as publication_router
from routers.user import router as user_router
from routers.auth import router as auth_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI-Assisted Research Project & Publication Tracker",
    description="Backend API for managing research projects and publications",
    version="1.0.0"
)


# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(project_router)
app.include_router(publication_router)
app.include_router(user_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "AI Research Tracker is running!"
    }