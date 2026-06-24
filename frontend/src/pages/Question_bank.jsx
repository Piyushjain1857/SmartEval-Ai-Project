import React, { useState, useEffect } from "react";
import axios from "axios";

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "25px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#1f2937",
  },
  form: {
    display: "grid",
    gap: "15px",
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
  },
  button: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  deleteButton: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    width: "420px",
    maxWidth: "90%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "20px",
  },
  cancelButton: {
    background: "#6b7280",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  confirmButton: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },
  th: {
    background: "#2563eb",
    color: "#fff",
    padding: "12px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  },
};

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    answer: "",
    m_marks: 1,
    question_no: 1,
  });
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/question/", {
        headers: { Authorization: `Bearer ${token}` },
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
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/question/", newQuestion, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewQuestion({
        question_text: "",
        answer: "",
        m_marks: 1,
        question_no: 1,
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/question/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>

      <h2 style={styles.heading}>📚 Question Management</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label>Question Number *</label>
          <input type="number" name="question_no" value={newQuestion.question_no} onChange={handleChange} required style={styles.input} />
        </div>
        <div>
          <label>Marks *</label>
          <input type="number" name="m_marks" value={newQuestion.m_marks} onChange={handleChange} required style={styles.input} />
        </div>
        <div>
          <label>Question Text *</label>
          <textarea name="question_text" value={newQuestion.question_text} onChange={handleChange} required style={styles.input} />
        </div>
        <div>
          <label>Answer *</label>
          <input type="text" name="answer" value={newQuestion.answer} onChange={handleChange} required style={styles.input} />
        </div>
        <button type="submit" style={styles.button}>Add Question</button>
      </form>

      <h2 style={styles.heading}>📝 Questions List</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Q. No.</th>
            <th style={styles.th}>Question</th>
            <th style={styles.th}>Answer</th>
            <th style={styles.th}>Marks</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td style={styles.td}>{q.question_no}</td>
              <td style={styles.td}>{q.question_text}</td>
              <td style={styles.td}>{q.answer}</td>
              <td style={styles.td}>{q.m_marks}</td>
              <td style={styles.td}>
                <button style={styles.deleteButton} onClick={() => setDeleteId(q.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {deleteId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>🗑️ Delete Question</h3>
            <p>Are you sure you want to delete this question?</p>
            <div style={styles.modalButtons}>
              <button style={styles.cancelButton} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={styles.confirmButton} onClick={() => handleDelete(deleteId)}>Delete </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
