import { useState, useContext } from "react";
import { StudentContext } from "../StudentContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";

// AddStudent Component with beautiful theme
function AddStudent() {
  const [student, setStudent] = useState({ name: "", course: "",CNIC: "" });
  const { addStudent } = useContext(StudentContext);

  // CSV file
     const [file, setFile] = useState(null);
  
    const handleUpload = async () => {
      if (!file) return toast.error("Please select a CSV file");
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        await axios.post("https://attendance-backend-1-z8h9.onrender.com/import-csv", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("CSV data imported successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Error importing CSV data");
      }
    };

  const handleCNICChange = (e) => {
  let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
  if (value.length > 13) value = value.slice(0, 13); // max 13 digits

  // Add dashes after 5th and 12th digits
  if (value.length > 5 && value.length <= 12) {
    value = value.slice(0, 5) + "-" + value.slice(5);
  } else if (value.length > 12) {
    value = value.slice(0, 5) + "-" + value.slice(5, 12) + "-" + value.slice(12);
  }

  setStudent({ ...student, CNIC: value });
};


  const handleSubmit = async (e) => {
    
  e.preventDefault();

  const userId = localStorage.getItem("userId");
  if (!userId) return toast.error("You must be logged in");

  try {
    const res = await fetch("https://attendance-backend-1-z8h9.onrender.com/addstudent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: student.name,
        course: student.course,
        CNIC: student.CNIC,
        userId: userId
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      // Add student to context using the student object returned from backend
      addStudent(data.student);
      setStudent({ name: "", course: "", CNIC: ""});
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
      <div className="max-w-lg mx-auto">
        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">Add New Student</h2>
            <p className="text-gray-600 text-base">Register a new student in the system</p>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mx-auto mt-4"></div>
          </div>
          
          <div className="space-y-6">
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={student.name}
                  onChange={(e) => setStudent({ ...student, name: e.target.value })}
                  className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 group-hover:border-emerald-300"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student CNIC</label>
            <div className="relative">
            <input
             type="text"
             placeholder="Enter Student CNIC (e.g., 12345-1234567-1)"
             value={student.CNIC}
             onChange={handleCNICChange}
             className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 group-hover:border-emerald-300"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            {/* CNIC ID Card Icon */}
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
             d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
              </div>
             </div>
            </div>
            
            
            <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name</label>
            <div className="relative">
            <select
             value={student.course}
             onChange={(e) => setStudent({ ...student, course: e.target.value })}
             className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 group-hover:border-emerald-300 appearance-none"
             required
            >
            <option value="">Select a course</option>
            <option value="Front End Web Designing">Front End Web Designing</option>
            <option value="Microsoft Office">Microsoft Office</option>
            <option value="PHP MySQL and Laravel">PHP MySQL and Laravel</option>
            <option value="Graphic Designing">Graphic Designing</option>
            <option value="Full Stack Web Development">Full Stack Web Development</option>
            <option value="C++">C++</option>
            <option value="Java Programing">Java Programing</option>
            <option value="Adobe Photoshop">Adobe Photoshop</option>
            <option value="ASP .NET MVC">ASP .NET MVC</option>
            <option value="Corel Draw">Corel Draw</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="React Native App">React Native App</option>
            <option value="IT">IT</option>
            <option value="C# Programing">C# Programing</option>
            <option value="Adobe Illustrator">Adobe Illustrator</option>
            <option value="Python Programing">Python Programing</option>
            <option value="Game Development">Game Development</option>
            <option value="React.Js">React.Js</option>
            <option value="Social Media Marketing">Social Media Marketing</option>
            <option value="UI/UX s">UI/UX s</option>
            <option value="Amazon">Amazon</option>
            <option value="Mern Stack">Mern Stack</option>
            <option value="Flutter">Flutter</option>
          </select>

    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>

            
            <button 
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 active:scale-95 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="flex items-center justify-center space-x-3 relative z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span className="text-lg">Add Student</span>
              </span>
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
              📚 Fill in all required fields to register a new student
            </p>
            <div className="pt-4 ">
      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="bg-green-700 text-white font-medium rounded px-3 py-2">Upload CSV</button>
    </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;
