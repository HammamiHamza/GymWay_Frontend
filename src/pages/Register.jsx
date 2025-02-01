import React, { useState } from 'react';
import authService from '../services/authService';  // Assurez-vous que authService existe

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction de gestion de l'inscription
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Remplacer avec la méthode réelle de votre service d'authentification
      const response = await authService.register(email, password);  // Vous devez définir cette méthode dans authService.js
      console.log('Utilisateur inscrit', response);

      // Si l'inscription réussit, rediriger l'utilisateur vers la page de connexion ou dashboard
      // Par exemple :
      // history.push('/login');
    } catch (err) {
      setError('Erreur lors de l\'inscription, veuillez réessayer.');
      console.error('Erreur d\'inscription', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Créer un compte</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
};

export default Register;
