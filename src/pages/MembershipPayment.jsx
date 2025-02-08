import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const MembershipPayment = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  const membershipPlans = [
    { id: 1, name: '1 Month', price: 120, months: 1 },
    { id: 3, name: '3 Months', price: 330, months: 3, savings: '8%' },
    { id: 6, name: '6 Months', price: 600, months: 6, savings: '17%' },
    { id: 12, name: '1 Year', price: 1080, months: 12, savings: '25%' }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Please select a plan first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/members/update-membership', {
        memberId: user.id,
        months: selectedPlan.months,
        amount: selectedPlan.price,
        paymentMethod: 'cash'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local user data
      login({
        ...user,
        membershipStatus: 'active',
        membershipExpiry: response.data.membershipExpiry
      });

      setPaymentStatus('Payment recorded successfully!');
      setTimeout(() => {
        navigate('/sessions');
      }, 2000);
    } catch (error) {
      setError('Failed to process payment. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Choose Your Membership Plan</h2>
      
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

      <div className="row mt-4 justify-content-center">
        {membershipPlans.map((plan) => (
          <div key={plan.id} className="col-md-3 mb-4">
            <div 
              className={`card h-100 ${selectedPlan?.id === plan.id ? 'border-primary shadow' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handlePlanSelect(plan)}
            >
              <div className="card-body text-center">
                <h5 className="card-title">{plan.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{plan.price} DT</h6>
                {plan.savings && (
                  <div className="badge bg-success mb-2">Save {plan.savings}</div>
                )}
                <button 
                  className={`btn btn-${selectedPlan?.id === plan.id ? 'primary' : 'outline-primary'} w-100 mt-3`}
                >
                  {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="card p-4 mt-4 mx-auto" style={{ maxWidth: '500px' }}>
          <h4 className="text-center">Payment Summary</h4>
          <div className="mb-3">
            <p><strong>Selected Plan:</strong> {selectedPlan.name}</p>
            <p><strong>Amount to Pay:</strong> {selectedPlan.price} DT</p>
            <p className="text-muted">
              Please proceed to the gym's reception to complete your payment.
              Your membership will be activated immediately after payment confirmation.
            </p>
          </div>
          
          <button 
            className="btn btn-primary w-100"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </span>
            ) : (
              'Confirm Cash Payment'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MembershipPayment; 