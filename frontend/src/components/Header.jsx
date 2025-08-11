// src/components/Header.jsx
import React from "react";

export default function Header({ contactName, contactNumber, onBack }) {
  // Map specific numbers to names
  const nameMapping = {
    919937320320: "Ravi Kumar",
    929967673820: "Neha Joshi",
  };

  // Determine the display name
  const displayName = nameMapping[contactNumber] || contactName;

  return (
    <div
      style={{
        backgroundColor: "#111b21",
        color: "white",
        padding: "16px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: "1024px",
          margin: "0 auto",
        }}
      >
        {/* Back button (visible only on mobile) */}
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back to chats"
            style={{
              marginRight: "12px",
              display: "inline-flex",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "24px", width: "24px" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {displayName}
          </h1>
          <p
            style={{
              fontSize: "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              margin: 0,
            }}
          >
            {contactNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
