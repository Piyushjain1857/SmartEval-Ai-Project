from fastapi import APIRouter, Depends, HTTPException
from models.schemas import User, LandCreate, Land, CropCreate, Crop, HistoryCreate, History
from repository.user_repository import user_repository
from repository.land_repository import land_repository
from repository.crop_repository import crop_repository
from repository.history_repository import history_repository
from repository.notification_repository import notification_repository
from utils.security_manager import security_manager
from typing import List

router = APIRouter(prefix="/farmer", tags=["Farmer"])

@router.get("/profile", response_model=User)
async def get_profile(current_user: dict = Depends(security_manager.get_current_user)):
    user = user_repository.get_user_by_username(current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/profile", response_model=User)
async def update_profile(profile_data: dict, current_user: dict = Depends(security_manager.get_current_user)):
    user = user_repository.get_user_by_username(current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_repository.update_profile(user.id, profile_data)

@router.post("/land", response_model=Land)
async def add_land(land_data: LandCreate, current_user: dict = Depends(security_manager.get_current_user)):
    user = user_repository.get_user_by_username(current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    land_dict = land_data.dict()
    land_dict['farmer_id'] = user.id
    return land_repository.create_land(land_dict)

@router.get("/land", response_model=List[Land])
async def get_lands(current_user: dict = Depends(security_manager.get_current_user)):
    user = user_repository.get_user_by_username(current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return land_repository.get_lands_by_farmer(user.id)

@router.post("/crops", response_model=Crop)
async def add_crop(crop_data: CropCreate, current_user: dict = Depends(security_manager.get_current_user)):
    user = user_repository.get_user_by_username(current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    crop_dict = crop_data.dict()
    crop_dict['farmer_id'] = user.id
    return crop_repository.create_crop(crop_dict)

@router.get("/crops", response_model=List[Crop])
async def get_crops(current_user: dict = Depends(security_manager.get_current_user)):
    user = user_repository.get_user_by_username(current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crop_repository.get_crops_by_farmer(user.id)

@router.post("/history", response_model=History)
async def add_history(history_data: HistoryCreate, current_user: dict = Depends(security_manager.get_current_user)):
    user = user_repository.get_user_by_username(current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    hist_dict = history_data.dict()
    hist_dict['farmer_id'] = user.id
    return history_repository.create_history(hist_dict)

@router.get("/history", response_model=List[History])
async def get_history(current_user: dict = Depends(security_manager.get_current_user)):
    user = user_repository.get_user_by_username(current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return history_repository.get_history_by_farmer(user.id)

@router.get("/notifications")
async def get_notifications(current_user: dict = Depends(security_manager.get_current_user)):
    user = user_repository.get_user_by_username(current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return notification_repository.get_notifications_for_user(user.id)

@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: int):
    return notification_repository.mark_as_read(notification_id)

@router.get("/dashboard-summary")
async def get_dashboard_summary(current_user: dict = Depends(security_manager.get_current_user)):
    user = user_repository.get_user_by_username(current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    lands = land_repository.get_lands_by_farmer(user.id)
    crops = crop_repository.get_crops_by_farmer(user.id)
    notifications = notification_repository.get_notifications_for_user(user.id)
    
    total_land_area = sum(float(l.area_size or 0) for l in lands)
    active_crops_count = len(crops)
    unread_notifications_count = len([n for n in notifications if not n.is_read])
    
    return {
        "farmer_name": user.full_name,
        "total_lands": len(lands),
        "total_area": round(total_land_area, 2),
        "active_crops": active_crops_count,
        "unread_notifications": unread_notifications_count,
        "recent_notifications": notifications[:3],
        "weather": {
            "temp": 28,
            "condition": "Sunny",
            "humidity": 45,
            "wind_speed": 12
        }
    }
