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
  editButton: {
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px",
  },
};

const QuestionBankDetails = () => {
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    answer: "",
    m_marks: 0,
    question_no: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/question/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.status)
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

      if (editingId) {
        await axios.put(`http://localhost:8000/question/${editingId}`,
          newQuestion, { headers: { Authorization: `Bearer ${token}` }, });
      } else {
        await axios.post("http://localhost:8000/question/", newQuestion, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setEditingId(null);

      setNewQuestion({
        question_text: "",
        answer: "",
        m_marks: 0,
        question_no: 0,
      });
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
          <textarea name="answer" value={newQuestion.answer} onChange={handleChange} required style={styles.input} />
        </div>
        <button type="submit" style={styles.button}>{editingId ? "Update Question" : "Add Question"}</button>
      </form>

    </div>
  );
};

export default QuestionBankDetails;
