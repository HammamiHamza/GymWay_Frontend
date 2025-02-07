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
    <div>
      <h1>Register as a Member</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>

      {member && (
        <div>
          <h2>Member Registered:</h2>
          <p>Name: {member.firstName} {member.lastName}</p>
          <p>Email: {member.email}</p>
        </div>
      )}
    </div>
  );
};

export default Member;
