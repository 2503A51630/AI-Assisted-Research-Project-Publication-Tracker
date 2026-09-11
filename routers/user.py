from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import SessionLocal
from models import User
from schemas import UserCreate, UserResponse
from routers.roles import require_admin


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        (User.username == user.username) |
        (User.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists"
        )

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get("/", response_model=list[UserResponse])
def get_users(
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):
    return db.query(User).all()


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UserCreate,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.username = user_data.username
    user.email = user_data.email
    user.role = user_data.role

    if user_data.password:
        user.hashed_password = pwd_context.hash(
            user_data.password
        )

    db.commit()
    db.refresh(user)

    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }