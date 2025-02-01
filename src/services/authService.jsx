// Importation des outils nécessaires
import axios from 'axios';

const API_URL = ''; // Remplacez par l'URL de votre API

// Fonction pour se connecter
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data)); // Sauvegarder le token dans le localStorage
    }
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion', error);
    throw error;
  }
};

// Fonction pour se déconnecter
const logout = () => {
  localStorage.removeItem('user'); // Supprimer le token du localStorage
};

// Fonction pour vérifier si l'utilisateur est connecté
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user')); // Retourne les informations de l'utilisateur s'il est connecté
};

// Fonction pour vérifier si l'utilisateur est authentifié
const isAuthenticated = () => {
  const user = getCurrentUser();
  return user !== null; // Retourne true si l'utilisateur est connecté, sinon false
};

// Export des fonctions
export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
