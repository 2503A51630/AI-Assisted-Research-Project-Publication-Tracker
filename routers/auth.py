from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError

from database import SessionLocal
from models import User


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


SECRET_KEY = "my-secret-key"
ALGORITHM = "HS256"


security = HTTPBearer(
    scheme_name="Bearer"
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_user_by_username(
    username: str,
    db: Session
):
    return db.query(User).filter(
        User.username == username
    ).first()


def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


@router.post("/login")
def login(
    username: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = get_user_by_username(
        username,
        db
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = jwt.encode(
        {
            "sub": str(user.id),
            "username": user.username,
            "role": user.role
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }