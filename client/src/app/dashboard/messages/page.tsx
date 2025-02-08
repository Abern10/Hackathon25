"use client"
import React, { useState } from 'react';
import { Phone, Video, MoreHorizontal } from 'lucide-react';

const ChatApp = () => {
  const [message, setMessage] = useState('');
  
  const contacts = [
    { name: 'Vanessa Tucker', status: 'online', unread: 5, avatar: '/api/placeholder/40/40' },
    { name: 'William Harris', status: 'online', unread: 2, avatar: '/api/placeholder/40/40' },
    { name: 'Sharon Lessman', status: 'online', unread: 0, avatar: '/api/placeholder/40/40' },
    { name: 'Christina Mason', status: 'offline', unread: 0, avatar: '/api/placeholder/40/40' },
    { name: 'Fiona Green', status: 'offline', unread: 0, avatar: '/api/placeholder/40/40' },
    { name: 'Doris Wilder', status: 'offline', unread: 0, avatar: '/api/placeholder/40/40' }
  ];

  const messages = [
    { id: 1, sender: 'You', content: 'Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.', time: '2:33 am', isMe: true },
    { id: 2, sender: 'Sharon Lessman', content: 'Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.', time: '2:34 am', isMe: false },
    { id: 3, sender: 'You', content: 'Cum ea graeci tractatos.', time: '2:35 am', isMe: true },
    { id: 4, sender: 'Sharon Lessman', content: 'Sed pulvinar, massa vitae interdum pulvinar, risus lectus porttitor magna, vitae commodo lectus mauris et velit.', time: '2:36 am', isMe: false }
  ];

  return (
    <main className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Messages</h1>
      
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
                <div key={index} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b">
                  <img
                    src={contact.avatar}
                    className="w-10 h-10 rounded-full"
                    alt={contact.name}
                  />
                  <div className="ml-3 flex-grow">
                    <div className="font-semibold">{contact.name}</div>
                    <div className="text-sm text-gray-500">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                        contact.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {contact.status === 'online' ? 'Online' : 'Offline'}
                    </div>
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
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center">
              <img
                src="/api/placeholder/40/40"
                className="w-10 h-10 rounded-full"
                alt="Current chat"
              />
              <div className="ml-4 flex-grow">
                <div className="font-semibold">Sharon Lessman</div>
                <div className="text-sm text-gray-500">Typing...</div>
              </div>
              {/* <div className="flex gap-2">
                <button className="p-2 bg-blue-600 text-white rounded-lg">
                  <Phone className="w-6 h-6" />
                </button>
                <button className="p-2 bg-blue-400 text-white rounded-lg hidden md:block">
                  <Video className="w-6 h-6" />
                </button>
                <button className="p-2 border rounded-lg">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div> */}
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatApp;