import React, { useEffect, useState } from 'react';
import authService from '../services/authService';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) {
    return <div>Vous devez être connecté pour accéder au tableau de bord.</div>;
  }

  return (
    <div>
      <h2>Bienvenue, {user.email} !</h2>
      {/* Affichez d'autres informations utilisateur ici */}
    </div>
  );
};

export default Dashboard;
