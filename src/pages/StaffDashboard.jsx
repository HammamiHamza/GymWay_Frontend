import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../contexts/AuthContext';

const StaffDashboard = () => {
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || (currentUser.role !== 'STAFF' && currentUser.role !== 'ADMIN')) {
      navigate('/login-staff');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        if (!authUser) return;
        
        console.log('User authenticated, fetching registrations');
        const token = localStorage.getItem('token');
        console.log('Fetching registrations with token:', token);
        
        const response = await fetch('http://localhost:3000/api/registrations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch registrations');
        }
        
        const data = await response.json();
        console.log('Registrations received:', data);
        setRegistrations(data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [authUser]);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Staff Dashboard</h2>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Welcome, {user?.firstName || user?.email}!</h3>
              <p className="card-text">You have access to the following staff features:</p>
              <div className="list-group">
                <a href="/add-session" className="list-group-item list-group-item-action">
                  Add New Session
                </a>
                <a href="/manage-sessions" className="list-group-item list-group-item-action">
                  Manage Sessions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard; 