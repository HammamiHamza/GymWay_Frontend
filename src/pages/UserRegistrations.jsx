import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const UserRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchUserRegistrations = useCallback(async () => {
    if (!token) return;
    
    try {
      console.log('Fetching registrations with token:', token);
      const response = await axios.get('http://localhost:3000/registrations/my-registrations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Registrations received:', response.data);
      setRegistrations(response.data);
      setError('');
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      setError(error.response?.data?.message || 'Failed to load your registrations');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Check authentication
    if (!token || !user) {
      console.log('No token or user found, redirecting to login');
      navigate('/login');
      return;
    }

    // Only fetch once when component mounts or when token/user changes
    fetchUserRegistrations();
  }, [token, user, navigate, fetchUserRegistrations]); // Include all dependencies

  const handleCancelRegistration = async (registrationId) => {
    try {
      console.log('Cancelling registration:', registrationId);

      await axios.delete(`http://localhost:3000/registrations/${registrationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      alert('Registration cancelled successfully');
      fetchUserRegistrations(); // Refresh the list
    } catch (error) {
      console.error('Cancel error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      setError(error.response?.data?.message || 'Failed to cancel registration');
    }
  };

  // Show login prompt if not authenticated
  if (!token || !user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Please <a href="/login">log in</a> to view your registrations.
        </div>
      </div>
    );
  }

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Session Registrations</h2>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="row">
        {registrations.map((registration) => (
          <div key={registration.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{registration.session?.sessionName}</h5>
                <p className="card-text">
                  Instructor: {registration.session?.instructor?.username || 'Not assigned'}<br />
                  Schedule: {registration.session?.schedule ? 
                    new Date(registration.session.schedule).toLocaleString() : 
                    'Not scheduled'}<br />
                  Status: <span className={`badge ${
                    registration.status === 'confirmed' ? 'bg-success' : 'bg-secondary'
                  }`}>
                    {registration.status}
                  </span>
                </p>
                {registration.status === 'confirmed' && (
                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this registration?')) {
                        handleCancelRegistration(registration.id);
                      }
                    }}
                  >
                    Cancel Registration
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {registrations.length === 0 && !error && (
        <div className="alert alert-info">
          You haven't registered for any sessions yet.
        </div>
      )}
    </div>
  );
};

export default UserRegistrations; 