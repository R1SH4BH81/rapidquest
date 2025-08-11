// src/components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMessagesByWaId } from "../api/messages.js";
import { getConversations } from "../api/conversations.js";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import Header from "./Header.jsx";
import "./whatsapp.css"; // ← import WhatsApp-like styles

export default function ChatWindow({ contactWaId, socket, currentUser }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [contactName, setContactName] = useState(contactWaId);
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goBack = () => navigate("/chats");

  useEffect(() => {
    if (!contactWaId) return;
    getConversations()
      .then((data) => {
        if (data.success && Array.isArray(data.conversations)) {
          const convo = data.conversations.find((c) => c.wa_id === contactWaId);
          setContactName(convo?.name || contactWaId);
        } else {
          setContactName(contactWaId);
        }
      })
      .catch(() => setContactName(contactWaId));
  }, [contactWaId]);

  useEffect(() => {
    if (!contactWaId || !currentUser?.wa_id) return;
    getMessagesByWaId(contactWaId, currentUser.wa_id)
      .then((data) => {
        if (data.success) setMessages(data.messages);
      })
      .catch(() => {});
  }, [contactWaId, currentUser?.wa_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || !currentUser) return;
    const handleIncoming = (msg) => {
      const isRelevant =
        (msg.sender_wa_id === contactWaId &&
          msg.receiver_wa_id === currentUser.wa_id) ||
        (msg.sender_wa_id === currentUser.wa_id &&
          msg.receiver_wa_id === contactWaId);
      if (isRelevant) setMessages((prev) => [...prev, msg]);
    };

    socket.on("new_message", handleIncoming);
    socket.on("message_sent", handleIncoming);
    socket.on("status_updated", (statusData) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.message_id === statusData.message_id
            ? { ...m, status: statusData.status }
            : m
        )
      );
    });

    return () => {
      socket.off("new_message", handleIncoming);
      socket.off("message_sent", handleIncoming);
      socket.off("status_updated");
    };
  }, [socket, contactWaId, currentUser]);

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <Header
          contactName={contactName}
          contactNumber={contactWaId}
          onBack={isMobile ? goBack : null}
        />
      </div>

      {/* Messages */}
      <div className="chat-body">
        <div className="chat-messages">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.message_id}
              message={msg}
              isOwn={msg.sender_wa_id === currentUser.wa_id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="chat-footer">
        <MessageInput
          contactWaId={contactWaId}
          socket={socket}
          currentUser={currentUser}
          onMessageSent={(msg) =>
            setMessages((prev) => [
              ...prev,
              { ...msg, sender_wa_id: currentUser.wa_id },
            ])
          }
        />
      </div>
    </div>
  );
}
