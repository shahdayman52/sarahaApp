import { Router } from "express";
import {
  sendMessage,
  getMessages,
  getMessageById,
  deleteMessageById,
} from "./messages.service.js";
import { BadRequestException, successResponse } from "../../common/index.js";
import { validation } from "../../common/utils/validation/validation.js";
import { createMessageSchema } from "./messages.validation.js";
import { auth } from "../../common/middleware/auth.js";

const router = Router();

router.post(
  "/send-message/:id",
  validation(createMessageSchema),
  async (req, res) => {
    let data = await sendMessage(req.body, req.params.id);
    successResponse({
      res,
      message: "message sent successfully",
      status: 201,
      data,
    });
  },
);

router.get("/get-messages", auth,async (req, res) => {
  let messages = await getMessages(req.userId);
  successResponse({
    res,
    message: "messages fetched successfully",
    status: 200,
    data: messages,
  });
});

router.get("/get-messages/:id", auth,async (req, res) => {
  let messages = await getMessageById(req.params.id, req.userId);
  successResponse({
    res,
    message: "messages fetched successfully",
    status: 200,
    data: messages,
  });
});
router.delete("/delete-message/:id", auth,async (req, res) => {
  let data = await deleteMessageById(req.params.id, req.userId);
  successResponse({
    res,
    message: "message deleted successfully",
    status: 200,
    data,
  });
})
export default router;
