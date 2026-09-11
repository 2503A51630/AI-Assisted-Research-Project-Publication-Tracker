from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Publication
from schemas import PublicationCreate, PublicationResponse
from routers.roles import require_researcher


router = APIRouter(
    prefix="/publications",
    tags=["Publications"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=PublicationResponse)
def create_publication(
    publication: PublicationCreate,
    current_user=Depends(require_researcher),
    db: Session = Depends(get_db)
):
    new_publication = Publication(
        title=publication.title,
        authors=publication.authors,
        journal=publication.journal,
        publication_year=publication.publication_year,
        doi=publication.doi,
        project_id=publication.project_id
    )

    db.add(new_publication)
    db.commit()
    db.refresh(new_publication)

    return new_publication


@router.get("/", response_model=list[PublicationResponse])
def get_publications(
    project_id: int | None = None,
    search: str | None = None,
    page: int = 1,
    limit: int = 10,
    current_user=Depends(require_researcher),
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

    query = db.query(Publication)

    if project_id is not None:
        query = query.filter(
            Publication.project_id == project_id
        )

    if search is not None:
        query = query.filter(
            Publication.title.ilike(f"%{search}%")
        )

    offset = (page - 1) * limit

    return query.offset(offset).limit(limit).all()


@router.get("/{publication_id}", response_model=PublicationResponse)
def get_publication(
    publication_id: int,
    current_user=Depends(require_researcher),
    db: Session = Depends(get_db)
):
    publication = db.query(Publication).filter(
        Publication.id == publication_id
    ).first()

    if publication is None:
        raise HTTPException(
            status_code=404,
            detail="Publication not found"
        )

    return publication


@router.put("/{publication_id}", response_model=PublicationResponse)
def update_publication(
    publication_id: int,
    publication_data: PublicationCreate,
    current_user=Depends(require_researcher),
    db: Session = Depends(get_db)
):
    publication = db.query(Publication).filter(
        Publication.id == publication_id
    ).first()

    if publication is None:
        raise HTTPException(
            status_code=404,
            detail="Publication not found"
        )

    publication.title = publication_data.title
    publication.authors = publication_data.authors
    publication.journal = publication_data.journal
    publication.publication_year = publication_data.publication_year
    publication.doi = publication_data.doi
    publication.project_id = publication_data.project_id

    db.commit()
    db.refresh(publication)

    return publication


@router.delete("/{publication_id}")
def delete_publication(
    publication_id: int,
    current_user=Depends(require_researcher),
    db: Session = Depends(get_db)
):
    publication = db.query(Publication).filter(
        Publication.id == publication_id
    ).first()

    if publication is None:
        raise HTTPException(
            status_code=404,
            detail="Publication not found"
        )

    db.delete(publication)
    db.commit()

    return {
        "message": "Publication deleted successfully"
    }