import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

const ConversationList = ({ conversations, onSelect, activeId, currentUserId, onlineUsers = new Set() }) => {
    return (
        <div className="flex flex-col h-full border-r">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Messages</h2>
            </div>
            <ScrollArea className="flex-1">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        No conversations yet.
                    </div>
                ) : (
                    conversations.map(conv => {
                        const otherParticipant = conv.participants?.find(p => p._id !== currentUserId);
                        const isActive = activeId === conv._id;
                        const isOnline = onlineUsers.has(otherParticipant?._id);
                        
                        return (
                            <div
                                key={conv._id}
                                onClick={() => onSelect(conv)}
                                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${isActive ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''}`}
                            >
                                <div className="relative">
                                    <Avatar>
                                        <AvatarImage src={otherParticipant?.profileImage} />
                                        <AvatarFallback>{otherParticipant?.fullName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold truncate">{otherParticipant?.fullName}</span>
                                        {conv.lastMessage && (
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(conv.lastMessage.createdAt), 'p')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {conv.lastMessage?.messageText || "No messages yet"}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <Badge variant="default" className="ml-auto rounded-full px-2 py-0.5">
                                        {conv.unreadCount}
                                    </Badge>
                                )}
                            </div>
                        );
                    })
                )}
            </ScrollArea>
        </div>
    );
};

export default ConversationList;
