from fastapi import Depends, HTTPException
from routers.auth import get_current_user


def require_admin(
    current_user=Depends(get_current_user)
):
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user


def require_researcher(
    current_user=Depends(get_current_user)
):
    if current_user.role not in ["Researcher", "Admin"]:
        raise HTTPException(
            status_code=403,
            detail="Researcher or Admin access required"
        )
    return current_user