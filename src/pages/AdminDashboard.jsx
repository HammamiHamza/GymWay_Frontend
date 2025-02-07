import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/login-staff');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Admin Dashboard</h2>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Welcome, {user?.firstName || user?.email}!</h3>
              <p className="card-text">You have access to the following admin features:</p>
              <div className="list-group">
                <a href="/add-session" className="list-group-item list-group-item-action">
                  Add New Session
                </a>
                <a href="/manage-sessions" className="list-group-item list-group-item-action">
                  Manage Sessions
                </a>
                <a href="/register-staff" className="list-group-item list-group-item-action">
                  Register New Staff
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 