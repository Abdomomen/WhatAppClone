import mongoose,{Schema} from "mongoose";

const msgSchema=new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        required:true
    },
    conversation:{
        type:Schema.Types.ObjectId,
        ref:"Conversation"
    }
})

const Message=mongoose.model("Message",msgSchema)

export default Message