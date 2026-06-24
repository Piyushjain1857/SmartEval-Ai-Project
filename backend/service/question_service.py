from repository.question_repository import question_repository
from fastapi import HTTPException

class QuestionService:
    def create_question(self, question_data: dict, current_user: dict = None):
        if current_user:
            created_by = current_user.get("sub") or current_user.get("username")
            if created_by:
                question_data['created_by'] = created_by
        return question_repository.create_question(question_data)

    def get_question(self, question_id: int):
        question = question_repository.get_question(question_id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        return question

    def get_all_questions(self):
        return question_repository.get_all_questions()

    def update_question(self, question_id: int, question_data: dict):
        question = question_repository.update_question(question_id, question_data)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        return question

    def delete_question(self, question_id: int):
        success = question_repository.delete_question(question_id)
        if not success:
            raise HTTPException(status_code=404, detail="Question not found")
        return {"message": "Question deleted successfully"}

question_service = QuestionService()
