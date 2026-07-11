import User from "../models/user.js";
import { uploadImage, deleteImage } from "../cloudinary.js";

let formatUser = (user) => {
  return {
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    id: user._id,
    contacts: user.contacts,
    avatar: user.avatar.url,
  };
};
const userServices = {
  updateProfile: async ({ userId, name, email, bio }) => {
    let user = await User.findByIdAndUpdate(
      userId,
      { name, email, bio },
      { new: true },
    );
    if (!user) {
      throw new Error("User not found");
    }
    let sentUser = formatUser(user);
    return { success: true, user: sentUser };
  },
  updateAvatar: async (userId, file) => {
    let user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    let oldUrl = user.avatar;

    let newImg = await uploadImage(file);
    if (
      oldUrl.url === "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    ) {
      user.avatar = newImg;
    } else {
      await deleteImage(oldUrl.publicId);
      user.avatar = newImg;
    }
    await user.save();

    let sentUser = formatUser(user);
    return { success: true, user: sentUser };
  },
  getContacts: async (userId) => {
    let user = await User.findById(userId).populate(
      "contacts",
      "username avatar",
    );
    if (!user) {
      throw new Error("User not found");
    }
    return { success: true, data: user.contacts };
  },
  addContacts: async (userId, id) => {
    let contact = await User.findById(id);
    if (!contact) {
      throw new Error("Contact not found");
    }
    if (userId.toString() === contact._id.toString()) {
      throw new Error("You cannot add yourself");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { contacts: contact._id } },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return { success: true };
  },
  deleteContact: async (userId, id) => {
    let contact = await User.findById(id);
    if (!contact) {
      throw new Error("Contact not found");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { contacts: contact._id } },
      { new: true },
    );
    if (!updatedUser) {
      throw new Error("User not found");
    }

    return { success: true };
  },
};

export default userServices;
