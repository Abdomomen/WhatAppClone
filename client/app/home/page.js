"use client"
import conversationServices from "@/app/services/conversation.js"
import { useToken } from "../stores/context.jsx"
import { useEffect , useState} from "react"
export default function Home() {
  const [conversation,setConversations]=useState()
  const {token,setToken}=useToken()
  useEffect(() => {
    const res=conversationServices.getConversations({token})
    if(res.newToken){
      setToken(res.newToken)
    }
    if(res.success){
      setConversations(res.conversations)
    }
  }, [])
  return (
    <div>Home Page</div>
  )
}
