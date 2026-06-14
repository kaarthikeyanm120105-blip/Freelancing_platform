import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from 'date-fns';

const ChatBox = ({ messages, currentUserId, otherParticipant, isOtherTyping, isOnline }) => {
    const scrollBottomRef = useRef(null);

    useEffect(() => {
        scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOtherTyping]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={otherParticipant?.profileImage} />
                            <AvatarFallback>{otherParticipant?.fullName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold leading-none">{otherParticipant?.fullName}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                    {messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUserId;
                        
                        return (
                            <div
                                key={msg._id || index}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-2xl p-3 px-4 ${
                                        isMe
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-muted rounded-bl-none'
                                    }`}
                                >
                                    <p className="text-sm shadow-sm whitespace-pre-wrap">{msg.messageText}</p>
                                    <p className={`text-[10px] mt-1 opacity-70 ${isMe ? 'text-right' : 'text-left'}`}>
                                        {format(new Date(msg.createdAt), 'p')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {isOtherTyping && (
                        <div className="flex justify-start">
                            <div className="bg-muted rounded-2xl rounded-bl-none p-3 px-4">
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollBottomRef} />
                </div>
            </ScrollArea>
        </div>
    );
};

export default ChatBox;
