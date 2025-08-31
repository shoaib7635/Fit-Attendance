import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AddStudent from "./AttendanceModel/AddStudent";
import Attendance from "./AttendanceModel/Attendance";
import Report from "./AttendanceModel/Report";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import { StudentProvider } from "./StudentContext";
import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <StudentProvider>
      <Router>
       <Navbar/>

       <div className="mt-20">
         <Routes>
          {/* Protected Admin Routes */}
          <Route 
            path="/addstudent" 
            element={
              <ProtectedRoute>
                <AddStudent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report" 
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
       </div>
      </Router>
    </StudentProvider>
  );
}

export default App;