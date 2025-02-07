// src/pages/SessionList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  // Get the user ID and token from localStorage
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const loadSessions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/sessions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError('Error loading sessions');
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDelete = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await axios.delete(`http://localhost:3000/sessions/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSessions(sessions.filter(session => session.id !== sessionId));
      } catch (error) {
        console.error('Error deleting session:', error);
        setError('Error deleting session');
      }
    }
  };

  const handleRegister = async (sessionId) => {
    if (!userId) {
      alert('You must be logged in to register for a session');
      return;
    }
    try {
      await axios.post(`http://localhost:3000/registrations`, {
        userId: userId,
        sessionId: sessionId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Successfully registered for the session!');
    } catch (error) {
      console.error('Error registering for session:', error);
      alert('Error registering for session');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Available Sessions</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

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
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleRegister(session.id)}
                  >
                    Register
                  </button>
                  {authService.getCurrentUser()?.role === 'ADMIN' && (
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(session.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 0 && !error && (
        <div className="alert alert-info">
          No sessions available at the moment.
        </div>
      )}
    </div>
  );
};

export default SessionList;
