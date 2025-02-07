import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/authService';

const SessionRegistration = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchSessions();
  }, [navigate]);

  const checkAuthAndFetchSessions = async () => {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token || localStorage.getItem('token');
      
      console.log('Current token:', token); // Debug log

      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login-member');
        return;
      }

      const response = await axios.get('http://localhost:3000/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Sessions response:', response.data); // Debug log
      setSessions(response.data);
    } catch (err) {
      console.error('Error details:', err.response); // Debug log
      if (err.response?.status === 401) {
        console.log('Unauthorized access, clearing session and redirecting');
        authService.logout();
        navigate('/login-member');
      } else {
        setError('Error fetching sessions. Please try again.');
      }
    }
  };

  const handleRegister = async (sessionId) => {
    try {
      const user = authService.getCurrentUser();
      const token = user?.token || localStorage.getItem('token');

      if (!token) {
        navigate('/login-member');
        return;
      }

      const response = await axios.post('http://localhost:3000/registrations', {
        sessionId: sessionId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Registration response:', response.data); // Debug log
      setSuccessMessage('Successfully registered for the session!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh sessions list after successful registration
      checkAuthAndFetchSessions();
    } catch (err) {
      console.error('Registration error details:', err.response); // Debug log
      if (err.response?.status === 401) {
        authService.logout();
        navigate('/login-member');
      } else {
        setError(err.response?.data?.message || 'Error registering for session');
      }
    }
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-link"
            onClick={() => {
              setError('');
              checkAuthAndFetchSessions();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Available Sessions</h2>
      
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      
      <div className="row">
        {sessions.map((session) => (
          <div key={session.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{session.session_name}</h5>
                <p className="card-text">
                  Schedule: {new Date(session.schedule).toLocaleString()}<br />
                  Duration: {session.duration} minutes<br />
                  Available Spots: {session.capacity}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleRegister(session.id)}
                >
                  Register for Session
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {sessions.length === 0 && !error && (
          <div className="col-12 text-center">
            <p>No sessions available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionRegistration; 