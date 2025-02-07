// Importation des outils nécessaires
import axios from 'axios';

const API_URL = ''; // Remplacez par l'URL de votre API

const SESSIONS_API_URL = `${API_URL}/sessions`;

export const fetchSessions = async () => {
  return axios.get(SESSIONS_API_URL);
};

export const createSession = async (sessionData) => {
  const token = localStorage.getItem('gymAdminToken');
  return axios.post(API_URL, sessionData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteSession = async (session_id) => {
  const token = localStorage.getItem('gymAdminToken');
  return axios.delete(`${SESSIONS_API_URL}/${session_id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUserSession: (token, user) => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return user !== null;
  }
};

export default authService;

