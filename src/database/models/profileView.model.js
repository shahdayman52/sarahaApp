import mongoose from "mongoose";

const profileViewSchema = new mongoose.Schema(
  {
    viewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const profileViewModel = mongoose.model("ProfileView", profileViewSchema);
