import mongoose,{Schema} from "mongoose";


const conversationStateSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    conversation:{
        type:Schema.Types.ObjectId,
        ref:"Conversation",
        required:true
    },
    lastReadMessage:{
        type:Schema.Types.ObjectId,
        ref:"Message",
    },
})

conversationStateSchema.index(
    { user: 1, conversation: 1 },
    { unique: true }
);
const ConversationState= mongoose.model("ConversationState",conversationStateSchema)

export default ConversationState