import groupServices from "../services/group.js";
import asyncWrapper from "../middlewares/asyncWrapper.js"

// get
const getGroups=asyncWrapper(async(req,res)=>{
    const groups=await groupServices.getGroups(req.user.id)
    res.status(200).json({success:true , groups})
})

// create
const createGroup=asyncWrapper(async(req,res)=>{
    const group=await groupServices.createGroup(req.user.id,req.body.name)
    res.status(200).json({success:true , group})
})

// add member
const addMember=asyncWrapper(async(req,res)=>{
    const group=await groupServices.addMember(req.user.id,req.params.groupId,req.body.memberId)
    res.status(200).json({success:true,group})
})

// remove member
const removeMember=asyncWrapper(async(req,res)=>{
    const group=await groupServices.removeMember(req.user.id,req.params.groupId,req.body.memberId)
    res.status(200).json({success:true,group})
})

// edit group
const editGroup=asyncWrapper(async(req,res)=>{
    const group=await groupServices.editGroup(req.body.bio,req.body.name,req.params.groupId,req.user.id)
    res.status(200).json({success:true,group})
})

// edit avatar
const editAvatar=asyncWrapper(async(req,res)=>{
    const group=await groupServices.editAvatar(req.user.id,req.file,req.params.groupId)
    res.status(200).json({ success: true, group });
})

// delete avatar
const deleteAvatar=asyncWrapper(async(req,res)=>{
    const group=await groupServices.deleteAvatar(req.user.id,req.params.groupId)
    res.status(200).json({ success: true, group });
})

// delete group
const deleteGroup=asyncWrapper(async(req,res)=>{
    const group=await groupServices.deleteGroup(req.user.id,req.params.groupId)
    res.status(200).json({ success: true, group });
})

// get group
const getGroup=asyncWrapper(async(req,res)=>{
    const group=await groupServices.getGroup(req.params.groupId)
    res.status(200).json({ success: true, group });
})

export {
    getGroups,
    createGroup,
    addMember,
    removeMember,
    editGroup,
    editAvatar,
    deleteAvatar,
    deleteGroup,
    getGroup
}