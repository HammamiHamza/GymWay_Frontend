import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const MembershipGuard = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.membershipStatus !== 'active') {
    return <Navigate to="/membership-payment" />;
  }

  return children;
};

export default MembershipGuard; 