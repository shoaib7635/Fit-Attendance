import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.role === 'admin') {
      navigate("/addstudent");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://attendance-backend-1-z8h9.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
   
      const result = await res.json();
console.log(result);

      if (res.ok) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.data));
        toast.success(result.message);
        // Admin login successful → navigate to attendance page
        setTimeout(() => {
          navigate("/addstudent");
        }, 1500);
      } else {
        toast.error(result.message); // Access denied or invalid credentials
      }
    } catch (err) {
      toast.error("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
       <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 w-96">
         {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11s1.343 3 3 3 3-1.343 3-3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11h-1M5 11H4m8-7v1m0 13v1m7-7h1m-1-7l.707.707M4.293 4.293L5 5m0 14l-.707.707M20.707 19.707L20 19"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Login
          </h2>
          <p className="text-gray-600">Login to access admin panel</p>
        </div>
      {/* Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Login as Admin
          </button>
        </form>

        <div className="flex justify-center items-center mt-6 text-sm">
          <p className="text-gray-600">Don't have admin access?</p>
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 hover:underline ml-1 cursor-pointer"
          >
            Contact Administrator
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;