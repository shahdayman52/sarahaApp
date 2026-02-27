import { userModel, profileViewModel } from "../../database/index.js";
import {
  findById,
} from "../../database/index.js";
import mongoose from "mongoose";
import { BadRequestException } from "../../common/index.js";

export const visitProfile = async (viewerId, profileOwnerId) => {
  //1- retrieve the searched user
  const user = await findById({ model: userModel, id: profileOwnerId });
  if (!user) {
    throw BadRequestException("user not found");
  } //count the view
  await profileViewModel.findOneAndUpdate(
    {
      viewerId: new mongoose.Types.ObjectId(viewerId),
      profileOwnerId: new mongoose.Types.ObjectId(profileOwnerId),
    },
    {},
    { upsert: true, new: true },
  );
  return user;
};

export const getProfileViews = async (profileOwnerId) => {
  const views = await profileViewModel.findAll({
    profileOwnerId: new mongoose.Types.ObjectId(profileOwnerId),
  })
    .populate("viewerId", "firstName lastName")
    .sort({ createdAt: -1 });

  return views
    .filter((view) => view.viewerId)
    .map((view) => ({
      userName: view.viewerId.userName,
      viewedAt: view.createdAt,
    }));
};
