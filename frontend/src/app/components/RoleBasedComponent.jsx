import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function RoleBasedComponent({ freelancerComponent: FreelancerComp, clientComponent: ClientComp, adminComponent: AdminComp }) {
    const { user } = useAuth();

    if (!user) return null;

    if (user.role === 'admin') {
        return AdminComp ? <AdminComp /> : <Navigate to="/admin" replace />;
    }

    if (user.role === 'client') {
        return ClientComp ? <ClientComp /> : <Navigate to="/dashboard" replace />;
    }

    return FreelancerComp ? <FreelancerComp /> : <Navigate to="/dashboard" replace />;
}
