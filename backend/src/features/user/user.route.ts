import { Router } from "express";

import {
  createUserController,
  getUniqueUserByIdController,
  getUsersController,
  updateUserController,
} from "./user.controller";
const userRouter = Router();

userRouter.get("/", getUsersController);
userRouter.post("/", createUserController);
userRouter.get("/:id", getUniqueUserByIdController);
userRouter.put("/:id", updateUserController);
userRouter.delete("/:id");

export default userRouter;
