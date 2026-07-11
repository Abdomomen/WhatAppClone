import { createStore } from "zustand";
import { persist } from "zustand/middleware";


export const clientStore = () => {
    return createStore(
        persist(
            (set) => ({
                user: null,
                setUser: (user) => set({ user }),
                clearUser: () => set({ user: null }),
            }),
            {
                name: "user-storage",
            }
        )
    );
};

export const tokenStore = () => {
    return createStore(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            clearToken: () => set({ token: null }),
        })
    );
};
