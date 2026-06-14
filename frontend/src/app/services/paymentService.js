import api from './api';

const paymentService = {
    createPaymentIntent: async (jobId, amount) => {
        try {
            const response = await api.post('/payment/create-payment-intent', { jobId, amount });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    confirmPayment: async (paymentData) => {
        try {
            const response = await api.post('/payment/confirm', paymentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    releasePayment: async (jobId) => {
        try {
            const response = await api.post(`/payment/release/${jobId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getEarnings: async () => {
        try {
            const response = await api.get('/payment/earnings');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getClientHistory: async () => {
        try {
            const response = await api.get('/payment/history');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    requestWithdrawal: async (amount) => {
        try {
            const response = await api.post('/payment/withdraw', { amount });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getWithdrawals: async () => {
        try {
            const response = await api.get('/payment/withdrawals');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getWalletStats: async () => {
        try {
            const response = await api.get('/payment/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default paymentService;
