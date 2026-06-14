import { Card } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Avatar } from '../../components/ui/avatar.jsx';
import { ScrollArea } from '../../components/ui/scroll-area.jsx';
import { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';
import { mockMessages } from '../../data/mockData';

export default function FreelancerMessages() {
  const [selectedMessage, setSelectedMessage] = useState(mockMessages[0]);
  const [newMessage, setNewMessage] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Messages</h2>
        <p className="text-gray-600">Communicate with clients</p>
      </div>

      <Card className="h-[600px] flex">
        {/* Conversations List */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search messages..." className="pl-9" />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedMessage.id === msg.id ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {msg.senderName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm truncate">{msg.senderName}</span>
                      {!msg.read && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{msg.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {selectedMessage.senderName[0]}
              </div>
              <div>
                <div className="font-semibold">{selectedMessage.senderName}</div>
                <div className="text-sm text-green-600">● Online</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {selectedMessage.senderName[0]}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3 inline-block max-w-md">
                    <p className="text-sm">{selectedMessage.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(selectedMessage.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="flex-1 flex flex-col items-end">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-3 inline-block max-w-md">
                    <p className="text-sm">Thank you for reaching out! I'd be happy to discuss the project details.</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Just now</p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setNewMessage('')}
              />
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}





