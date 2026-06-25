from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.schemas import QuestionPaperCreate, QuestionPaperUpdate, QuestionPaperResponse
from repository.question_paper_repository import question_paper_repository
from utils.security_manager import security_manager

router = APIRouter(prefix="/question_paper", tags=["question_paper"])

@router.post("/", response_model=QuestionPaperResponse)
def create_QuestionPaper(QuestionPaper: QuestionPaperCreate):
    return question_paper_repository.create_QuestionPaper(QuestionPaper.model_dump())

@router.get("/")
def get_all_QuestionPapers():
    QuestionPapers = question_paper_repository.get_all_QuestionPaper()
    if not QuestionPapers:
        return []
    else:
        return QuestionPapers

@router.get("/{QuestionPaper_id}", response_model=QuestionPaperResponse)
def get_QuestionPaper(QuestionPaper_id: int):
    q = question_paper_repository.get_QuestionPaper(QuestionPaper_id)
    if not q:
        raise HTTPException(status_code=404, detail="QuestionPaper not found")
    return q

@router.put("/{QuestionPaper_id}", response_model=QuestionPaperResponse)
def update_QuestionPaper(QuestionPaper_id: int, QuestionPaper: QuestionPaperUpdate):
    q = question_paper_repository.update_QuestionPaper(QuestionPaper_id, QuestionPaper.model_dump(exclude_unset=True))
    if not q:
        raise HTTPException(status_code=404, detail="QuestionPaper not found")
    return q

@router.delete("/{QuestionPaper_id}")
def delete_QuestionPaper(QuestionPaper_id: int):
    success = question_paper_repository.delete_QuestionPaper(QuestionPaper_id)
    if not success:
        raise HTTPException(status_code=404, detail="QuestionPaper not found")
    return {"message": "QuestionPaper deleted successfully"}
