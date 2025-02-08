// src/components/PaymentForm.jsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Charger Stripe avec la clé publique depuis les variables d'environnement
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentComponent = ({ amount, registrationId, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  // clientSecret fourni par le backend (via la création du PaymentIntent)
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Au montage du composant, demande la création d'un PaymentIntent sur le backend
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/payments`, {
          amount,         // montant en centimes (ex: 2000 pour 20€)
          currency: 'eur', // vous pouvez adapter selon votre configuration
          registrationId,  // facultatif, pour lier le PaymentIntent à une inscription
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Erreur lors de la création du PaymentIntent', error);
        setErrorMsg('Erreur lors de la préparation du paiement.');
      }
    };

    createPaymentIntent();
  }, [amount, registrationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      setErrorMsg(result.error.message);
      setLoading(false);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        onPaymentSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }} />
      {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Paiement en cours...' : 'Payer'}
      </button>
    </form>
  );
};

// Wrapper du composant avec <Elements> pour fournir le contexte Stripe
const Payment = (props) => (
  <Elements stripe={stripePromise}>
    <PaymentComponent {...props} />
  </Elements>
);

export default Payment;
