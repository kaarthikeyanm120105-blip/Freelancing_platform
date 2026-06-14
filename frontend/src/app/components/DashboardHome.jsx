import React from 'react';
import { useAuth } from '../context/AuthContext';
import FreelancerDashboard from '../pages/freelancer/FreelancerDashboard.jsx';
import ClientDashboard from '../pages/client/ClientDashboard.jsx';

export default function DashboardHome() {
    const { user } = useAuth();

    if (!user) return null;

    if (user.role === 'client') {
        return <ClientDashboard />;
    }

    // Fallback to freelancer
    if (user.role === 'freelancer') {
        return <FreelancerDashboard />;
    }
    
}
