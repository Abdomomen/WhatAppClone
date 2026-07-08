import Group from "../models/group.js";
import Conversation from "../models/conversation.js";
import Message from "../models/msg.js";
import User from "../models/user.js";
import { uploadImage, deleteImage } from "../cloudinary.js";

const groupServices = {
  createGroup: async (userId, name) => {
    let group = new Group({
      name,
      admin: userId,
      members: [userId],
    });
    let groupConversation = new Conversation({
      type: "group",
      group: group._id,
    });
    group.conversation = groupConversation._id;
    await group.save();
    await groupConversation.save();
    return group;
  },
  addMember: async (userId, groupId, memberId) => {
    let group = await Group.findById(groupId);
    if (!group) throw new Error("group not found 🤷‍♀️");
    if (group.admin.toString() !== userId)
      throw new Error("you are not admin of this group 🤷‍♀️");

    let memberExists = await User.findById(memberId);
    if (!memberExists)
      throw new Error("member to add not found in database 🤷‍♀️");

    let members = group.members.map((id) => id.toString());
    if (members.includes(memberId.toString()))
      throw new Error("member already exists in group 🤷‍♀️");
    group.members.push(memberId);
    await group.save();
    return group;
  },
  removeMember: async (userId, groupId, memberId) => {
    let group = await Group.findById(groupId);
    if (!group) throw new Error("group not found 🤷‍♀️");
    if (group.admin.toString() !== userId)
      throw new Error("you are not admin of this group 🤷‍♀️");
    if (group.admin.toString() === memberId.toString())
      throw new Error("you can not remove yourself from group 🤷‍♀️");
    let members = group.members.map((id) => id.toString());
    if (!members.includes(memberId.toString()))
      throw new Error("member not found in group 🤷‍♀️");
    group.members = group.members.filter(
      (id) => id.toString() !== memberId.toString(),
    );
    await group.save();
    return group;
  },
  editGroup: async (bio, name, groupId, userId) => {
    let group = await Group.findById(groupId);
    if (!group) throw new Error("group not found 🤷‍♀️");
    if (group.admin.toString() !== userId)
      throw new Error("you are not admin of this group 🤷‍♀️");
    if (bio) group.bio = bio;
    if (name) group.name = name;
    await group.save();
    return group;
  },
  editAvatar: async (userId, file, groupId) => {
    let group = await Group.findById(groupId);
    if (!group) throw new Error("group not found 🤷‍♀️");
    if (group.admin.toString() !== userId)
      throw new Error("you are not admin of this group 🤷‍♀️");
    if (
      group.avatar.url ===
      "https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/1200/external-group-chat-social-media-ui-tanah-basah-glyph-tanah-basah.jpg"
    ) {
      let result = await uploadImage(file);
      group.avatar = { url: result.url, publicId: result.public_id };
      await group.save();
      return group;
    }
    if (group.avatar.publicId) {
      await deleteImage(group.avatar.publicId);
    }
    let result = await uploadImage(file);
    group.avatar = { url: result.url, publicId: result.public_id };
    await group.save();
    return group;
  },
  leaveGroup: async (userId, groupId) => {
    let group = await Group.findById(groupId);
    if (!group) throw new Error("group not found 🤷‍♀️");
    if (group.admin.toString() === userId.toString())
      throw new Error("you can not leave this group 🤷‍♀️"); // we will handle this later (deleteGroup)
    let members = group.members.map((id) => id.toString());
    if (!members.includes(userId.toString()))
      throw new Error("you are not member of this group 🤷‍♀️");
    group.members = group.members.filter(
      (id) => id.toString() !== userId.toString(),
    );
    await group.save();
    return group;
  },
  deleteGroup: async (userId, groupId) => {
    let group = await Group.findById(groupId);
    if (!group) throw new Error("group not found 🤷‍♀️");
    if (group.admin.toString() !== userId.toString())
      throw new Error("you are not admin of this group 🤷‍♀️");

    if (group.avatar && group.avatar.publicId) {
      try {
        await deleteImage(group.avatar.publicId);
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete group avatar from Cloudinary:",
          cloudinaryError.message,
        );
      }
    }

    await Promise.all([
      Group.findByIdAndDelete(groupId),
      Conversation.findByIdAndDelete(group.conversation),
      Message.deleteMany({ conversation: group.conversation }),
    ]);
    return group;
  },
};

export default groupServices;
