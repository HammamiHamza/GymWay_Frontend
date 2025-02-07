import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SessionForm = ({ onSessionAdded }) => {
  const [sessionData, setSessionData] = useState({
    sessionName: '',
    schedule: '',
    capacity: '',
    duration: '',
    instructorId: null
  });
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      navigate('/login-staff');
    } else {
      fetchInstructors();
    }
  }, [navigate]);

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter instructors with role 'STAFF'
      const staffInstructors = response.data.filter(user => user.role === 'STAFF');
      setInstructors(staffInstructors);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setError('Error fetching instructors');
    }
  };

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const newSessionData = {
        sessionName: sessionData.sessionName,
        instructor: { id: parseInt(sessionData.instructorId) }
      };

      console.log('Sending session data:', newSessionData);

      const response = await axios.post('http://localhost:3000/sessions', newSessionData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response:', response.data);

      // Reset form and show success message
      setSessionData({
        sessionName: '',
        schedule: '',
        capacity: '',
        duration: '',
        instructorId: null
      });
      setSuccessMessage('Session added successfully!');
      
    } catch (error) {
      console.error('Error adding session:', error);
      setError(error.response?.data?.message || 'Error adding session');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Add New Session</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Session Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="sessionName"
                        value={sessionData.sessionName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Schedule</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="schedule"
                        value={sessionData.schedule}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Capacity</label>
                      <input
                        type="number"
                        className="form-control"
                        name="capacity"
                        value={sessionData.capacity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Duration (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="duration"
                        value={sessionData.duration}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Instructor</label>
                      <select
                        className="form-select"
                        name="instructorId"
                        value={sessionData.instructorId || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Select an instructor</option>
                        {instructors.map((instructor) => (
                          <option key={instructor.id} value={instructor.id}>
                            {instructor.username}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary">
                    Add Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionForm;
