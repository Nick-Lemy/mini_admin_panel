import { Router } from "express";

import {
  createUserController,
  getUniqueUserByIdController,
  getUsersController,
  updateUserController,
  exportUsersProtobufController,
  getPublicKeyController,
  migrateUsersController,
} from "./user.controller";
const userRouter = Router();

userRouter.get("/", getUsersController);
userRouter.post("/", createUserController);
userRouter.post("/migrate", migrateUsersController);  // Migration endpoint
userRouter.get("/export", exportUsersProtobufController);
userRouter.options("/export", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});
userRouter.get("/public-key", getPublicKeyController);
userRouter.options("/public-key", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});
userRouter.get("/:id", getUniqueUserByIdController);
userRouter.put("/:id", updateUserController);
userRouter.delete("/:id");

export default userRouter;
