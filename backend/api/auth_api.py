from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import UserCreate, UserLogin, Token
from repository.user_repository import user_repository
from utils.security_manager import security_manager

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
def signup(user: UserCreate):
    existing_user = user_repository.get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = security_manager.get_password_hash(user.password)
    user_id = user_repository.create_user(user.username, hashed_password)
    return {"id": user_id, "username": user.username, "role": "Farmer"}

@router.post("/login", response_model=Token)
def login(user: UserLogin):
    db_user = user_repository.get_user_by_username(user.username)
    if not db_user or not security_manager.verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not db_user.is_active:
        raise HTTPException(status_code=403, detail="User account is blocked/pending approval")

    access_token = security_manager.create_access_token(
        data={"sub": db_user.username, "role": db_user.role}
    )
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}

@router.post("/reset-password")
def reset_password(data: dict):
    if "username" not in data or "new_password" not in data:
        raise HTTPException(status_code=400, detail="Missing username or new_password")
    
    db_user = user_repository.get_user_by_username(data["username"])
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    hashed_password = security_manager.get_password_hash(data["new_password"])
    user_repository.update_password(db_user.id, hashed_password)
    return {"message": "Password updated successfully"}
