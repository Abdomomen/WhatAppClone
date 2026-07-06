import * as z from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
});

export const avatarSchema = z.object({
  file: z.object({
    mimetype: z
      .string()
      .refine((type) => ["image/jpeg", "image/png"].includes(type)),
    size: z.number().max(5 * 1024 * 1024), // 5MB
  }),
});
export const addContactsSchema = z.object({
  id: z.string({ required_error: "ID is required" }).min(1, "ID is required"),
});

export const deleteContactSchema = z.object({
  id: z.string({ required_error: "ID is required" }).min(1, "ID is required"),
});

export default updateProfileSchema;