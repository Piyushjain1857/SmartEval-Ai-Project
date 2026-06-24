import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        question_text: '',
        answer: '',
        m_marks: 1,
        question_no: 1
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/question/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestions(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, []);

    const handleChange = (e) => {
        setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/question/', newQuestion, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewQuestion({ question_text: '', answer: '', m_marks: 1, question_no: 1 });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/question/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Question Management</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Question Number *</label>
                    <input type="number" name="question_no" value={newQuestion.question_no} onChange={handleChange} required />
                </div>
                <div>
                    <label>Marks *</label>
                    <input type="number" name="m_marks" value={newQuestion.m_marks} onChange={handleChange} required />
                </div>
                <div>
                    <label>Question Text *</label>
                    <textarea name="question_text" value={newQuestion.question_text} onChange={handleChange} required />
                </div>
                <div>
                    <label>Answer *</label>
                    <input type="text" name="answer" value={newQuestion.answer} onChange={handleChange} required />
                </div>
                <button type="submit">Add Question</button>
            </form>

            <h2>Questions List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Q. No.</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Marks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((q) => (
                        <tr key={q.id}>
                            <td>{q.question_no}</td>
                            <td>{q.question_text}</td>
                            <td>{q.answer}</td>
                            <td>{q.m_marks}</td>
                            <td>
                                <button onClick={() => handleDelete(q.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuestionBank;
