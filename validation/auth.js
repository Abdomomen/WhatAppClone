import * as z from "zod";

export const loginSchema = z.object({
    email:z.email(),
    password:z.string().min(6).max(25)
});

export const registerSchema = z.object({
  name: z.string().min(3).max(25),
  password: z.string().min(6).max(25),
  email: z.email(),
  username: z.string().min(3).max(25),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
});

