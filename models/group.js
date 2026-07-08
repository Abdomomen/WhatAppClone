import mongoose,{Schema} from "mongoose";

const groupSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    admin:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    avatar:{
        url:{
            type:String,
            default:"https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/1200/external-group-chat-social-media-ui-tanah-basah-glyph-tanah-basah.jpg"
        },
        publicId:{
            type:String
        }
    },
    bio:{
        type:String,
        default:""
    },
    conversation:{
        type:Schema.Types.ObjectId,
        ref:"Conversation"
    }
})

const Group=mongoose.model("Group",groupSchema)
export default Group