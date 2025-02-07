import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './pages/Navigation';
import Home from './pages/Home';
import MemberLogin from './pages/MemberLogin';
import Login from './pages/Login';
import Member from './pages/Member';
import Users from './pages/Users';
import SessionForm from './pages/AddSession';
import SessionRegistration from './pages/SessionRegistration';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import SessionList from './pages/SessionList';
import UserRegistrations from './pages/UserRegistrations';

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-member" element={<MemberLogin />} />
        <Route path="/login-staff" element={<Login />} />
        <Route path="/register-member" element={<Member />} />
        <Route path="/register-staff" element={<Users />} />
        <Route path="/add-session" element={<SessionForm />} />
        <Route path="/session-registration" element={<SessionRegistration />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/manage-sessions" element={<SessionList />} />
        <Route path="/my-registrations" element={<UserRegistrations />} />
      </Routes>
    </Router>
  );
};

export default App;