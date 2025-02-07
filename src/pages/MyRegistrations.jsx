// src/pages/MyRegistrations.jsx
import { useEffect, useState } from 'react';
import { fetchUserRegistrations } from '../services/registrationService';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const response = await fetchUserRegistrations(userId);
        setRegistrations(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des inscriptions', error);
      }
    };
    if (userId) loadRegistrations();
  }, [userId]);

  return (
    <div>
      <h2>Mes Inscriptions</h2>
      <ul>
        {registrations.map((reg) => (
          <li key={reg.id}>
            Session : {reg.session.session_name} <br />
            Horaire : {reg.session.schedule} <br />
            Inscrit le : {new Date(reg.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRegistrations;
