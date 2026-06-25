from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.schemas import TeacherCreate, TeacherUpdate, TeacherResponse
from repository.teacher_repository import teacher_repository
from utils.security_manager import security_manager

router = APIRouter(prefix="/teacher", tags=["teacher"])

@router.post("/", response_model=TeacherResponse)
def create_teacher(teacher: TeacherCreate):
    return teacher_repository.create_teacher(teacher.model_dump())

@router.get("/")
def get_all_teachers():
    teachers = teacher_repository.get_all_teacher()
    if not teachers:
        return "No data exists"
    else:
        return teachers

@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(teacher_id: int):
    q = teacher_repository.get_teacher(teacher_id)
    if not q:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return q

@router.put("/{teacher_id}", response_model=TeacherResponse)
def update_teacher(teacher_id: int, teacher: TeacherUpdate):
    q = teacher_repository.update_teacher(teacher_id, teacher.model_dump(exclude_unset=True))
    if not q:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return q

@router.delete("/{teacher_id}")
def delete_teacher(teacher_id: int):
    success = teacher_repository.delete_teacher(teacher_id)
    if not success:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return {"message": "Teacher deleted successfully"}
