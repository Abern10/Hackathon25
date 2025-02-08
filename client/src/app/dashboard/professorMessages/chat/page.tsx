"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Send } from 'lucide-react';

interface Contact {
  name: string;
  unread: number;
  id: string;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
}

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const userId = searchParams.get('userId');
  
  const contacts: Contact[] = [
    { id: '1', name: 'Vanessa Tucker', unread: 5 },
    { id: '2', name: 'William Harris', unread: 2 },
    { id: '3', name: 'Sharon Lessman', unread: 0 },
    { id: '4', name: 'Christina Mason', unread: 0 },
    { id: '5', name: 'Fiona Green', unread: 0 },
    { id: '6', name: 'Doris Wilder', unread: 0 }
  ];

  const messages: Message[] = [
    { id: 1, sender: 'You', content: 'Hello Sharon would you like to be partners for the project?', time: '2:33 am', isMe: true },
    { id: 2, sender: 'Sharon Lessman', content: 'Sure! I am also looking for a partner.', time: '2:34 am', isMe: false },
    { id: 3, sender: 'You', content: "That's perfect!", time: '2:35 am', isMe: true },
    { id: 4, sender: 'Sharon Lessman', content: "I'll see you in class." , time: '2:36 am', isMe: false }
  ];
  
  useEffect(() => {
    if (courseId) {
      // Load course-specific messages
      // Find the specific contact if userId is present
      if (userId) {
        const contact = contacts.find(c => c.id === userId);
        if (contact) setSelectedContact(contact);
      }
    }
  }, [courseId, userId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically add the message to your messages array
      // and possibly send it to a backend
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl mb-4 text-gray-900">Messages</h1>
      
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex h-[600px]">
          {/* Contacts Sidebar */}
          <div className="w-full lg:w-1/3 xl:w-1/4 border-r flex flex-col">
            <div className="p-4 hidden md:block">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search contacts..."
              />
            </div>

            <div className="overflow-y-auto flex-1">
              {contacts.map((contact, index) => (
                <div 
                  key={index} 
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors
                    ${selectedContact?.name === contact.name ? 'bg-gray-50' : ''}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="font-semibold text-gray-900">{contact.name}</div>
                  </div>
                  {contact.unread > 0 && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      {contact.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden lg:flex flex-col flex-grow">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="font-semibold text-gray-900">{selectedContact.name}</div>
                    <div className="text-sm text-gray-500">Online</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            msg.isMe
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <div>{msg.content}</div>
                          <div className="text-xs mt-1 opacity-75">{msg.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your message"
                    />
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Default state when no conversation is selected
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <User className="w-16 h-16 mb-4" />
                <div className="text-xl">Select a conversation to start chatting</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatApp;