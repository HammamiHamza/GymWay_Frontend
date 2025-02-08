import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const PaypalCheckout = ({ amount, currency, onSuccess, onError }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  const createOrder = async () => {
    try {
      const response = await axios.post('http://localhost:3000/payments/paypal/create', {
        memberId: user.id,
        amount,
        currency
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.paypalOrderId; // Return the PayPal order ID from your backend
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      onError(error.response?.data?.message || 'Failed to create PayPal order');
      throw error;
    }
  };

  const onApprove = async (data) => {
    try {
      const response = await axios.post(`http://localhost:3000/payments/paypal/capture/${data.orderID}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.status === 'completed') {
        console.log('Payment successful:', response.data);
        onSuccess(response.data);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      onError(error.response?.data?.message || 'Failed to capture payment');
    }
  };

  return (
    <div className="paypal-button-container">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={(data) => onApprove(data)}
        onError={(err) => {
          console.error('PayPal error:', err);
          onError(err);
        }}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay'
        }}
      />
    </div>
  );
};

export default PaypalCheckout; 