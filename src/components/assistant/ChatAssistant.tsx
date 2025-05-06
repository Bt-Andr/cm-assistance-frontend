
import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => (
  <div className={cn(
    "flex gap-2 mb-4",
    isUser ? "justify-end" : "justify-start"
  )}>
    {!isUser && (
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
        CM
      </div>
    )}
    
    <div className={cn(
      "max-w-[80%] rounded-xl p-3",
      isUser 
        ? "bg-primary text-white rounded-br-none" 
        : "bg-secondary-light text-secondary rounded-bl-none"
    )}>
      <p className="text-sm">{message}</p>
      <p className="text-xs mt-1 opacity-70 text-right">{timestamp}</p>
    </div>
    
    {isUser && (
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white flex-shrink-0">
        JD
      </div>
    )}
  </div>
);

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  // Sample messages
  const messages: ChatMessageProps[] = [
    {
      message: "Hello! I'm your CM Assistant. How can I help you today?",
      isUser: false,
      timestamp: "10:30 AM"
    },
    {
      message: "I need help with setting up automatic responses for common questions.",
      isUser: true,
      timestamp: "10:31 AM"
    },
    {
      message: "I can help with that! Let me guide you through the process of creating automated response templates.",
      isUser: false,
      timestamp: "10:32 AM"
    }
  ];

  const handleSend = () => {
    if (message.trim()) {
      // In a real app, you would add the message to the messages array
      // and handle the response from the chatbot
      console.log("Sending message:", message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-elevated hover:bg-primary/90 transition-all z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
      
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-xl shadow-elevated overflow-hidden flex flex-col z-50 border border-secondary-light">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-medium text-lg">CM Assistant</h3>
            </div>
            <button 
              className="text-white/80 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-white/95">
            {messages.map((msg, index) => (
              <ChatMessage 
                key={index}
                message={msg.message}
                isUser={msg.isUser}
                timestamp={msg.timestamp}
              />
            ))}
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-secondary-light bg-secondary-light">
            <div className="flex gap-2">
              <textarea
                className="flex-1 min-h-10 px-3 py-2 rounded-md border border-secondary-light/50 bg-white resize-none text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                placeholder="Type your message..."
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                size="icon" 
                className="h-10 w-10 bg-primary text-white hover:bg-primary/90"
                onClick={handleSend}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
