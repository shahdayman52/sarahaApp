import mongoose from "mongoose";
import {
  GenderEnums,
  ProviderEnums,
  UserRoleEnums,
} from "../../common/index.js";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    DBO: Date,
    gender: {
      type: String,
      enum: Object.values(GenderEnums),
      default: GenderEnums.Male,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnums),
      default: ProviderEnums.System,
    },
    role: {
      type: String,
      enum: Object.values(UserRoleEnums),
      default: UserRoleEnums.User,
    },
    shareProfileName: {
      type: String,
      required: true,
      unique: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },

    banUntil: {
      type: Date,
      default: null,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    otpCode: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

userSchema
  .virtual("userName")
  .set(function (value) {
    let [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

export const userModel = mongoose.model("User", userSchema);
