import asyncWrapper from "../middlewares/asyncWrapper.js";
import userServices from "../services/user.js";
import { addContactsSchema,deleteContactSchema } from "../validation/user.js";
const updateProfile = asyncWrapper(async (req, res) => {
  let { name, email, bio } = req.body;
  let result = await userServices.updateProfile({
    userId: req.user.id,
    name,
    email,
    bio,
  });
  res.status(200).json({
    success: true,
    user: result.user,
  });
});

const updateAvatar = asyncWrapper(async (req, res) => {
  let userId = req.user.id;
  let result = await userServices.updateAvatar(userId, req.file);
  res.status(200).json({
    success: true,
    user: result.user,
  });
});


const getContacts = asyncWrapper(async (req, res) => {
  let userId = req.user.id;
  let result = await userServices.getContacts(userId);
  res.status(200).json({
    success: true,
    data: result.data,
  });
});

const addContacts = asyncWrapper(async (req, res) => {
  let userId = req.user.id;
  let {id} = req.params;
  let resultParse=addContactsSchema.safeParse({id})
  if(!resultParse.success){
    throw new Error(resultParse.error.message);
  }
  let result = await userServices.addContacts(userId, resultParse.data.id);
  res.status(200).json({
    success: true,
  });
});

const deleteContact = asyncWrapper(async (req, res) => {
  let userId = req.user.id;
  let { id } = req.params;
  let resultParse=deleteContactSchema.safeParse({id})
  if(!resultParse.success){
    throw new Error(resultParse.error.message);
  }
  let result = await userServices.deleteContact(userId, resultParse.data.id);
  res.status(200).json({
    success: true,
  });
});

export { updateProfile, updateAvatar, getContacts, addContacts, deleteContact };
