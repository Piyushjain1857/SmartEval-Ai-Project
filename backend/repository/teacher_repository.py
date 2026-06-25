from utils.db_manager import db_manager
from models.database import TeachersDB


class TeacherRepository:
    def create_teacher(self, teacher_data: dict):
        db = db_manager.get_db()
        try:
            new_teacher = TeachersDB(**teacher_data)
            db.add(new_teacher)
            db.commit()
            db.refresh(new_teacher)
            return new_teacher
        finally:
            db.close()

    def get_teacher(self, teacher_id: int):
        db = db_manager.get_db()
        try:
            return db.query(TeachersDB).filter(TeachersDB.id == teacher_id).first()
        finally:
            db.close()

    def get_all_teacher(self):
        db = db_manager.get_db()
        try:
            return db.query(TeachersDB).all()
        finally:
            db.close()

    def update_teacher(self, teacher_id: int, teacher_data: dict):
        db = db_manager.get_db()
        try:
            teacher = db.query(TeachersDB).filter(TeachersDB.id == teacher_id).first()
            if teacher:
                for key, value in teacher_data.items():
                    setattr(teacher, key, value)
                db.commit()
                db.refresh(teacher)
            return teacher
        finally:
            db.close()

    def delete_teacher(self, teacher_id: int):
        db = db_manager.get_db()
        try:
            teacher = db.query(TeachersDB).filter(TeachersDB.id == teacher_id).first()
            if teacher:
                db.delete(teacher)
                db.commit()
                return True
            return False
        finally:
            db.close()

teacher_repository = TeacherRepository()
