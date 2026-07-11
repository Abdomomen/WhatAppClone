
"use client"
import { createContext,useContext,useRef } from "react";
import { useStore } from "zustand";
import { clientStore,tokenStore } from "./stores.js";
const context= createContext(null)

export default function Provider({children}){
    const store=useRef()
    const token=useRef()
    if(!store.current){
        store.current=clientStore()
    }
    if(!token.current){
        token.current=tokenStore()
    }

    return <context.Provider value={{userStore:store.current,tokenStore:token.current}}>{children}</context.Provider>
}

export function useUser(selector){
    const {userStore}=useContext(context)
    return useStore(userStore,selector)
}

export function useToken(selector){
    const {tokenStore}=useContext(context)
    return useStore(tokenStore,selector)
}