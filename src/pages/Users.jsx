import React, { useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:3000/users', {
      name,
      email,
      password,
    });
    setUser(response.data);
  };

  return (
    <div>
      <h1>Créer un utilisateur</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Créer</button>
      </form>

      {user && (
        <div>
          <h2>Utilisateur créé :</h2>
          <p>Nom : {user.name}</p>
          <p>Email : {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Users;
