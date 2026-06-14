import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import freelancerModel from '../models/freelancerSchema.js';
import clientModel from '../models/clientSchema.js';

export const createConversation = async (req, res) => {
    try {
        const { jobId, clientId, freelancerId } = req.body;
        
        let conversation = await Conversation.findOne({
            participants: { $all: [clientId, freelancerId] }
        });

        // If we want a separate conversation per job, we can keep jobId in the query
        // But for direct messaging via Connect, jobId is null.
        // Let's allow one general conversation (jobId: null) or one per job.

        if (!conversation) {
            conversation = new Conversation({
                participants: [clientId, freelancerId],
                jobId
            });
            await conversation.save();
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Error creating conversation', error: error.message });
    }
};

export const getUserConversations = async (req, res) => {
    try {
        const userId = req.userId;
        
        const conversations = await Conversation.find({ participants: userId })
            .sort({ updatedAt: -1 });

        const conversationsWithDetails = await Promise.all(
            conversations.map(async (conv) => {
                // Manually populate participants from both models
                const populatedParticipants = await Promise.all(
                    conv.participants.map(async (pId) => {
                        const freelancer = await freelancerModel.findById(pId).select("fullName email profileImage role title");
                        if (freelancer) return freelancer;
                        
                        const client = await clientModel.findById(pId).select("fullName email profileImage role companyName companyLogo");
                        return client;
                    })
                );

                const lastMessage = await Message.findOne({ conversationId: conv._id })
                    .sort({ createdAt: -1 });

                return {
                    ...conv.toObject(),
                    participants: populatedParticipants,
                    lastMessage
                };
            })
        );

        res.status(200).json(conversationsWithDetails);
    } catch (error) {
        console.error('Error fetching user conversations:', error);
        res.status(500).json({ message: 'Error fetching conversations', error: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, messageText } = req.body;
        const senderId = req.userId;

        const newMessage = new Message({
            conversationId,
            senderId,
            messageText
        });

        await newMessage.save();
        await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

        res.status(200).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};
