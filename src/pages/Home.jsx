import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <div className="col-12">
          <h1 className="display-4 mb-4">Welcome to GymApp</h1>
          <p className="lead mb-5">Choose your login type or register for a new account</p>
        </div>
      </div>
      
      <div className="row justify-content-center g-4">
        <div className="col-md-5">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">Members</h3>
              <p className="card-text">Access your membership details and book sessions</p>
              <Link to="/login-member" className="btn btn-primary me-2">Login</Link>
              <Link to="/register-member" className="btn btn-outline-primary">Register</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-5">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">Staff</h3>
              <p className="card-text">Manage gym operations and member details</p>
              <Link to="/login-staff" className="btn btn-primary me-2">Login</Link>
              <Link to="/register-staff" className="btn btn-outline-primary">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 