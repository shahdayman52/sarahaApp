import express from "express";
import { env } from "../config/index.js";
import { globalErrorHandler } from "./common/index.js";
import { databaseConnection } from "./database/index.js";
import authRouter from "./modules/auth/auth.controller.js";

export const bootstrap = async () => {
  const app = express();
  app.use(express.json());
  await databaseConnection();

  app.use("/auth", authRouter);
  app.use("{*dummy}", (req, res) => res.status(404).json("invalid route"));

  app.use(globalErrorHandler);

  app.listen(env.port, () => {
    console.log("server is running on port 3000");
  });
};
