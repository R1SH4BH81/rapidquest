import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { getConversations } from "../api/conversations";
import useSocket from "../hooks/useSocket";

export default function ChatPage() {
  const params = useParams();
  const navigate = useNavigate();
  const contactParam = params.wa_id;

  const currentUser =
    contactParam === "929967673820"
      ? { wa_id: "929967673820", name: "Neha Joshi" }
      : { wa_id: "919937320320", name: "Ravi Kumar" };

  const [conversations, setConversations] = useState([]);
  const socket = useSocket(currentUser.wa_id);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getConversations().then((data) => {
      if (data.success) {
        setConversations(data.conversations);
        if (!contactParam && !isMobile && data.conversations?.length > 0) {
          const first = data.conversations[0]._id;
          navigate(`/chat/${first}`, { replace: true });
        }
      }
    });
  }, [contactParam, navigate, isMobile]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          contactParam && isMobile ? "hidden" : "block"
        } w-full md:w-80 lg:w-96 bg-[#111B21] text-white border-r border-gray-700 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#202C33] border-b border-gray-700">
          <img
            src="https://rishabhcv.vercel.app/img/logo.png"
            alt="Me"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex space-x-4 text-gray-300">
            <button className="hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="white"
              >
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
            </button>
            <button className="hover:text-white">⋮</button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-[#111B21] border-b border-gray-700">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full px-4 py-2 text-sm rounded-full bg-[#202C33] text-white placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-[#111B21]">
          <ChatList conversations={conversations} />
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`${
          contactParam ? "block" : "hidden md:block"
        } flex-1 bg-chat-pattern relative`}
        style={{
          backgroundImage: "url('/whatsapp-bg.png')",
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
        }}
      >
        {contactParam ? (
          <ChatWindow
            contactWaId={contactParam}
            socket={socket}
            currentUser={currentUser}
          />
        ) : (
          !isMobile && (
            <div className="flex items-center justify-center h-full bg-[#F0F2F5]">
              <div className="text-center p-8 max-w-md">
                <img
                  src="/whatsapp-web-icon.png"
                  alt="WhatsApp Web"
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="mt-4 text-3xl font-light text-gray-700">
                  WhatsApp Web
                </h3>
                <p className="mt-2 text-gray-500 text-sm">
                  Send and receive messages without keeping your phone online.
                  <br />
                  Use WhatsApp on up to 4 linked devices and 1 phone at the same
                  time.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
