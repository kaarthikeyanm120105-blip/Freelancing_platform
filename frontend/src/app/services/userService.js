import api from './api';

const userService = {
    searchUsers: async (query, role = '') => {
        const response = await api.get(`/auth/search?query=${query}&role=${role}`);
        return response.data;
    },

    getPublicProfile: async (id) => {
        const response = await api.get(`/auth/public-profile/${id}`);
        return response.data;
    }
};

export default userService;
