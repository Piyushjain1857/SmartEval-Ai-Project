from utils.db_manager import db_manager
from models.database import QuestionDB

class QuestionRepository:
    def create_question(self, question_data: dict):
        db = db_manager.get_db()
        try:
            new_question = QuestionDB(**question_data)
            db.add(new_question)
            db.commit()
            db.refresh(new_question)
            return new_question
        finally:
            db.close()

    def get_question(self, question_id: int):
        db = db_manager.get_db()
        try:
            return db.query(QuestionDB).filter(QuestionDB.id == question_id).first()
        finally:
            db.close()

    def get_all_questions(self):
        db = db_manager.get_db()
        try:
            return db.query(QuestionDB).all()
        finally:
            db.close()

    def update_question(self, question_id: int, question_data: dict):
        db = db_manager.get_db()
        try:
            question = db.query(QuestionDB).filter(QuestionDB.id == question_id).first()
            if question:
                for key, value in question_data.items():
                    setattr(question, key, value)
                db.commit()
                db.refresh(question)
            return question
        finally:
            db.close()

    def delete_question(self, question_id: int):
        db = db_manager.get_db()
        try:
            question = db.query(QuestionDB).filter(QuestionDB.id == question_id).first()
            if question:
                db.delete(question)
                db.commit()
                return True
            return False
        finally:
            db.close()

question_repository = QuestionRepository()
