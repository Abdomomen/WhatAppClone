import * as z from "zod"

const editGroupSchema=z.object({
    name:z.string().min(1,"name is required"),
    bio:z.string().optional().min(1,"bio is required"),
    avatar:z.string().optional().min(1,"avatar is required"),
})

const addMemberSchema=z.object({
    memberId:z.string().min(1,"memberId is required"),
})
const avatarSchema = z.object({
  file: z.object({
    mimetype: z
      .string()
      .refine((type) => ["image/jpeg", "image/png"].includes(type)),
    size: z.number().max(5 * 1024 * 1024), // 5MB
  }),
});
const removeMemberSchema=z.object({
    memberId:z.string().min(1,"memberId is required"),
})
export const createGroupSchema = z.object({
   name: z.string().trim().min(1, "Group name is required"),
});

export {editGroupSchema,addMemberSchema,removeMemberSchema,avatarSchema}

