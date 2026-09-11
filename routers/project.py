from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Project
from schemas import ProjectCreate, ProjectResponse
from routers.auth import get_current_user


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Admin can choose the owner.
    # Researcher automatically becomes the owner.
    if current_user.role == "Admin":
        owner_id = project.owner_id
    else:
        owner_id = current_user.id

    new_project = Project(
        title=project.title,
        description=project.description,
        status=project.status,
        owner_id=owner_id
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


@router.get("/", response_model=list[ProjectResponse])
def get_projects(
    page: int = 1,
    limit: int = 10,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page must be 1 or greater"
        )

    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100"
        )

    # Admin can see all projects.
    if current_user.role == "Admin":
        query = db.query(Project)
    else:
        # Researcher can see only their own projects.
        query = db.query(Project).filter(
            Project.owner_id == current_user.id
        )

    offset = (page - 1) * limit

    return query.offset(offset).limit(limit).all()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Admin can access any project.
    # Researcher can access only their own project.
    if (
        current_user.role != "Admin"
        and project.owner_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can access only your own projects"
        )

    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Only Admin or the project owner can update.
    if (
        current_user.role != "Admin"
        and project.owner_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can update only your own projects"
        )

    project.title = project_data.title
    project.description = project_data.description
    project.status = project_data.status

    # Admin can change the owner.
    if current_user.role == "Admin":
        project.owner_id = project_data.owner_id

    db.commit()
    db.refresh(project)

    return project


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Only Admin or the project owner can delete.
    if (
        current_user.role != "Admin"
        and project.owner_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can delete only your own projects"
        )

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully"
    }