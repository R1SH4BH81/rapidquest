// src/pages/ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { getConversations } from '../api/conversations';
import useSocket from '../hooks/useSocket';

export default function ChatPage() {
  const params = useParams();
  const navigate = useNavigate();
  const contactParam = params.wa_id;

  // Dynamically set the current user
  // If contact is Neha → current user is Ravi, else → current user is Neha
  const currentUser =
    contactParam === '929967673820'
      ?{ wa_id: '929967673820', name: 'Neha Joshi' } :{ wa_id: '919937320320', name: 'Ravi Kumar' };

  const [conversations, setConversations] = useState([]);
  const socket = useSocket(currentUser.wa_id);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getConversations().then((data) => {
      if (data.success) {
        setConversations(data.conversations);

        // Auto-navigate to first conversation if none selected
        if (!contactParam && !isMobile && data.conversations?.length > 0) {
          const first = data.conversations[0]._id;
          navigate(`/chat/${first}`, { replace: true });
        }
      }
    });
  }, [contactParam, navigate, isMobile]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${contactParam && isMobile ? 'hidden' : 'block'} w-full md:w-80 lg:w-96 bg-white border-r border-gray-200`}>
        <ChatList conversations={conversations} />
      </div>

      {/* Chat window */}
      <div className={`${contactParam ? 'block' : 'hidden md:block'} flex-1 bg-gray-200`}>
        {contactParam ? (
          <ChatWindow
            contactWaId={contactParam}
            socket={socket}
            currentUser={currentUser} // pass currentUser directly
          />
        ) : (
          !isMobile && (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center p-8 max-w-md">
                <img src="/whatsapp-web-icon.png" alt="WhatsApp Web" className="w-20 h-20 mx-auto mb-4" />
                <h3 className="mt-4 text-3xl font-light text-gray-700">WhatsApp Web</h3>
                <p className="mt-2 text-gray-500 text-sm">Send and receive messages without keeping your phone online.<br />Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
