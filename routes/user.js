import { Router } from "express";
import updateProfileSchema, {
  avatarSchema,
  addContactsSchema,
  deleteContactSchema,
} from "../validation/user.js";
import validate from "../middlewares/validation.js";
import verifyJwt from "../middlewares/verifyjwt.js";
import {
  updateProfile,
  updateAvatar,
  getContacts,
  addContacts,
  deleteContact,
} from "../controllers/user.js";
import upload from "../middlewares/upload.js";

const userRouter = Router();

userRouter.put(
  "/update-profile",
  verifyJwt,
  validate(updateProfileSchema),
  updateProfile,
);
userRouter.put(
  "/update-avatar",
  verifyJwt,
  upload.single("avatar"),
  validate(avatarSchema),
  updateAvatar,
);

userRouter.get("/contacts", verifyJwt, getContacts);
userRouter.post(
  "/contacts",
  verifyJwt,
  validate(addContactsSchema),
  addContacts,
);
userRouter.delete(
  "/contacts",
  verifyJwt,
  validate(deleteContactSchema),
  deleteContact,
);

export default userRouter;
