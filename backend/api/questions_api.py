from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.schemas import QuestionCreate, QuestionUpdate, QuestionResponse
from service.question_service import question_service
from utils.security_manager import security_manager

router = APIRouter(prefix="/question", tags=["question"])

@router.post("/", response_model=QuestionResponse)
def create_question(question: QuestionCreate):
    return question_service.create_question(question.model_dump())

@router.get("/", response_model=List[QuestionResponse])
def get_all_questions():
    return question_service.get_all_questions()

@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int):
    return question_service.get_question(question_id)

@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(question_id: int, question: QuestionUpdate):
    return question_service.update_question(question_id, question.model_dump(exclude_unset=True))

@router.delete("/{question_id}")
def delete_question(question_id: int):
    return question_service.delete_question(question_id)
