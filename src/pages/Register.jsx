import React, { useState } from 'react';
import { createCheckoutSession } from '../services/paymentService';  // Nouveau service
import authService from '../services/authService';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentAndRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Démarrer le paiement Stripe
      const response = await createCheckoutSession(email);
      window.location.href = response.data.url; // Redirection vers Stripe Checkout
    } catch (err) {
      setError('Erreur lors de la création du paiement.');
      console.error('Erreur Stripe:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Créer un compte</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handlePaymentAndRegister}>
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
          {isSubmitting ? 'Redirection vers Stripe...' : 'Payer et s\'inscrire'}
        </button>
      </form>
    </div>
  );
};

export default Register;
