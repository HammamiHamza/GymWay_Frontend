import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaypalCheckout from '../components/PaypalCheckout';

const Payment = () => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePaymentSuccess = (details) => {
    setPaymentStatus('Payment successful!');
    console.log('Payment completed:', details);
    setTimeout(() => {
      navigate('/payment-success');
    }, 2000);
  };

  const handlePaymentError = (error) => {
    setError(typeof error === 'string' ? error : 'Payment failed. Please try again.');
    console.error('Payment error:', error);
  };

  return (
    <div className="container mt-5">
      <h2>Complete Your Payment</h2>
      
      {paymentStatus && (
        <div className="alert alert-success">
          {paymentStatus}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      <div className="card p-4 mt-4">
        <h4>Payment Details</h4>
        <p>Amount: $50.00</p>
        <p>Currency: USD</p>
        
        <PaypalCheckout
          amount={50.00}
          currency="USD"
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    </div>
  );
};

export default Payment; 