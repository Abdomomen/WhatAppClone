"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useToken } from "../stores/context.jsx";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const token = useToken((state) => state.token);
  const [socket, setSocket] = useState(null);
  const listenersRef = useRef(new Set());

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    const ws = new WebSocket(`ws://localhost:3000?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected!");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        listenersRef.current.forEach((listener) => listener(data));
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected!");
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [token]);

  const addListener = (callback) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  };

  const sendMessage = (data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.warn("Socket not connected or not open.");
    }
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage, addListener }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
