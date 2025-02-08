import { useEffect, useState } from 'react';
import { fetchUserRegistrations, createPaymentIntent } from '../services/registrationService';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

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

    if (userId) {
      loadRegistrations();
    }
  }, [userId]);

  const handlePayment = async (registration) => {
    try {
      const stripe = await stripePromise;

      // Demande au backend de générer un PaymentIntent
      const response = await createPaymentIntent(registration.session.price);
      const { clientSecret } = response.data;

      // Redirection vers Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret,
      });

      if (error) {
        console.error('Erreur de paiement :', error);
      }
    } catch (error) {
      console.error('Erreur lors de la création du paiement', error);
    }
  };

  return (
    <div>
      <h2>Mes Inscriptions</h2>
      {registrations.length === 0 ? (
        <p>Aucune inscription trouvée.</p>
      ) : (
        <ul>
          {registrations.map((reg) => (
            <li key={reg.id}>
              <strong>Session :</strong> {reg.session.session_name} <br />
              <strong>Horaire :</strong> {reg.session.schedule} <br />
              <strong>Inscrit le :</strong> {new Date(reg.created_at).toLocaleString()} <br />
              <strong>Prix :</strong> {reg.session.price} € <br />
              
              {!reg.isPaid && (
                <button onClick={() => handlePayment(reg)}>Payer</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRegistrations;
