from pydantic import BaseModel


class ProjectCreate(BaseModel):
    title: str
    description: str | None = None
    status: str = "Active"
    owner_id: int | None = None


class PublicationResponse(BaseModel):
    id: int
    title: str
    authors: str | None = None
    journal: str | None = None
    publication_year: int | None = None
    doi: str | None = None
    project_id: int | None = None
    model_config = {"from_attributes": True}


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    status: str
    owner_id: int | None = None
    publications: list[PublicationResponse] = []
    model_config = {"from_attributes": True}


class PublicationCreate(BaseModel):
    title: str
    authors: str | None = None
    journal: str | None = None
    publication_year: int | None = None
    doi: str | None = None
    project_id: int | None = None


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "Researcher"


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    model_config = {"from_attributes": True}