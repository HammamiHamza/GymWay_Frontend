// src/pages/SessionList.jsx
import { useEffect, useState } from 'react';
import { fetchSessions, deleteSession } from '../services/authService'; // vos fonctions déjà existantes
import { registerForSession } from '../services/registrationService';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);

  // Récupération de l'identifiant utilisateur (exemple : stocké dans le localStorage)
  const userId = localStorage.getItem('userId');

  const loadSessions = async () => {
    try {
      const response = await fetchSessions();
      setSessions(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des sessions', error);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDelete = async (session_id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette session ?")) {
      try {
        await deleteSession(session_id);
        setSessions(sessions.filter(session => session.session_id !== session_id));
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleRegister = async (sessionId) => {
    if (!userId) {
      alert('Vous devez être connecté pour vous inscrire');
      return;
    }
    try {
      await registerForSession(userId, sessionId);
      alert('Inscription réussie!');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'inscription');
    }
  };

  return (
    <div>
      <h2>Liste des sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.session_id}>
            <strong>{session.session_name}</strong> <br />
            Horaire: {session.schedule} - Durée: {session.duration} min - Capacité: {session.capacity} <br />
            <button onClick={() => handleRegister(session.session_id)}>S'inscrire</button>
            <button onClick={() => handleDelete(session.session_id)}>❌ Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;
