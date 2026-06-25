import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";

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

const TeachersDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isViewMode = new URLSearchParams(location.search).get("mode") === "view";
    const [newTeacher, setNewTeacher] = useState({
        teacher_no: "",
        teacher_name: "",
        teacher_contact_no: "",
        teacher_email: "",
    });
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (id && id !== "new") {
                setEditingId(id);
                const res = await axios.get(`http://localhost:8000/teacher/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNewTeacher({
                    teacher_no: res.data.teacher_no || "",
                    teacher_name: res.data.teacher_name || "",
                    teacher_contact_no: res.data.teacher_contact_no || "",
                    teacher_email: res.data.teacher_email || "",
                });
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            if (editingId) {
                await axios.put(`http://localhost:8000/teacher/${editingId}`,
                    newTeacher, { headers: { Authorization: `Bearer ${token}` }, });
            } else {
                await axios.post("http://localhost:8000/teacher/", newTeacher, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            setEditingId(null);

            setNewTeacher({
                teacher_no: "",
                teacher_name: "",
                teacher_contact_no: "",
                teacher_email: "",
            });
            navigate('/teachers');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading && id && id !== "new") {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>

            <h2 style={styles.heading}>
                {isViewMode ? "👁️ View Teacher" : editingId ? "✏️ Edit Teacher" : "📚 Add Teacher"}
            </h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div>
                    <label>Teacher Number </label>
                    <input type="number" name="teacher_no" value={newTeacher.teacher_no} onChange={handleChange} required disabled={isViewMode} style={styles.input} />
                </div>
                <div>
                    <label>Teacher Name</label>
                    <input type="text" name="teacher_name" value={newTeacher.teacher_name} onChange={handleChange} required disabled={isViewMode} style={styles.input} />
                </div>
                <div>
                    <label>Contact No. </label>
                    <input type="number" name="teacher_contact_no" value={newTeacher.teacher_contact_no} onChange={handleChange} required disabled={isViewMode} style={styles.input} />
                </div>
                <div>
                    <label>Email </label>
                    <input type="email" name="teacher_email" value={newTeacher.teacher_email} onChange={handleChange} required disabled={isViewMode} style={styles.input} />
                </div>
                {!isViewMode && (
                    <button type="submit" style={styles.button}>{editingId ? "Update Teacher" : "Add Teacher"}</button>
                )}
                <button type="button" style={{ ...styles.button, background: "#6b7280" }} onClick={() => navigate('/teachers')}> Back to Teacher's Home Page </button>
            </form>

        </div>
    );
};

export default TeachersDetails;
