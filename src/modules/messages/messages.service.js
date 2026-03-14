import { BadRequestException } from "../../common/index.js";
import {
  findAll,
  findById,
  insertOne,
  findOne,
  findOneAndDelete,
} from "../../database/index.js";
import { userModel, messageModel } from "../../database/index.js";
import { env } from "../../../config/index.js";

export const sendMessage = async (messageData, userId, file) => {
  let existUser = await findById({ model: userModel, id: userId });
  if (!existUser) {
    throw BadRequestException("invalid user id");
  }
  let { message } = messageData;
  let image = "";
  if (file) {
    image = `${env.BASE_URL}/Uploads/${file.filename}`;
  }
  let addedMessage = await insertOne({
    model: messageModel,
    data: {
      message,
      image,
      recieverId: userId,
    },
  });

  if (addedMessage) {
    return addedMessage;
  } else {
    throw BadRequestException("message not sent");
  }
};

export const getMessages = async (userId) => {
  let messages = await findAll({
    model: messageModel,
    filter: { recieverId: userId },
  });
  if (!messages.length) {
    throw BadRequestException("no messages found");
  }
  return messages;
};

export const getMessageById = async (messageId, userId) => {
  let message = await findOne({
    model: messageModel,
    filter: { _id: messageId, recieverId: userId },
  });
  if (!message) {
    throw BadRequestException("no message found");
  }

  return message;
};
export const deleteMessageById = async (messageId, userId) => {
  let deletedMessage = await findOneAndDelete({
    model: messageModel,
    filter: {
      _id: messageId,
      recieverId: userId,
    },
  });
  if (!deletedMessage) {
    throw BadRequestException("no message found");
  }

  return deletedMessage;
};
