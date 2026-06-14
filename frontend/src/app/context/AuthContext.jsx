import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshUser = async () => {
        try {
            const { data } = await api.get('/auth/userData');
            if (data.success) {
                setUser({ ...data.user, role: data.user.role || 'freelancer' });
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // check if user is logged in on mount
    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (role, email, password) => { // Role might be redundant if backend handles it, but keeping signature flexible
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.success) {
                setUser({ ...data.user, role: data.role });
                toast.success('Login successful!');
                return true;
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            setError(msg);
            toast.error(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/register', userData);
            if (data.success) {
                setUser({ ...data.user, role: data.role });
                toast.success('Registration successful!');
                return true;
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            setError(msg);
            toast.error(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            toast.success('Logged out successfully');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
