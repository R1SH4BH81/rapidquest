import React from "react";
import { Link, useParams } from "react-router-dom";

export default function ChatList({ conversations }) {
  const { wa_id } = useParams();

  return (
    <div>
      {conversations.map((chat) => (
        <Link
          key={chat._id}
          to={`/chat/${chat._id}`}
          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-[#2A3942] transition ${
            wa_id === chat._id ? "bg-[#2A3942]" : ""
          }`}
        >
          <img
            src={
              chat.avatar ||
              "https://tse2.mm.bing.net/th/id/OIP.bKs-B-nRYu-ir0a61euTXQHaHa?r=0&cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3"
            }
            alt={chat.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div className="flex-1 border-b border-gray-700 pb-3">
            <div className="flex justify-between">
              <span className="font-medium text-white">{chat.name}</span>
              <span className="text-xs text-gray-400">{chat.time}</span>
            </div>
            <p className="text-gray-400 text-sm truncate">
              {chat.lastMessage || "No messages yet"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
