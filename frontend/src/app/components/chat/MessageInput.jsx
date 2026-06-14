import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { SendHorizonal } from 'lucide-react';

const MessageInput = ({ onSend, onTyping, disabled }) => {
    const [message, setMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (message.trim() && !disabled) {
            onSend(message);
            setMessage('');
            if (typing) {
                setTyping(false);
                onTyping(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        } else {
            // Typing logic
            if (!typing) {
                setTyping(true);
                onTyping(true);
            }

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                setTyping(false);
                onTyping(false);
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2 items-center bg-background">
            <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={disabled}
                className="min-h-[44px] max-h-[150px] resize-none rounded-xl"
            />
            <Button
                type="submit"
                disabled={!message.trim() || disabled}
                size="icon"
                className="shrink-0 h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-700"
            >
                <SendHorizonal className="h-5 w-5" />
            </Button>
        </form>
    );
};

export default MessageInput;
