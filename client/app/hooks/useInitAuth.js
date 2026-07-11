"use client";
import { useEffect } from "react";
import { useToken, useUser } from "../stores/context";
import authServices from "../services/auth";

export default function useInitAuth() {
  const token = useToken((state) => state.token);
  const setToken = useToken((state) => state.setToken);
  const setUser = useUser((state) => state.setUser);

  useEffect(() => {
    if (token) return;

    const init = async () => {
      const res = await authServices.refresh();
      if (res.success) {
        setToken(res.accessToken);
        setUser(res.user);
      }
      
    };

    init();
  }, []); 
}
