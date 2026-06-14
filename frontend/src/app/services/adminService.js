import api from './api';

const adminService = {
    getStats: async () => {
        try {
            const response = await api.get('/admin/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getUsers: async () => {
        try {
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    toggleBlockUser: async (id) => {
        try {
            const response = await api.patch(`/admin/users/${id}/block`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getJobs: async () => {
        try {
            const response = await api.get('/admin/jobs');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteJob: async (id) => {
        try {
            const response = await api.delete(`/admin/jobs/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getProposals: async () => {
        try {
            const response = await api.get('/admin/proposals');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default adminService;
