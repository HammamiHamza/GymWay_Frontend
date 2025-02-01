import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { setUserSession } from '../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.data.success) {
        setUserSession(response.data.token, response.data.user);
        navigate('/dashboard');
      } else {
        setError('Identifiants incorrects.');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
