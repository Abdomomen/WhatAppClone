"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToken, useUser } from "@/app/stores/context";
import conversationServices from "@/app/services/conversation";
import { useSocket } from "@/app/context/SocketContext";

function ConversationContent() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id;
  const token = useToken((state) => state.token);
  const setToken = useToken((state) => state.setToken);
  const currentUser = useUser((state) => state.user);
  const { addListener, sendMessage } = useSocket();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token || !conversationId) return;

    const fetchConversation = async () => {
      try {
        const res = await conversationServices.getConversation({
          token,
          conversationId,
        });
        if (res.newToken) {
          setToken(res.newToken);
        }
        if (res.success) {
          setMessages(res.messages);
        } else {
          setError(res.error || "Failed to load conversation");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [token, conversationId, setToken]);

  // Listen for new messages via WebSocket
  useEffect(() => {
    const removeListener = addListener((data) => {
      if (data.type === "newMsg" && data.data.conversation === conversationId) {
        setMessages((prev) => [...prev, data.data]);
      }
      if (
        data.type === "message_updated" &&
        data.data.conversation === conversationId
      ) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === data.data._id ? data.data : msg)),
        );
      }
      if (
        data.type === "message_deleted" &&
        data.data.conversation === conversationId
      ) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.data._id
              ? { ...msg, deleted: true, content: "" }
              : msg,
          ),
        );
      }
      if (
        data.type === "read_receipt" &&
        data.data.conversationId === conversationId
      ) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.data.messageId ? { ...msg, read: true } : msg,
          ),
        );
      }
    });

    return removeListener;
  }, [addListener, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      sender: currentUser?._id,
      content: newMessage,
      conversation: conversationId,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    sendMessage({
      type: "sendPrivate",
      conversation: conversationId,
      content: newMessage,
    });

    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-wa-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-wa-error text-sm mb-2">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-wa-green hover:text-white text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-wa-muted">Conversation not found</p>
      </div>
    );
  }

  const otherMember = conversation.members?.find(
    (m) => m._id !== currentUser?._id,
  );

  return (
    <div className="flex-1 flex flex-col bg-wa-dark">
      {/* Chat Header - Responsive */}
      <div className="flex items-center gap-3 p-3 border-b border-wa-input bg-wa-surface">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-wa-input/50 transition-colors text-wa-text"
          aria-label="Open conversations"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="w-10 h-10 rounded-full bg-wa-green/10 flex items-center justify-center overflow-hidden flex-shrink-0">
          {otherMember?.avatar?.url ? (
            <img
              src={otherMember.avatar.url}
              alt={otherMember.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#00A884">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-wa-text font-medium truncate">
            {otherMember?.name || otherMember?.username || "Unknown"}
          </h3>
          <p className="text-wa-muted text-xs">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={messagesEndRef}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-wa-muted">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mb-3 opacity-50"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs opacity-60">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender === currentUser?._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                  msg.sender === currentUser?._id
                    ? "bg-wa-green rounded-br-md"
                    : "bg-wa-surface rounded-bl-md"
                } ${msg.deleted ? "opacity-50" : ""}`}
              >
                {!msg.deleted && msg.content && (
                  <p className="text-wa-text text-sm whitespace-pre-wrap">
                    {msg.content}
                  </p>
                )}
                {msg.deleted && (
                  <p className="text-wa-muted text-xs italic">
                    This message was deleted
                  </p>
                )}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-wa-muted/60 text-[10px]">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.sender === currentUser?._id && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="#53B96A"
                      className="flex-shrink-0"
                    >
                      <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Responsive */}
      <div className="p-3 border-t border-wa-input bg-wa-surface">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-wa-input border-none focus:ring-2 focus:ring-wa-green/20 text-wa-text rounded-full px-4 py-2.5 text-sm outline-none placeholder-wa-muted/60"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 rounded-full bg-wa-green hover:bg-wa-green-hover text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed top-0 left-0 h-full w-80 bg-wa-surface border-r border-wa-input z-50 lg:hidden transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex items-center justify-between p-3 border-b border-wa-input">
              <h2 className="text-wa-text font-semibold text-lg">Chats</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-wa-input/50 transition-colors text-wa-text"
                aria-label="Close conversations"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {/* Conversation list would go here - for now just a placeholder */}
              <div className="p-4 text-center text-wa-muted">
                <p className="text-sm">Conversations list</p>
                <p className="text-xs opacity-60 mt-1">Tap a chat to open</p>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

export default function ConversationPage() {
  const token = useToken((state) => state.token);

  if (!token) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-wa-muted">Loading...</p>
      </div>
    );
  }

  return <ConversationContent />;
}
