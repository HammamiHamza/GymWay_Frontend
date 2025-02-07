import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/authService';

const StaffDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newSession, setNewSession] = useState({
    session_name: '',
    schedule: '',
    duration: '',
    capacity: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
      navigate('/login-member');
      return;
    }
    fetchSessions();
  }, [navigate]);

  const fetchSessions = async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get('http://localhost:3000/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data);
    } catch (err) {
      setError('Error fetching sessions');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
      const newSessionData = {
        sessionName: newSession.session_name, // Use the correct property name
        instructorId: 1 // Replace with the actual instructor ID or get it dynamically
      };

      const response = await axios.post('http://localhost:3000/sessions', newSessionData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      setSuccessMessage('Session created successfully!');
      setNewSession({
        session_name: '',
        schedule: '',
        duration: '',
        capacity: ''
      });
      fetchSessions(); // Refresh the session list
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Error creating session');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    
    try {
      const token = authService.getToken();
      await axios.delete(`http://localhost:3000/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Session deleted successfully!');
      fetchSessions();
    } catch (err) {
      setError('Error deleting session');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Staff Dashboard</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">Create New Session</h3>
          <form onSubmit={handleCreateSession}>
            <div className="mb-3">
              <label className="form-label">Session Name</label>
              <input
                type="text"
                className="form-control"
                value={newSession.session_name}
                onChange={(e) => setNewSession({...newSession, session_name: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Schedule</label>
              <input
                type="datetime-local"
                className="form-control"
                value={newSession.schedule}
                onChange={(e) => setNewSession({...newSession, schedule: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                value={newSession.duration}
                onChange={(e) => setNewSession({...newSession, duration: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                className="form-control"
                value={newSession.capacity}
                onChange={(e) => setNewSession({...newSession, capacity: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Session</button>
          </form>
        </div>
      </div>

      <h3>Manage Sessions</h3>
      <div className="row">
        {sessions.map((session) => (
          <div key={session.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{session.session_name}</h5>
                <p className="card-text">
                  Schedule: {new Date(session.schedule).toLocaleString()}<br />
                  Duration: {session.duration} minutes<br />
                  Capacity: {session.capacity}
                </p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteSession(session.id)}
                >
                  Delete Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard; 