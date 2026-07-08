import * as z from "zod"

const editGroupSchema=z.object({
    name:z.string().min(1,"name is required"),
    bio:z.string().optional().min(1,"bio is required"),
    avatar:z.string().optional().min(1,"avatar is required"),
})

const addMemberSchema=z.object({
    memberId:z.string().min(1,"memberId is required"),
})

const removeMemberSchema=z.object({
    memberId:z.string().min(1,"memberId is required"),
})

export {editGroupSchema,addMemberSchema,removeMemberSchema}

