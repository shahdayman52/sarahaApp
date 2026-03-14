import { findOne, userModel, findOneAndUpdate, findOneAndDelete } from "../../database/index.js";
import { BadRequestException } from "../../common/index.js";
import { env } from "../../../config/index.js";
export const getUserProfile = async (_id) => {
  let userData = await findOne({
    model: userModel,
    filter: { _id: _id },
    select: "firstName lastName email shareProfileName",
  });
  if (userData) {
    return userData;
  } else {
    throw BadRequestException({ message: "user not found" });
  }
};
export const shareProfileLink = async (_id) => {
  let userData = await findOne({
    model: userModel,
    filter: { _id: _id },
    select: "firstName lastName email shareProfileName",
  });
  if (!userData) {
    throw BadRequestException({ message: "user not found" });
  } else {
    let url = `${env.BASE_URL}/${userData.shareProfileName}`;
    return url;
  }
};

export const getProfileByLink = async (data) => {
  let { shareProfileName } = data;
  let userLink = shareProfileName.split("/");
  let userData = await findOne({
    model: userModel,
    filter: { shareProfileName: userLink },
    select: "firstName lastName email shareProfileName",
  });
  if (userData) {
    return userData;
  } else {
    throw BadRequestException({ message: "user not found" });
  }
};

export const updateUserProfile = async (_id, data,file) => {
  let {firstName,lastName,gender,phone}= data
  let updatedData = {}
  firstName?updatedData.firstName=firstName:null
  lastName ? (updatedData.lastName = lastName) : null;
  gender ? (updatedData.gender = gender) : null;
  phone?updatedData.phone=phone:null

  let image =''
  if(file){
    image = `${env.BASE_URL}/uploads/${file.filename}}`
  }
  updatedData.image = image
  let existUser = await findOneAndUpdate({
    model: userModel,
    filter: { _id: _id },
    update: updatedData ,
    options: { new: true },
  });
  if(existUser){
    return existUser
  }else{
    throw BadRequestException({message:"user not found"})
  }

}
export const deleteProfile = async (_id) => {
  let user = await findOneAndDelete({model: userModel, filter: { _id: _id }});
  if (!user) {
    throw BadRequestException({message:"user not found"});
  }
  return user;
};

