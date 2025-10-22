import React from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '../model/userModel';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUsernames?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  allowedUsernames,
  redirectTo = '/dashboard'
}) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUsernames) {
    const currentUserData = localStorage.getItem('currentUser');
    
    if (!currentUserData) {
      return <Navigate to="/login" replace />;
    }

    const currentUser: User = JSON.parse(currentUserData);

    if (allowedUsernames.indexOf(currentUser.username) === -1) {
      return <Navigate to={redirectTo} replace />;
    }
  
  }

  return <>{children}</>;

};

export default ProtectedRoute;