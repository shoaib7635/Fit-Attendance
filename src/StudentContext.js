import { useState, createContext, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://attendance-backend-1-z8h9.onrender.com/students");
    
      // Get today's attendance data
      const attendanceRes = await axios.get(`https://attendance-backend-1-z8h9.onrender.com/attendance-report?date=${new Date().toISOString().split("T")[0]}`);

      // Extract present and absent IDs from students that still exist
      const presentIds = attendanceRes.data.present
        .filter(p => p.student && p.student._id) // Only existing students
        .map(p => p.student._id);
      
      const absentIds = attendanceRes.data.absent
        .filter(a => a.student && a.student._id) // Only existing students
        .map(a => a.student._id);

      // Map current students with their attendance status
      const updated = res.data.students.map(s => ({
        ...s,
        CNIC: s.CNIC,
        history: [
          {
            date: new Date().toISOString().split("T")[0],
            status: presentIds.includes(s._id) ? "Present" : 
                   absentIds.includes(s._id) ? "Absent" : "Absent"
          }
        ]
      }));

      setStudents(updated);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = (student) => {
    setStudents(prev => [...prev, { ...student, history: [] }]);
  };

  const markPresent = async (userId) => {
    const date = new Date().toISOString().split("T")[0];
    try {
      await axios.post("https://attendance-backend-1-z8h9.onrender.com/mark-attendance", {
        userId,
        status: "Present",
        date,
      });
      fetchStudents(); // Refresh
    } catch (err) {
      console.error("Mark Present Error:", err);
    }
  };

  const markAbsentForToday = async () => {
    const date = new Date().toISOString().split("T")[0];
    try {
      await axios.post("https://attendance-backend-1-z8h9.onrender.com/mark-all-absent", { date });
      fetchStudents();
    } catch (err) {
      console.error("Mark Absent Error:", err);
    }
  };

  // Fixed Delete Student function
  const deleteStudent = async (studentId) => {
    if (!toast.success("Are you sure you want to delete this student?")) return;
    
    try {
      await axios.delete(`https://attendance-backend-1-z8h9.onrender.com/delete-student/${studentId}`);
      
      // Remove student from local state immediately for UI update
      setStudents(prev => prev.filter(student => student._id !== studentId));
      
      // Also refresh the list to ensure consistency
      setTimeout(() => {
        fetchStudents();
      }, 500);
      
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting student. Please try again.");
    }
  };

  return (
    <StudentContext.Provider
      value={{ students, addStudent, markPresent, markAbsentForToday, deleteStudent }}
    >
      {children}
    </StudentContext.Provider>
  );
};