from fastapi import APIRouter, Depends, Query, HTTPException
from models.schemas import User, UserCreate
from repository.user_repository import user_repository
from repository.notification_repository import notification_repository
from utils.gemini_util import gemini_service
from utils.weather_util import weather_service
from utils.security_manager import security_manager
from typing import List, Optional

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/farmers", response_model=List[User])
async def list_farmers(
    full_name: Optional[str] = Query(None),
    mobile: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
):
    filters = {
        "full_name": full_name,
        "mobile": mobile,
        "email": email,
        "city": city,
        "state": state
    }
    return user_repository.search_farmers(filters)

@router.post("/farmers", response_model=User)
async def create_farmer(farmer_data: UserCreate):
    farmer_dict = farmer_data.dict()
    existing_user = user_repository.get_user_by_username(farmer_dict["username"])
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = security_manager.get_password_hash(farmer_dict["password"])
    user_id = user_repository.create_user(
        username=farmer_dict["username"],
        hashed_password=hashed_password,
        role="Farmer"
    )
    
    profile_data = {k: v for k, v in farmer_dict.items() if k not in ["username", "password"]}
    if profile_data:
        user_repository.update_profile(user_id, profile_data)
    
    return user_repository.get_user_by_id(user_id)

@router.get("/farmers/{farmer_id}", response_model=User)
async def get_farmer_details(farmer_id: int):
    user = user_repository.get_user_by_id(farmer_id)
    if not user:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return user

@router.put("/farmers/{farmer_id}", response_model=User)
async def update_farmer(farmer_id: int, farmer_data: dict):
    user = user_repository.update_profile(farmer_id, farmer_data)
    if not user:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return user

@router.delete("/farmers/{farmer_id}")
async def delete_farmer(farmer_id: int):
    success = user_repository.delete_user(farmer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return {"message": "Farmer inactivated successfully"}

@router.patch("/farmers/{farmer_id}/status")
async def toggle_farmer_status(farmer_id: int, is_active: bool):
    success = user_repository.update_user_status(farmer_id, is_active)
    if not success:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return {"message": f"Farmer {'activated' if is_active else 'blocked'} successfully"}

@router.post("/broadcast")
async def broadcast_alert(
    state: str = Query(...),
    city: str = Query(...),
    type: str = Query(...)
):
    print(f"[LOG] Starting broadcast alert: Type={type}, Location={city}, {state}")
    
    filters = {"state": state, "city": city}
    farmers = user_repository.search_farmers(filters)
    
    if not farmers:
        print(f"[LOG] No farmers found in {city}, trying state {state}")
        filters = {"state": state}
        farmers = user_repository.search_farmers(filters)
        
    if not farmers:
        print(f"[LOG] No farmers found in state {state}")
        raise HTTPException(status_code=404, detail="No farmers found in the specified location")

    print(f"[LOG] Found {len(farmers)} farmers for broadcast")

    weather_data = await weather_service.get_weather(city)
    print(f"[LOG] Weather context for {city}: {weather_data}")
    
    prompt = f"""
    You are an expert agricultural advisor. Generate a professional {type} alert message for farmers.
    Location: {city}, {state}
    Weather Context: {weather_data}
    Target Language: English

    CRITICAL REQUIREMENT: The entire content (Title and Message) MUST be written in English. 
    
    The alert should include:
    1. A catchy Title.
    2. A concise message about the {type} risks.
    3. 2-3 specific actionable advice for farmers.
    
    Return the result STRICTLY as a JSON object with these exact keys:
    {{
        "title": "Alert Title in English",
        "message": "Full alert message with advice in English"
    }}
    """
    
    print(f"[LOG] Sending prompt to Gemini...")
    try:
        response = await gemini_service.model.generate_content_async(prompt)
        text = response.text
        print(f"[LOG] Raw AI Response: {text}")

        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        
        import json
        alert_json = json.loads(text)
        print(f"[LOG] Parsed Alert: {alert_json}")
    except Exception as e:
        print(f"[LOG] ERROR in AI generation: {str(e)}")
        alert_json = {
            "title": f"Important {type} Alert for {city}",
            "message": f"Please be advised regarding potential {type.lower()} issues in your area. Contact local authorities for detailed guidance."
        }
        print(f"[LOG] Using fallback alert")

    created_count = 0
    for farmer in farmers:
        notification_data = {
            "farmer_id": farmer.id,
            "title": alert_json["title"],
            "message": alert_json["message"],
            "type": type,
            "state": state,
            "city": city,
            "is_read": False
        }
        notification_repository.create_notification(notification_data)
        created_count += 1
        
    print(f"[LOG] Successfully saved {created_count} notifications")
    return {"message": f"Successfully broadcasted {type} alert to {created_count} farmers", "content": alert_json}
