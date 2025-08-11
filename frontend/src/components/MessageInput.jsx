// src/components/MessageInput.jsx
import React, { useState, useRef, useEffect } from "react";
import { sendMessage } from "../api/messages.js";

export default function MessageInput({
  contactWaId,
  socket,
  onMessageSent,
  currentUser,
}) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [text]);

  // Typing indicator
  useEffect(() => {
    if (!socket || !currentUser?.wa_id || !contactWaId) return;

    const emitTyping = () => {
      socket.emit("typing", {
        sender: currentUser.wa_id,
        receiver: contactWaId,
        isTyping: true,
      });

      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        socket.emit("typing", {
          sender: currentUser.wa_id,
          receiver: contactWaId,
          isTyping: false,
        });
        setIsTyping(false);
      }, 2000);
    };

    if (text.trim()) {
      setIsTyping(true);
      emitTyping();
    } else {
      setIsTyping(false);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    }

    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [text, contactWaId, socket, currentUser]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !currentUser?.wa_id) return;

    const newMessage = {
      wa_id: contactWaId,
      name: currentUser.name,
      message_id: `local-${Date.now()}`,
      type: "text",
      text: trimmed,
      timestamp: new Date(),
      status: "sent",
      direction: "outgoing",
      sender_wa_id: currentUser.wa_id,
      receiver_wa_id: contactWaId,
    };

    onMessageSent(newMessage);
    socket?.emit("send_message", newMessage);

    try {
      await sendMessage(newMessage);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }

    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {isTyping && (
        <div
          style={{
            padding: "4px 16px",
            backgroundColor: "transparent",
            fontSize: "14px",
            color: "#6b7280",

            fontStyle: "italic",
          }}
        >
          Typing...
        </div>
      )}

      <form
        onSubmit={handleSend}
        style={{
          display: "flex",
          alignItems: "flex-end",
          padding: "8px",
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          gap: "8px",
        }}
      >
        {/* Attachment button */}
        <button
          type="button"
          aria-label="Attach file"
          style={{
            padding: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: "#6b7280",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="gray"
          >
            <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
          </svg>
        </button>

        {/* Emoji button */}
        <button
          type="button"
          aria-label="Add emoji"
          style={{
            padding: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: "#6b7280",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="gray"
          >
            <path d="M480-480Zm0 400q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q43 0 83 8.5t77 24.5v90q-35-20-75.5-31.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-32-6.5-62T776-600h86q9 29 13.5 58.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm320-600v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400H276q25 63 80.5 101.5T480-260Z" />
          </svg>
        </button>

        {/* Text area */}
        <textarea
          ref={textareaRef}
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{
            flex: 1,
            border: "none",
            borderRadius: "16px",
            padding: "8px 12px",
            fontSize: "16px",
            outline: "none",
            backgroundColor: "#f3f4f6",
            resize: "none",
            maxHeight: "128px",
          }}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send message"
          style={{
            padding: "8px",
            borderRadius: "50%",
            outline: "none",
            border: "none",
            cursor: text.trim() ? "pointer" : "default",
            backgroundColor: text.trim() ? "#22c55e" : "transparent",
            color: text.trim() ? "#ffffff" : "#9ca3af",
            fontSize: "16px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#212121"
          >
            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
