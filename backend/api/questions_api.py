from fastapi import APIRouter, Depends, HTTPException
from models.schemas import QuestionBase
from service.question_service import question_service
from utils.security_manager import security_manager
from sqlalchemy.orm import Session
from models.schemas import QuestionBase,QuestionResponse
from repository.question_repository import question_repository
from utils.security_manager import security_manager
from typing import List

router = APIRouter(prefix="/question", tags=["question"])



