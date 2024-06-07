import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import LoadingScreen from './components/LoadingScreen'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoadingScreen />} /> {/* Set LoadingScreen as the initial component */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user-dashboard" element={<PrivateRoute component={UserDashboard} role="user" />} />
          <Route path="/admin-dashboard" element={<PrivateRoute component={AdminDashboard} role="admin" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;