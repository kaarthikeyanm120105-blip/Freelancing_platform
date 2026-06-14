import express from 'express';
import { createConversation, getUserConversations, getMessages, sendMessage } from '../controllers/chatController.js';
import userIdMiddleware from '../middleware/userIdMiddleware.js';

const router = express.Router();

router.post('/conversation', userIdMiddleware, createConversation);
router.get('/conversations', userIdMiddleware, getUserConversations);
router.get('/messages/:conversationId', userIdMiddleware, getMessages);
router.post('/message', userIdMiddleware, sendMessage);

export default router;
