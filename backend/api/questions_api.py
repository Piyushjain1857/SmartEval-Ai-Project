from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.schemas import QuestionCreate, QuestionUpdate, QuestionResponse
from repository.question_repository import question_repository
from utils.security_manager import security_manager

router = APIRouter(prefix="/question", tags=["question"])

@router.post("/", response_model=QuestionResponse)
def create_question(question: QuestionCreate):
    return question_repository.create_question(question.model_dump())

@router.get("/", response_model=List[QuestionResponse])
def get_all_questions():
    return question_repository.get_all_questions()

@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int):
    q = question_repository.get_question(question_id)
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    return q

@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(question_id: int, question: QuestionUpdate):
    q = question_repository.update_question(question_id, question.model_dump(exclude_unset=True))
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    return q

@router.delete("/{question_id}")
def delete_question(question_id: int):
    success = question_repository.delete_question(question_id)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"message": "Question deleted successfully"}
