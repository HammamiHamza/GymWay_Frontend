import { useState } from 'react';
import { createSession } from '../services/authService';

const SessionForm = ({ onSessionAdded }) => {
  const [sessionData, setSessionData] = useState({
    session_name: '',
    schedule: '',
    capacity: '',
    duration: ''
  });

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSession(sessionData);
      alert('Session ajoutée avec succès');
      setSessionData({ session_name: '', schedule: '', capacity: '', duration: '' });
      onSessionAdded();
    } catch (error) {
      alert('Erreur lors de l’ajout');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter une session</h2>
      <input type="text" name="session_name" placeholder="Nom de la session" value={sessionData.session_name} onChange={handleChange} required />
      <input type="text" name="schedule" placeholder="Horaire" value={sessionData.schedule} onChange={handleChange} required />
      <input type="number" name="capacity" placeholder="Capacité" value={sessionData.capacity} onChange={handleChange} required />
      <input type="number" name="duration" placeholder="Durée (minutes)" value={sessionData.duration} onChange={handleChange} required />
      <button type="submit">Add Session</button>
    </form>
  );
};

export default SessionForm;
