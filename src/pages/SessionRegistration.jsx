import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/authService';

const SessionRegistration = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [registeredSessions, setRegisteredSessions] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    loadSessions();
    loadMyRegistrations();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError('Error loading sessions');
    }
  };

  const loadMyRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/registrations/my-registrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegisteredSessions(response.data);
    } catch (error) {
      console.error('Error loading registrations:', error);
      setError('');
    }
  };

  const handleRegister = async (sessionId) => {
    try {
      if (!token) {
        alert('Please log in to register for sessions');
        return;
      }

      await axios.post(
        `http://localhost:3000/registrations/session/${sessionId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert('Successfully registered for the session!');
      loadMyRegistrations();
    } catch (error) {
      console.error('Registration error details:', error.response);
      setError(error.response?.data?.message || 'Error registering for session');
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    try {
      await axios.delete(`http://localhost:3000/registrations/${registrationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Registration cancelled successfully');
      loadMyRegistrations();
    } catch (error) {
      console.error('Error cancelling registration:', error);
      setError('Error cancelling registration');
    }
  };

  const isSessionRegistered = (sessionId) => {
    return registeredSessions.some(reg => reg.sessionId === sessionId);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Available Sessions</h2>
      
      <div className="row">
        {sessions.map((session) => (
          <div key={session.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{session.sessionName}</h5>
                <p className="card-text">
                  Instructor: {session.instructor?.username || 'Not assigned'}<br />
                  Schedule: {new Date(session.schedule).toLocaleString()}<br />
                  Duration: {session.duration} minutes<br />
                  Capacity: {session.capacity}
                </p>
                <div className="d-flex justify-content-between">
                  {isSessionRegistered(session.id) ? (
                    <button 
                      className="btn btn-danger"
                      onClick={() => {
                        const registration = registeredSessions.find(reg => reg.sessionId === session.id);
                        if (registration) {
                          handleCancelRegistration(registration.id);
                        }
                      }}
                    >
                      Cancel Registration
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleRegister(session.id)}
                    >
                      Register
                    </button>
                  )}
                </div>
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

      <h2 className="mt-5 mb-4">My Registrations</h2>
      <div className="row">
        {registeredSessions.map((registration) => (
          <div key={registration.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{registration.session?.sessionName}</h5>
                <p className="card-text">
                  Schedule: {new Date(registration.session?.schedule).toLocaleString()}<br />
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
      </div>

      {registeredSessions.length === 0 && (
        <div className="alert alert-info">
          You haven't registered for any sessions yet.
        </div>
      )}
    </div>
  );
};

export default SessionRegistration;
