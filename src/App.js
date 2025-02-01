import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Users from './pages/Users';
import Login from './pages/Login'; // Import de Login
import Dashboard from './pages/Dashboard'; // Import de Dashboard
//import authService from '../services/authService';

import UserManagement from './pages/UserManagement';
import Register from './pages/Register';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userManagement" element={<UserManagement />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
