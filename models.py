from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="Researcher")

    projects = relationship("Project", back_populates="owner")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(30), default="Active")
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="projects")
    publications = relationship("Publication", back_populates="project")


class Publication(Base):
    __tablename__ = "publications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    authors = Column(String(300))
    journal = Column(String(200))
    publication_year = Column(Integer)
    doi = Column(String(200))
    project_id = Column(Integer, ForeignKey("projects.id"))

    project = relationship("Project", back_populates="publications")