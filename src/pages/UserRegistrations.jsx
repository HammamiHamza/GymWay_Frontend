import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/authService';

const UserRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login-member');
      return;
    }
    fetchUserRegistrations(currentUser.id);
  }, [navigate]);

  const fetchUserRegistrations = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/registrations/user/${userId}`);
      setRegistrations(response.data);
    } catch (err) {
      setError('Error fetching your registrations');
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    try {
      await axios.delete(`http://localhost:3000/registrations/${registrationId}`);
      setRegistrations(registrations.filter(reg => reg.id !== registrationId));
    } catch (err) {
      setError('Error canceling registration');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Session Registrations</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        {registrations.map((registration) => (
          <div key={registration.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{registration.session.session_name}</h5>
                <p className="card-text">
                  Date: {new Date(registration.session.schedule).toLocaleString()}<br />
                  Duration: {registration.session.duration} minutes<br />
                  Status: {registration.status}
                </p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleCancelRegistration(registration.id)}
                >
                  Cancel Registration
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {registrations.length === 0 && (
          <div className="col-12">
            <p className="text-center">You haven't registered for any sessions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRegistrations; 