"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToken, useUser } from "@/app/stores/context";
import conversationServices from "@/app/services/conversation";

export default function Sidebar({ isOpen, onClose }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useToken((state) => state.token);
  const setToken = useToken((state) => state.setToken);
  const currentUser = useUser((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const fetchConversations = async () => {
      try {
        const res = await conversationServices.getConversations({ token });
        if (res.newToken) {
          setToken(res.newToken);
        }
        if (res.success) {
          setConversations(res.conversations || []);
        } else {
          setError(res.error || "Failed to load conversations");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token, setToken]);

  // Close sidebar on mobile when a conversation is selected
  useEffect(() => {
    if (isOpen && typeof window !== "undefined" && window.innerWidth < 1024) {
      // Keep open on desktop, close on mobile after navigation
    }
  }, [isOpen]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getOtherMember = (members) => {
    return members.find((m) => m._id !== currentUser?._id);
  };

  const handleConversationClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-wa-surface">
        <div className="w-6 h-6 border-2 border-wa-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-wa-surface">
        <p className="text-wa-error text-sm mb-2">{error}</p>
        <button
          onClick={() => router.refresh()}
          className="text-wa-green hover:text-white text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex-1 flex flex-col bg-wa-surface">
      {/* Header */}
      <div className="p-3 border-b border-wa-input flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-wa-green/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#00A884">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
        <h2 className="text-wa-text font-semibold text-lg">Chats</h2>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-wa-green/10 flex items-center justify-center mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00A884"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-wa-muted text-sm">No conversations yet</p>
            <p className="text-wa-muted/60 text-xs mt-1">
              Start a new chat to see it here
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-wa-input/50">
            {conversations.map((conv) => {
              const otherMember = getOtherMember(conv.members);
              const lastMessage = conv.lastMessage;
              const unreadCount = conv.unreadCount || 0;

              return (
                <li key={conv._id}>
                  <Link
                    href={`/home/conversations/${conv._id}`}
                    onClick={handleConversationClick}
                    className="flex items-center gap-3 p-3 hover:bg-wa-input/50 transition-colors cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-wa-green/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {otherMember?.avatar?.url ? (
                        <img
                          src={otherMember.avatar.url}
                          alt={otherMember.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="#00A884"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-wa-text font-medium truncate text-sm">
                          {otherMember?.name ||
                            otherMember?.username ||
                            "Unknown"}
                        </h3>
                        {lastMessage?.createdAt && (
                          <span className="text-wa-muted/60 text-xs whitespace-nowrap ml-2">
                            {formatTime(lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-wa-muted text-sm truncate flex-1">
                          {lastMessage?.sender?._id === currentUser?._id
                            ? "You: "
                            : ""}
                          {lastMessage?.content || "No messages yet"}
                        </p>
                        {unreadCount > 0 && (
                          <span className="ml-2 w-5 h-5 rounded-full bg-wa-green text-white text-xs flex items-center justify-center flex-shrink-0">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  // Mobile: Render as fixed overlay drawer
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <aside
          className={`fixed top-0 left-0 h-full w-80 bg-wa-surface border-r border-wa-input z-50 lg:static lg:z-auto lg:w-auto lg:flex-1 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop: Render as permanent sidebar
  return (
    <aside className="flex-1 flex flex-col lg:flex-1">{sidebarContent}</aside>
  );
}
