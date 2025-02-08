import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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

  const handleEdit = (sessionId) => {
    navigate(`/sessions/edit/${sessionId}`); // Navigate to the edit page
  };

  // Define the handleRegister function
  const handleRegister = async (sessionId) => {
    try {
      const response = await axios.post(`http://localhost:3000/registrations/session/${sessionId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Successfully registered for the session!');
      // Optionally, you can refresh the sessions or registered sessions here
    } catch (error) {
      console.error('Error registering for session:', error);
      setError('Error registering for session');
    }
  };

  const isStaff = user?.type === 'staff';
  const isAdmin = user?.type === 'admin';
  const isMember = user?.type === 'member';

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
                  {isMember && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleRegister(session.id)} // Register button
                    >
                      Register
                    </button>
                  )}
                  
                  {(isStaff || isAdmin) && (
                    <div className="btn-group">
                      <button 
                        className="btn btn-warning me-2"
                        onClick={() => handleEdit(session.id)} // Edit button
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(session.id)} // Delete button
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Session button for staff/admin */}
      {(isStaff || isAdmin) && (
        <div className="mt-4">
          <button 
            className="btn btn-success"
            onClick={() => navigate('/sessions/create')}
          >
            Create New Session
          </button>
        </div>
      )}

      {sessions.length === 0 && !error && (
        <div className="alert alert-info">
          No sessions available at the moment.
        </div>
      )}
    </div>
  );
};

export default SessionList;