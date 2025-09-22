import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined" && stored !== "null") {
      user = JSON.parse(stored);
    }
  } catch (e) {
    console.error("Invalid user in localStorage:", e);
    user = null;
  }
  const isLoggedIn = user && user.role === 'admin';
  
  // Don't show navbar on login/signup pages
  const hideNavbarPaths = ['/', '/signup'];
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('🚪 Logged out successfully!');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  // Only show navbar if user is admin
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <ToastContainer position='top-right' autoClose={2000} hideProgressBar={false} />
      <nav className="fixed left-0 w-full top-0 z-50 p-4 bg-white/90 backdrop-blur-sm shadow-2xl border-b border-white/30 flex justify-between items-center">
      
      {/* Navigation Links */}
      <div className="flex gap-4">
        <Link
          to="/addstudent"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300"
        >
          Add Student
        </Link>
        <Link
          to="/attendance"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300"
        >
          Mark Attendance
        </Link>
        <Link
          to="/report"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300"
        >
          Report
        </Link>
      </div>

      {/* User Info and Logout */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">
          Welcome, Admin ({user.username})
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;