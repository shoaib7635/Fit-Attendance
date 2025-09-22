import { useContext, useEffect, useState } from "react";
import { StudentContext } from "../StudentContext";
import StudentAttendanceModal from "./StudentAttendanceModel";
import { ToastContainer } from "react-toastify";


function Attendance() {
  const { students, markPresent, markAbsentForToday, deleteStudent } = useContext(StudentContext);

  const [selectedStudentId, setSelectedStudentId] = useState(null);

const openStudentModal = (id) => setSelectedStudentId(id);
const closeStudentModal = () => setSelectedStudentId(null);

  // Search feature ke states
    const [searchName, setSearchName] = useState("");
    const [searchRecords, setSearchRecords] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);

    // Student name se search karne ka function
   const handleSearch = () => {
    if (!searchName.trim()) return;
    setLoadingSearch(true);

    // Filter only students who are in attendance (students array)
    const filtered = students.filter((stu) =>
      stu.name.toLowerCase().includes(searchName.toLowerCase()) ||
    (stu.CNIC && stu.CNIC.includes(searchName))
    );

    setTimeout(() => {
      setSearchRecords(filtered);
      setLoadingSearch(false);
    }, 300); // simulate loading
  };


  // Mark Absent for today on load if not already marked
  useEffect(() => {
    markAbsentForToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = new Date().toISOString().substr(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false}/>
      <div className="max-w-6xl mx-auto">

        {/* Search Bar Section */}
<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 flex flex-col gap-3">
  <div className="flex gap-3">
    <input
      type="text"
      placeholder="Search student by name or CNIC"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      className="border p-3 flex-1 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
    <button
      onClick={handleSearch}
      disabled={loadingSearch || !searchName.trim()}
      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition-colors duration-200 font-medium"
    >
      {loadingSearch ? 'Searching...' : 'Search'}
    </button>
    {searchRecords.length > 0 && (
      <button
        onClick={() => { setSearchRecords([]); setSearchName(""); }}
        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors duration-200 font-medium"
      >
        Clear
      </button>
    )}
  </div>

  {/* Suggestions */}
  {searchName.trim() && (
    <div className="bg-white border border-gray-300 rounded-xl mt-2 max-h-40 overflow-y-auto shadow-lg">
      {students
        .filter(
          (stu) =>
            stu.name.toLowerCase().includes(searchName.toLowerCase()) ||
            (stu.CNIC && stu.CNIC.includes(searchName))
        )
        .slice(0, 7) // max 5 suggestions
        .map((s) => (
          <div
            key={s._id}
            className="p-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setSearchName(s.name); // fill input on click
              setSearchRecords([s]); // show this student
            }}
          >
            {s.name} {s.CNIC && `(${s.CNIC})`}
          </div>
        ))}
    </div>
  )}
</div>


        {/* Search Result Section */}
        {loadingSearch && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Searching for "{searchName}"...</p>
          </div>
        )}

        {!loadingSearch && searchRecords.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8">
            <div className="space-y-3">
              {searchRecords.map((s) => {
  const todayStatus = s.history.find(h => h.date === today)?.status || "Absent";
  return (
    <div
      key={s._id}
      className="grid grid-cols-4 gap-4 p-6 hover:bg-gray-50/80 cursor-pointer"
      onClick={() => openStudentModal(s._id)} // parent click for modal only
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">{s.name.charAt(0)}</span>
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-gray-800">{s.name}</p>
          <p className="text-gray-500 text-sm">{s.CNIC}</p>
          <p className="text-gray-500 text-sm">{s.rollNumber}</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-xl">
          <p className="text-indigo-700 font-medium">{s.course}</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className={`px-4 py-2 rounded-xl font-bold text-lg ${
          todayStatus === "Present"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
          {todayStatus}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {todayStatus === "Absent" && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // parent click block
              markPresent(s._id);  // context students update
               setSearchRecords(prev =>
      prev.map(r =>
        r._id === s._id ? { ...r, history: [...r.history.filter(h => h.date !== today), { date: today, status: "Present" }] } : r
      )
    );
            }}
            className="bg-green-500 text-white px-6 py-2 rounded-xl"
          >
            Mark Present
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteStudent(s._id);
          }}
          className="bg-red-500 text-white px-3 py-2 rounded-xl"
        >
          Delete
        </button>
      </div>
    </div>
  );
})}

     
            </div>
          </div>
           
        )}
               
     

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Mark Attendance</h2>
            <p className="text-gray-600 text-lg">Today's Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mx-auto mt-4"></div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {students.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Students Found</h3>
              <p className="text-gray-500 text-lg">No students added yet. Please add students first to mark attendance.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
                  <div className="grid grid-cols-4 gap-4 text-white font-bold text-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span>Student Name</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                      <span>Course</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Status</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <span>Action</span>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                  {students.map((s, index) => {
                    const todayStatus = s.history.find((h) => h.date === today)?.status || "Absent";
                    return (
                      <div key={s._id} className={`grid grid-cols-4 gap-4 p-6 hover:bg-gray-50/80 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'}`}
                      onClick={() => openStudentModal(s._id)} 
                      >
                        <div className="flex items-center space-x-3">
                         <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                           <span className="text-white font-bold text-lg">{s.name.charAt(0)}</span>
                         </div>
                         <div className="flex flex-col">
                           <p className="font-semibold text-gray-800 text-lg">{s.name}</p>
                           <p className="text-gray-500 text-sm mt-1">{s.CNIC}</p> {/* CNIC displayed here */}
                           <p className="text-stone-900 text-sm mt-1">{s.rollNumber}</p>
                        </div>
                         </div>
                     
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-xl">
                            <p className="text-indigo-700 font-medium">{s.course}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className={`px-4 py-2 rounded-xl font-bold text-lg flex items-center space-x-2 ${
                            todayStatus === "Present" 
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700" 
                              : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
                          }`}>
                            {todayStatus === "Present" ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            )}
                            <span>{todayStatus}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {todayStatus === "Absent" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markPresent(s._id);
                              }}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center space-x-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span>Mark Present</span>
                            </button>
                          )}
                          <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteStudent(s._id);
                          }} 
                         className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-400 hover:to-red-600 text-white font-bold px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center space-x-2">
                            Delete
                          </button>
                          {todayStatus === "Present" && (
                            <div className="flex items-center space-x-2 text-green-600 font-semibold">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <span>Marked ✓</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-gray-700 text-lg">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600">{students.length}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-gray-700 text-lg">Present Today</h3>
              <p className="text-3xl font-bold text-green-600">
                {students.filter(s => s.history.find(h => h.date === today)?.status === "Present").length}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-gray-700 text-lg">Absent Today</h3>
              <p className="text-3xl font-bold text-red-600">
                {students.filter(s => s.history.find(h => h.date === today)?.status === "Absent").length}
              </p>
            </div>
          </div>
        </div>
      </div>
       {selectedStudentId && (
  <StudentAttendanceModal
    studentId={selectedStudentId}
    onClose={closeStudentModal}
  />
)}
    </div>
    
  );
}

export default Attendance;
