import { Router } from "express";
import verifyJwt from "../middlewares/verifyjwt.js"
import {editGroupSchema,addMemberSchema,removeMemberSchema,avatarSchema,createGroupSchema} from "../validation/group.js"
import validate from "../middlewares/validation.js"
import upload from "../middlewares/upload.js"
import {generalLimiter} from "../middlewares/rateLimiter.js"
import {
  getGroups,
  createGroup,
  addMember,
  removeMember,
  editGroup,
  editAvatar,
  deleteAvatar,
  deleteGroup,
  getGroup,
} from "../controllers/group.js";
const groupRouter = Router();


groupRouter.get("/",generalLimiter,verifyJwt,getGroups)
groupRouter.get("/:groupId",generalLimiter,verifyJwt,getGroup)
groupRouter.post("/",generalLimiter,verifyJwt,validate(createGroupSchema),createGroup)
groupRouter.post("/:groupId/add-member",generalLimiter,verifyJwt,validate(addMemberSchema),addMember)
groupRouter.post("/:groupId/remove-member",generalLimiter,verifyJwt,validate(removeMemberSchema),removeMember)
groupRouter.put("/:groupId/edit",generalLimiter,verifyJwt,validate(editGroupSchema),editGroup)
groupRouter.put("/:groupId/edit-avatar",generalLimiter,verifyJwt,upload.single("avatar"),validate(avatarSchema),editAvatar)
groupRouter.delete("/:groupId/delete-avatar",generalLimiter,verifyJwt,deleteAvatar)
groupRouter.delete("/:groupId/delete",generalLimiter,verifyJwt,deleteGroup)

export default groupRouter
