"use client";
import React, { useState } from 'react';

interface Contact {
  name: string;
  unread: number;
  avatar: string;
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
  
  const contacts: Contact[] = [
    { name: 'Vanessa Tucker', unread: 5, avatar: '/api/placeholder/40/40' },
    { name: 'William Harris', unread: 2, avatar: '/api/placeholder/40/40' },
    { name: 'Sharon Lessman', unread: 0, avatar: '/api/placeholder/40/40' },
    { name: 'Christina Mason', unread: 0, avatar: '/api/placeholder/40/40' },
    { name: 'Fiona Green', unread: 0, avatar: '/api/placeholder/40/40' },
    { name: 'Doris Wilder', unread: 0, avatar: '/api/placeholder/40/40' }
  ];

  const messages: Message[] = [
    { id: 1, sender: 'You', content: 'Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.', time: '2:33 am', isMe: true },
    { id: 2, sender: 'Sharon Lessman', content: 'Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.', time: '2:34 am', isMe: false },
    { id: 3, sender: 'You', content: 'Cum ea graeci tractatos.', time: '2:35 am', isMe: true },
    { id: 4, sender: 'Sharon Lessman', content: 'Sed pulvinar, massa vitae interdum pulvinar, risus lectus porttitor magna, vitae commodo lectus mauris et velit.', time: '2:36 am', isMe: false }
  ];

  return (
    <main className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl mb-4 text-gray-900">Messages</h1>
      
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex">
          {/* Contacts Sidebar */}
          <div className="w-full lg:w-1/3 xl:w-1/4 border-r">
            <div className="p-4 hidden md:block">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Search..."
              />
            </div>

            <div className="overflow-y-auto max-h-screen">
              {contacts.map((contact, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b"
                  onClick={() => setSelectedContact(contact)}
                >
                  <img
                    src={contact.avatar}
                    className="w-10 h-10 rounded-full"
                    alt={contact.name}
                  />
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
                  <img
                    src={selectedContact.avatar}
                    className="w-10 h-10 rounded-full"
                    alt={selectedContact.name}
                  />
                  <div className="ml-4 flex-grow">
                    <div className="font-semibold text-gray-900">{selectedContact.name}</div>
                    <div className="text-sm text-gray-500">Typing...</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex mb-4 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <img
                          src="/api/placeholder/40/40"
                          className="w-10 h-10 rounded-full"
                          alt={msg.sender}
                        />
                        <div
                          className={`max-w-md mx-2 px-4 py-2 rounded-lg ${
                            msg.isMe
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="font-semibold mb-1">{msg.sender}</div>
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
                      className="flex-grow px-4 py-2 border rounded-lg"
                      placeholder="Type your message"
                    />
                    <button 
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => setMessage('')}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Default state when no conversation is selected
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-xl">Please select a conversation to start chatting</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatApp;