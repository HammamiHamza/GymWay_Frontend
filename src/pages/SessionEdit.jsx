import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SessionEdit = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [session, setSession] = useState({
    sessionName: '',
    instructor: '',
    schedule: '',
    duration: '',
    capacity: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/sessions/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Convert date to input format
        const sessionData = response.data;
        const scheduleDate = new Date(sessionData.schedule);
        const formattedDate = scheduleDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
        
        setSession({
          ...sessionData,
          schedule: formattedDate
        });
      } catch (error) {
        console.error('Error fetching session:', error);
        setError('Error loading session details');
      }
    };

    fetchSession();
  }, [sessionId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/sessions/${sessionId}`, session, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Session updated successfully!');
      navigate('/sessions');
    } catch (error) {
      console.error('Error updating session:', error);
      setError(error.response?.data?.message || 'Error updating session');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Session</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Session Name</label>
          <input
            type="text"
            className="form-control"
            name="sessionName"
            value={session.sessionName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Schedule</label>
          <input
            type="datetime-local"
            className="form-control"
            name="schedule"
            value={session.schedule}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Duration (minutes)</label>
          <input
            type="number"
            className="form-control"
            name="duration"
            value={session.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Capacity</label>
          <input
            type="number"
            className="form-control"
            name="capacity"
            value={session.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Update Session
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/sessions')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionEdit; 