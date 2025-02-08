import React, { useState } from 'react';
import axios from 'axios';

const Member = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [member, setMember] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:3000/members', {
      firstName,
      lastName,
      email,
      password,
    });
    setMember(response.data);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Register as a Member</h1>
      <div className="col-md-6 mx-auto">
        <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 btn-sm">Register</button>
        </form>

        {member && (
          <div className="alert alert-success mt-4">
            <h2>Member Registered:</h2>
            <p>Name: {member.firstName} {member.lastName}</p>
            <p>Email: {member.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Member;
