import api from './api';

const chatService = {
    createConversation: async (jobId, clientId, freelancerId) => {
        const response = await api.post('/chat/conversation', { jobId, clientId, freelancerId });
        return response.data;
    },

    getUserConversations: async () => {
        const response = await api.get('/chat/conversations');
        return response.data;
    },

    getMessages: async (conversationId) => {
        const response = await api.get(`/chat/messages/${conversationId}`);
        return response.data;
    },

    sendMessage: async (conversationId, messageText) => {
        const response = await api.post('/chat/message', { conversationId, messageText });
        return response.data;
    }
};

export default chatService;
