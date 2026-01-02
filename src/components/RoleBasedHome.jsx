import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../services/authService';

const RoleBasedHome = () => {
    const navigate = useNavigate();
    const userRole = getUserRole();

    useEffect(() => {
        // Redirigir según el rol del usuario
        if (userRole === 'ADMIN') {
            navigate('/admin/dashboard', { replace: true });
        } else if (userRole === 'RECEPCIONISTA') {
            navigate('/clientes/registro', { replace: true });
        } else {
            // Si no hay rol, redirigir al login
            navigate('/login', { replace: true });
        }
    }, [userRole, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Redirigiendo...</p>
        </div>
    );
};

export default RoleBasedHome;
