import express from "express";
import cors from "cors";
import { env } from "../config/index.js";
import { globalErrorHandler } from "./common/index.js";
import { databaseConnection } from "./database/index.js";
import authRouter from "./modules/auth/auth.controller.js";
import messageRouter from "./modules/messages/messages.controller.js";
import profileViews from "./modules/profileViews/profileViews.controller.js";
import userRouter from "./modules/user/user.controller.js";
import { client, connectRedis } from "./database/redis.js";

export const bootstrap = async () => {
  const app = express();
  await connectRedis();
 
  app.use(express.json());
  await databaseConnection();
  app.use(cors());
  app.use("/auth", authRouter);
  app.use("/messages", messageRouter);
  app.use("/profile-views", profileViews);
  app.use("/user", userRouter);

  app.use("{*dummy}", (req, res) => res.status(404).json("invalid route"));

  app.use(globalErrorHandler);

  app.listen(env.port, () => {
    console.log("server is running on port 3000");
  });
};
