import mongoose,{ Schema } from "mongoose";

const userSchema= new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true
    }
    ,
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        lowercase:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    contacts:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    bio:{
        type:String,
        trim:true
    },
    avatar:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    
    
},{timestamps:true})

