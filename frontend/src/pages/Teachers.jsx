import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    viewButton: {
        background: "#10b981",
        color: "#fff",
        border: "none",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        marginRight: "8px",
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
    headerContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    addButton: {
        background: "#3b82f6",
        color: "#fff",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

const Teachers = () => {
    const navigate = useNavigate();
    const [Teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/teacher/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTeachers(res.data);
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

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8000/teacher/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeleteId(null);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (id) => {
        navigate(`/teacher-bank-details/${id}`);
    };

    const handleView = (id) => {
        navigate(`/teacher-bank-details/${id}?mode=view`);
    };

    const handleAdd = () => {
        navigate(`/question-bank-details`);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={styles.container}>

            <div style={styles.headerContainer}>
                <h2 style={styles.heading}>📝 Teachers List</h2>
                <button type="button" style={styles.addButton} onClick={handleAdd}>+ Add Question</button>
            </div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Teacher No.</th>
                        <th style={styles.th}>Teacher Name</th>
                        <th style={styles.th}>Contact No.</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Teachers.map((t) => (
                        <tr key={t.id}>
                            <td style={styles.td}>{t.teacher_no}</td>
                            <td style={styles.td}>{t.teacher_name}</td>
                            <td style={styles.td}>{t.teacher_contact_no}</td>
                            <td style={styles.td}>{t.teacher_email}</td>
                            <td style={styles.td}>
                                <button type="button" style={styles.viewButton} onClick={() => handleView(t.id)}>view</button>
                                <button type="button" style={styles.editButton} onClick={() => handleEdit(t.id)}>Edit</button>
                                <button type="button" style={styles.deleteButton} onClick={() => setDeleteId(t.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {deleteId && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>🗑️ Delete teacher</h3>
                        <p>Are you sure you want to delete this teacher?</p>
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

export default Teachers;

