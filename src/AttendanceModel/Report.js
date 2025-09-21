import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function Report() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substr(0, 10));
  const [report, setReport] = useState({ present: [], absent: [] });

  // Search feature ke states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRecords, setSearchRecords] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);

  // Date wise report fetch karne ka function
  const fetchReport = useCallback(async () => {
    try {
      const res = await axios.get(`https://attendance-backend-1-z8h9.onrender.com/attendance-report?date=${selectedDate}`);
      setReport({ present: res.data.present, absent: res.data.absent });
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  }, [selectedDate]);

  // Student name or CNIC se search karne ka function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoadingSearch(true);
    try {
      const res = await axios.get(`https://attendance-backend-1-z8h9.onrender.com/attendance-by-student?query=${searchQuery}`);
      setSearchRecords(res.data);
      setSuggestions([]);
    } catch (err) {
      console.error("Error searching records:", err);
      setSearchRecords([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Suggestions fetch karne ka function (name or CNIC)
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(`https://attendance-backend-1-z8h9.onrender.com/attendance-by-student?query=${query}`);
      const sug = res.data.map(rec => ({
        name: rec.student?.name || rec.name,
        CNIC: rec.student?.CNIC || rec.CNIC
      }));
      setSuggestions(sug);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Search Bar Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 flex gap-3 relative">
          <div className="relative flex-1">
  <input
    type="text"
    placeholder="Search student by name or CNIC"
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      fetchSuggestions(e.target.value);
    }}
    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
    className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none z-20 relative"
  />
  {/* Suggestions Dropdown */}
  {suggestions.length > 0 && (
    <ul className=" z-50 top-full left-0 w-full bg-white border rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg">
      {suggestions.map((sug, idx) => (
        <li
          key={idx}
          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
          onClick={() => {
            setSearchQuery(sug.name || sug.CNIC);
            setSuggestions([]);
            handleSearch();
          }}
        >
          {sug.name} {sug.CNIC ? `| CNIC: ${sug.CNIC}` : ''}
        </li>
      ))}
    </ul>
  )}
</div>

          <button
            onClick={handleSearch}
            disabled={loadingSearch || !searchQuery.trim()}
            className="h-11 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition-colors duration-200 font-medium"
          >
            {loadingSearch ? 'Searching...' : 'Search'}
          </button>

          {searchRecords.length > 0 && (
            <button
              onClick={() => { setSearchRecords([]); setSearchQuery(""); setSuggestions([]); }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors duration-200 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Loading & Search Results */}
        {loadingSearch && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Searching for "{searchQuery}"...</p>
          </div>
        )}
        {!loadingSearch && searchRecords.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-600">Search Results</h3>
                <p className="text-gray-600">Found {searchRecords.length} records for "{searchQuery}"</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {searchRecords.map((rec, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-400 rounded-full text-white font-bold flex items-center justify-center">
                      {rec.student?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">{rec.student?.name || 'Unknown Student'}</p>
                      <p className="text-sm text-gray-600">{rec.student?.course || 'Unknown Course'} {rec.student?.CNIC ? `| CNIC: ${rec.student.CNIC}` : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{rec.date}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${rec.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {rec.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
       {/* No Records Found */}
{!loadingSearch && searchQuery && searchRecords.length === 0 && suggestions.length === 0 && (
  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-8 text-center">
    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Records Found</h3>
    <p className="text-gray-500">No attendance records found for "{searchQuery}"</p>
  </div>
)}


        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-4xl font-bold text-center mb-4">📊 Attendance Report</h2>
          <div className="flex justify-center items-center space-x-4">
            <label className="text-lg font-semibold">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white font-bold">{report.present.length + report.absent.length}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-700">Total Records</h3>
            <p className="text-gray-500">For {selectedDate}</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white font-bold">{report.present.length}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-700">Present</h3>
            <p className="text-gray-500">{report.present.length + report.absent.length > 0 ? Math.round((report.present.length / (report.present.length + report.absent.length)) * 100) : 0}% attendance</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white font-bold">{report.absent.length}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-700">Absent</h3>
            <p className="text-gray-500">{report.present.length + report.absent.length > 0 ? Math.round((report.absent.length / (report.present.length + report.absent.length)) * 100) : 0}% absent</p>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Present Students */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-600">Present Students ({report.present.length})</h3>
            </div>
            
            {report.present.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No students were present on this date</p>
            ) : (
              <div className="space-y-3">
               {report.present.map((item, index) => (
  <div key={item._id || index} className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-400">
    <div className="w-12 h-12 bg-green-400 rounded-full text-white font-bold flex items-center justify-center">
      {item.student?.name?.charAt(0) || 'S'}
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-800 text-lg">{item.student?.name || 'Deleted Student'}</p>
     <p className="text-sm text-gray-600">
  {item.student?.course || 'Unknown Course'} {item.student?.CNIC ? `| CNIC: ${item.student.CNIC}` : '| CNIC missing'}
</p>
      {item.student?.isDeleted && (
        <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full mt-1 font-bold">
          STUDENT DELETED
        </span>
      )}
    </div>
  </div>
))}
              </div>
            )}
          </div>

          {/* Absent Students */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-600">Absent Students ({report.absent.length})</h3>
            </div>
            
            {report.absent.length === 0 ? (
              <p className="text-center text-gray-500 py-6">All students were present on this date! 🎉</p>
            ) : (
              <div className="space-y-3">
                {report.absent.map((item, index) => (
  <div key={item._id || index} className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl border-l-4 border-red-400">
    <div className="w-12 h-12 bg-red-400 rounded-full text-white font-bold flex items-center justify-center">
      {item.student?.name?.charAt(0) || 'S'}
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-800 text-lg">{item.student?.name || 'Deleted Student'}</p>
      <p className="text-sm text-gray-600">
  {item.student?.course || 'Unknown Course'} {item.student?.CNIC ? `| CNIC: ${item.student.CNIC}` : '| CNIC missing'}
</p>
      {!item.student?.name && (
        <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full mt-1">
          Student Deleted
        </span>
      )}
    </div>
  </div>
))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Report;