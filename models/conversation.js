import mongoose,{Schema} from "mongoose";

const conversationSchema=new Schema({
    type:{
        type:String,
        enum:["private","group"],
        default:"private"
    },
    participants:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    lastMessage:{
        type:Schema.Types.ObjectId,
        ref:"Message"
    },
    group:{
        type:Schema.Types.ObjectId,
        ref:"Group"
    }
})

const Conversation=mongoose.model("Conversation",conversationSchema)

export default Conversation