// src/pages/Checkout.jsx
import React, { useState } from 'react';
import Payment from './Payment';

const Checkout = ({ registrationId, amount }) => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handlePaymentSuccess = () => {
    // Vous pouvez rediriger l'utilisateur, afficher un message de confirmation, etc.
    setPaymentCompleted(true);
  };

  return (
    <div>
      <h2>Finalisez votre paiement</h2>
      {paymentCompleted ? (
        <div>Paiement réussi ! Merci pour votre inscription.</div>
      ) : (
        <Payment
          amount={amount}                // montant en centimes (ex: 2000 pour 20€)
          registrationId={registrationId} // identifiant lié à l'inscription (facultatif)
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Checkout;
