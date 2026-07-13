

import fetching from "../middlewares/fetching.js";
const url = "http://localhost:3000/api/v1/conversations";

const conversationServices={
    getConversations:async(data)=>{
        let {token}=data
        try{
            const res=await fetching(`${url}/`, "GET",null,token);
            return res;
        }catch(error){
            return {
                success: false,
                error: error.message || "Something went wrong",
            };
        }
    },
    getConversation:async(data)=>{
        let {token,conversationId}=data
        try{
            const res=await fetching(`${url}/${conversationId}`, "GET",null,token);
            return res;
        }catch(error){
            return {
                success: false,
                error: error.message || "Something went wrong",
            };
        }
    },
    deleteConversation:async(data)=>{
        let {token,conversationId}=data
        try{
            const res=await fetching(`${url}/${conversationId}`, "DELETE",null,token);
            return res;
        }catch(error){
            return {
                success: false,
                error: error.message || "Something went wrong",
            };
        }
    }
}
export default conversationServices
