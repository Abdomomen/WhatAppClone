import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
} from "../utilies/jwt.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashToken = (token) => {
  return crypto.createHash("md5").update(token).digest("hex");
};

export const authServices = {
  login: async (data) => {
    let { email, password } = data;

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    let accessToken = generateAccessToken({ id: user._id });
    let refreshToken = generateRefreshToken({ id: user._id });
    user.refreshToken = hashToken(refreshToken);
    await user.save();
    let sentUser = {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      id: user._id,
      contacts: user.contacts,
      avatar: user.avatar,
    };
    return { success: true, user: sentUser, accessToken, refreshToken };
  },
  register: async (data) => {
    let { name, username, password, email, bio } = data;

    let user = await User.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }
    user = await User.findOne({ username });
    if (user) {
      throw new Error("Username already exists");
    }
    user = await User.create({
      name,
      username,
      password: await bcrypt.hash(password, 10),
      email,
      bio,
    });
    let accessToken = generateAccessToken({ id: user._id });
    let refreshToken = generateRefreshToken({ id: user._id });
    user.refreshToken = hashToken(refreshToken);
    await user.save();
    let sentUser = {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      id: user._id,
      contacts: user.contacts,
      avatar: user.avatar,
    };
    return { success: true, user: sentUser, accessToken, refreshToken };
  },
  refershToken: async (data) => {
    let { refreshToken } = data;
    if (!refreshToken) {
      throw new Error("Token not found");
    }
    let decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error("Invalid token");
    }
    let user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.refreshToken !== hashToken(refreshToken)) {
      throw new Error("Invalid token");
    }
    let accessToken = generateAccessToken({ id: user._id });
    let newRefreshToken = generateRefreshToken({ id: user._id });
    user.refreshToken = hashToken(newRefreshToken);
    await user.save();
    let sentUser = {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      id: user._id,
      contacts: user.contacts,
      avatar: user.avatar,
    };
    return {
      success: true,
      user: sentUser,
      accessToken,
      refreshToken: newRefreshToken,
    };
  },
  logout: async (data) => {
    let user = verifyRefreshToken(data.refreshToken);
    if (!user) {
      throw new Error("Invalid token");
    }
    await User.findByIdAndUpdate(user.id, { refreshToken: null });
    return { success: true, message: "Logout successfully" };
  },
};
