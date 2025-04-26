import React from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../contexts/RoleContext';

function Navbar() {
  const { userRole, isLoggedIn, logout } = useRole();

  return (
    <nav className="bg-glass border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gradient">
            LifeNFT
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="nav-pill text-slate-300 hover:text-white">
              Home
            </Link>
            <Link to="/explore" className="nav-pill text-slate-300 hover:text-white">
              Explore
            </Link>
            {isLoggedIn && (
              <>
                {userRole === 'government' && (
                  <Link to="/gov-dashboard" className="nav-pill text-slate-300 hover:text-white">
                    Dashboard
                  </Link>
                )}
                {userRole === 'hospital' && (
                  <Link to="/hospital-dashboard" className="nav-pill text-slate-300 hover:text-white">
                    Dashboard
                  </Link>
                )}
                {userRole === 'user' && (
                  <Link to="/user-dashboard" className="nav-pill text-slate-300 hover:text-white">
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="modern-button"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="nav-pill text-slate-300 hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="modern-button">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 