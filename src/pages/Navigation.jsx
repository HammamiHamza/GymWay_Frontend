import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navigation = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser || null);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">GymApp</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!user ? (
              // Not logged in - show login/register options
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login-member">Member Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login-staff">Staff Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register-member">Register as Member</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register-staff">Register as Staff</Link>
                </li>
              </>
            ) : (
              // Logged in - show role-specific options
              <>
                {(user.role === 'ADMIN' || user.role === 'STAFF') ? (
                  // Admin/Staff specific links
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/add-session">Add Session</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/manage-sessions">Manage Sessions</Link>
                    </li>
                  </>
                ) : (
                  // Member specific links
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/session-registration">View Sessions</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/my-registrations">My Registrations</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <span className="nav-link text-light">Welcome, {user.firstName || user.email}</span>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light ms-2" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;