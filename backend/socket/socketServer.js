import { Server } from 'socket.io';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

const onlineUsers = new Map(); // userId -> socketId

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174"],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket User connected: ${socket.id}`);

        socket.on('setup', (userId) => {
            onlineUsers.set(userId, socket.id);
            socket.join(userId); // Personal room for notifications
            io.emit('user_status_change', { userId, status: 'online' });
            console.log(`User registered: ${userId}`);
        });

        socket.on('join_conversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${socket.id} joined conversation: ${conversationId}`);
        });

        socket.on('typing', (data) => {
            const { conversationId, userId } = data;
            socket.to(conversationId).emit('user_typing', { conversationId, userId });
        });

        socket.on('stop_typing', (data) => {
            const { conversationId, userId } = data;
            socket.to(conversationId).emit('user_stop_typing', { conversationId, userId });
        });

        socket.on('send_message', async (data) => {
            try {
                const { conversationId, senderId, messageText, messageType } = data;

                const newMessage = new Message({
                    conversationId,
                    senderId,
                    messageText,
                    messageType: messageType || 'text'
                });
                
                await newMessage.save();
                await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

                // Emit to all users in the specific conversation room
                io.to(conversationId).emit('receive_message', newMessage);

                // If recipient is online but NOT in this room, notify them? 
                // Personal room notification handled by receive_message if they are in the conversation room
                
            } catch (error) {
                console.error("Socket error on send_message:", error);
            }
        });

        socket.on('disconnect', () => {
            let disconnectedUserId = null;
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    onlineUsers.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                io.emit('user_status_change', { userId: disconnectedUserId, status: 'offline' });
            }
            console.log(`Socket User disconnected: ${socket.id}`);
        });
    });

    return io;
};
