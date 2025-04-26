import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../contexts/RoleContext";
import { useHospital } from "../contexts/HospitalContext";

export function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const { login } = useContext(RoleContext);
  const { verifyHospitalCredentials } = useHospital();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!userId.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // For hospital login, use local verification
      if (selectedRole === 'hospital') {
        const result = verifyHospitalCredentials(userId, password);
        if (result.success) {
          localStorage.setItem('userData', JSON.stringify(result.user));
          login(selectedRole);
          navigate("/hospital-dashboard");
        } else {
          setError(result.message);
        }
      } else {
        setError("Please use Hive login for non-hospital accounts");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHiveLogin = () => {
    if (!window.hive_keychain) {
      alert("Hive Keychain is not installed.");
      return;
    }

    const message = "Login to LifeNFT at " + new Date().toISOString();

    // First get the username from Keychain
    window.hive_keychain.requestHandshake(() => {
      window.hive_keychain.requestSignBuffer(
        window.hive_keychain.username, // Use the detected username
        message,
        "Posting",
        function (response) {
          if (response.success) {
            console.log("Hive Keychain Login Successful:", response.username);
            
            // Store user data with selected role
            localStorage.setItem('userData', JSON.stringify({
              User_Id: response.username,
              Role: selectedRole,
              isHiveUser: true
            }));
            
            login(selectedRole);
            
            switch (selectedRole) {
              case "government":
                navigate("/gov-dashboard");
                break;
              case "user":
                navigate("/user-dashboard");
                break;
              default:
                navigate("/");
            }
          } else {
            setError("Hive login failed: " + response.message);
            console.error("Hive Keychain Login Error:", response);
          }
        }
      );
    });
  };

  // Update role selection to automatically set hospital role if hospital ID is entered
  const handleUserIdChange = (e) => {
    const value = e.target.value;
    setUserId(value);
    // If the ID starts with HOSP, automatically set role to hospital
    if (value.startsWith('HOSP')) {
      setSelectedRole('hospital');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to LifeNFT</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username/ID</label>
            <input
              type="text"
              value={userId}
              onChange={handleUserIdChange}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Login as</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="user">User</option>
              <option value="hospital">Hospital</option>
              <option value="government">Government Authority</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Login with Password"}
            </button>
          </div>
        </form>

        <div className="my-6 relative flex items-center">
          <div className="flex-grow border-t border-slate-600"></div>
          <span className="flex-shrink mx-4 text-slate-400">or</span>
          <div className="flex-grow border-t border-slate-600"></div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400 mb-2">For User and Government login:</p>
          <button 
            onClick={handleHiveLogin} 
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium transition-all shadow-lg hover:shadow-blue-500/20"
          >
            Connect with Hive
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <a href="/register" className="text-purple-400 hover:text-purple-300">Register here</a>
        </div>
      </div>
    </div>
  );
}

export default Login;