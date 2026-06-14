import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConversationList from '../../components/chat/ConversationList';
import ChatBox from '../../components/chat/ChatBox';
import MessageInput from '../../components/chat/MessageInput';
import chatService from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { toast } from 'sonner';

const MessagesPage = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const socket = useSocket();

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (conversationId) {
            fetchMessages(conversationId);
            const conv = conversations.find(c => c._id === conversationId);
            if (conv) setActiveConversation(conv);
        } else {
            setActiveConversation(null);
            setMessages([]);
        }
    }, [conversationId, conversations]);

    useEffect(() => {
        if (socket) {
            socket.emit('setup', user?._id);

            socket.on('receive_message', (newMessage) => {
                if (newMessage.conversationId === conversationId) {
                    setMessages(prev => [...prev, newMessage]);
                }
                fetchConversations();
            });

            socket.on('user_status_change', ({ userId, status }) => {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    if (status === 'online') newSet.add(userId);
                    else newSet.delete(userId);
                    return newSet;
                });
            });

            socket.on('user_typing', (data) => {
                if (data.conversationId === conversationId) {
                    setTypingUser(data.userId);
                }
            });

            socket.on('user_stop_typing', (data) => {
                if (data.conversationId === conversationId) {
                    setTypingUser(null);
                }
            });

            return () => {
                socket.off('receive_message');
                socket.off('user_status_change');
                socket.off('user_typing');
                socket.off('user_stop_typing');
            };
        }
    }, [socket, conversationId, user]);

    useEffect(() => {
        if (socket && conversationId) {
            socket.emit('join_conversation', conversationId);
        }
    }, [socket, conversationId]);

    const fetchConversations = async () => {
        try {
            const data = await chatService.getUserConversations();
            setConversations(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load conversations");
            setLoading(false);
        }
    };

    const fetchMessages = async (id) => {
        try {
            const data = await chatService.getMessages(id);
            setMessages(data);
        } catch (error) {
            toast.error("Failed to load messages");
        }
    };

    const handleSendMessage = async (text) => {
        if (!socket || !conversationId) return;

        const otherParticipant = activeConversation.participants.find(p => p._id !== user?._id);

        const messageData = {
            conversationId,
            senderId: user?._id,
            messageText: text,
            messageType: 'text'
        };

        // Emit through socket for real-time
        socket.emit('send_message', messageData);
    };

    const handleSelectConversation = (conv) => {
        navigate(`/messages/${conv._id}`);
    };

    if (loading) return <div className="p-8 text-center">Loading chats...</div>;

    const otherParticipant = activeConversation?.participants.find(p => p._id !== user?._id);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background border-t">
            {/* Left Sidebar: Conversation List */}
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
                <ConversationList
                    conversations={conversations}
                    onSelect={handleSelectConversation}
                    activeId={conversationId}
                    currentUserId={user?._id}
                    onlineUsers={onlineUsers}
                />
            </div>

            {/* Right Side: Chat Window */}
            <div className="hidden md:flex flex-1 flex-col">
                {activeConversation ? (
                    <>
                        <ChatBox
                            messages={messages}
                            currentUserId={user?._id}
                            otherParticipant={otherParticipant}
                            isOtherTyping={typingUser === otherParticipant?._id}
                            isOnline={onlineUsers.has(otherParticipant?._id)}
                        />
                        <MessageInput 
                            onSend={handleSendMessage} 
                            onTyping={(typing) => {
                                if (socket && conversationId) {
                                    socket.emit(typing ? 'typing' : 'stop_typing', { conversationId, userId: user?._id });
                                }
                            }}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                            <p>Pick a colleague to start chatting with them.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
