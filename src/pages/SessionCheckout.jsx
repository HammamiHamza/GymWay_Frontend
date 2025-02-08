
import React, { useState } from 'react';
import axios from 'axios';


const SessionCheckout = ({ userId, sessionId, amount }) => {
  const [registrationData, setRegistrationData] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleRegisterWithPayment = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/registrations/with-payment`, {
        userId,
        sessionId,
        amount,
      });
      setRegistrationData(response.data.registration);
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Erreur lors de l'inscription avec paiement:", error);
      alert("Erreur lors de l'inscription avec paiement");
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Vous pouvez ici éventuellement appeler un endpoint pour confirmer l'inscription payée.
  };

  return (
    <div>
      {/* Avant la création de l'inscription */}
      {!registrationData && (
        <div>
          <h2>Inscription à la session</h2>
          <button onClick={handleRegisterWithPayment}>S'inscrire et payer</button>
        </div>
      )}

      {/* Une fois l'inscription créée, afficher le formulaire de paiement */}
      {registrationData && clientSecret && !paymentSuccess && (
        <div>
          <h2>Finalisez votre paiement</h2>
          <PaymentForm
            amount={amount}                // montant en centimes
            registrationId={registrationData.id}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      )}

      {/* Message de succès après paiement */}
      {paymentSuccess && (
        <div>
          <h2>Paiement réussi !</h2>
          <p>Vous êtes inscrit(e) à la session.</p>
        </div>
      )}
    </div>
  );
};

export default SessionCheckout;
