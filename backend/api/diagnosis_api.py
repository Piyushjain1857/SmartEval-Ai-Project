from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])

class DailyAction(BaseModel):
    day: str
    title: str
    tasks: List[str]
    voice_note: Optional[str] = None
    reminder: Optional[str] = None

class ActionPlanResponse(BaseModel):
    disease_name: str
    crop: str
    location: str
    weather: str
    plan: List[DailyAction]
    recovery_percentage: Optional[int] = None
    voice_support_available: bool = True

@router.post("/analyze", response_model=ActionPlanResponse)
async def analyze_crop(file: UploadFile = File(...)):
    # In a real app, we would process the image here.
    # For now, we return the mock structure as requested in the prompt.
    
    # Simulate processing time
    # import time
    # time.sleep(1)

    mock_plan = [
        DailyAction(
            day="Day 1",
            title="Immediate Control",
            tasks=[
                "Remove visibly infected leaves",
                "Spray Fungicide X (2ml per liter of water)",
                "Spray during early morning",
                "Wear gloves and mask"
            ],
            voice_note="Spray completed?",
            reminder="Spray completed?"
        ),
        DailyAction(
            day="Day 2",
            title="Soil Monitoring",
            tasks=[
                "Avoid overwatering",
                "Check drainage condition",
                "Apply organic compost (light layer)"
            ]
        ),
        DailyAction(
            day="Day 3",
            title="Preventive Spray",
            tasks=[
                "Apply Neem-based biopesticide",
                "Maintain 12-hour gap from irrigation"
            ]
        ),
        DailyAction(
            day="Day 4",
            title="Field Observation",
            tasks=[
                "Capture new image for progress check",
                "AI compares before-after condition"
            ]
        ),
        DailyAction(
            day="Day 5",
            title="Nutrient Boost",
            tasks=[
                "Add potassium-rich fertilizer",
                "Avoid nitrogen-heavy fertilizers"
            ]
        ),
        DailyAction(
            day="Day 6",
            title="Secondary Inspection",
            tasks=[
                "Inspect lower leaves",
                "Remove newly affected areas"
            ]
        ),
        DailyAction(
            day="Day 7",
            title="Final Assessment",
            tasks=[
                "Upload updated image",
                "System evaluates recovery %",
                "Suggest continuation or stop plan"
            ]
        )
    ]

    return ActionPlanResponse(
        disease_name="Leaf Blight",
        crop="Tomato",
        location="Haryana",
        weather="Humid, 28°C",
        plan=mock_plan,
        recovery_percentage=85
    )
