import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../services/authService';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const userRole = getUserRole();

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Si el usuario no tiene el rol permitido, redirigir al home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleProtectedRoute;
