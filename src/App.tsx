import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './view/loginView';
import CustomerFormView from './view/customerFormView';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './view/dashboardView';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginView />} />
        
        {/* General dashboard - all logged in users */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Customer Service only */}
        <Route 
          path="/CSForm" 
          element={
            <ProtectedRoute allowedUsernames={["CS"]}>
              <CustomerFormView />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;