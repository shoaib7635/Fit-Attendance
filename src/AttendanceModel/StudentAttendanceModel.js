import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentAttendanceModal({ studentId, onClose }) {
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("January"); // default January

  // 12 months ka static array
  const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    axios.get(`http://localhost:4000/student-attendance/${studentId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [studentId]);

  if (!data) return <div className="p-6 text-center">Loading...</div>;

  // Filtered data sirf selected month ka
  const filteredDateWise = data.dateWise.filter(r => {
    const recordMonth = new Date(r.date).toLocaleString("en-US", { month: "long" });
    return recordMonth === selectedMonth;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Student Attendance</h2>
          <button onClick={onClose} className="text-red-500 font-bold">✕</button>
        </div>

        <h3 className="font-semibold text-lg mb-2">📅 Select Month</h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        >
          {allMonths.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <h3 className="font-semibold text-lg mt-6 mb-2">📋 Date Wise</h3>
        <ul className="space-y-2">
          {filteredDateWise.length > 0 ? (
            filteredDateWise.map((r) => (
              <li key={r.date} className="flex justify-between">
                <span>{r.date}</span>
                <span className={`font-bold ${r.status === "Present" ? "text-green-600" : "text-red-600"}`}>
                  {r.status}
                </span>
              </li>
            ))
          ) : (
            <p>No data available for {selectedMonth}.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
