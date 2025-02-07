// src/services/registrationService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const registerForSession = async (userId, sessionId) => {
  // Si vous utilisez l'authentification, récupérez le token (ici on suppose que c'est pour l'utilisateur)
  const token = localStorage.getItem('gymUserToken');
  return axios.post(
    `${API_URL}/registrations`,
    { userId, sessionId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const fetchUserRegistrations = async (userId) => {
  return axios.get(`${API_URL}/registrations/${userId}`);
};
