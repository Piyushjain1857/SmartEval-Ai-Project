from utils.db_manager import db_manager
from models.database import QuestionPaperDB


class QuestionPaperRepository:
    def create_QuestionPaper(self, QuestionPaper_data: dict):
        db = db_manager.get_db()
        try:
            new_QuestionPaper = QuestionPaperDB(**QuestionPaper_data)
            db.add(new_QuestionPaper)
            db.commit()
            db.refresh(new_QuestionPaper)
            return new_QuestionPaper
        finally:
            db.close()

    def get_QuestionPaper(self, QuestionPaper_id: int):
        db = db_manager.get_db()
        try:
            return db.query(QuestionPaperDB).filter(QuestionPaperDB.id == QuestionPaper_id).first()
        finally:
            db.close()

    def get_all_QuestionPaper(self):
        db = db_manager.get_db()
        try:
            return db.query(QuestionPaperDB).all()
        finally:
            db.close()

    def update_QuestionPaper(self, QuestionPaper_id: int, QuestionPaper_data: dict):
        db = db_manager.get_db()
        try:
            QuestionPaper = db.query(QuestionPaperDB).filter(QuestionPaperDB.id == QuestionPaper_id).first()
            if QuestionPaper:
                for key, value in QuestionPaper_data.items():
                    setattr(QuestionPaper, key, value)
                db.commit()
                db.refresh(QuestionPaper)
            return QuestionPaper
        finally:
            db.close()

    def delete_QuestionPaper(self, QuestionPaper_id: int):
        db = db_manager.get_db()
        try:
            QuestionPaper = db.query(QuestionPaperDB).filter(QuestionPaperDB.id == QuestionPaper_id).first()
            if QuestionPaper:
                db.delete(QuestionPaper)
                db.commit()
                return True
            return False
        finally:
            db.close()


question_paper_repository = QuestionPaperRepository()
