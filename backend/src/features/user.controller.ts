import { Request, Response } from "express";
import { createUserModel, getUsersModel } from "./user.model";
import { CreateUserDTO, UserDTO, UserFilterDTO } from "./user.dto";

export async function getUsersController(req: Request, res: Response) {
  let { role, status } = req.query as UserFilterDTO;
  try {
    const users = await getUsersModel({
      role,
      status,
    });
    res.status(200).send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
}

export async function createUserController(req: Request, res: Response) {
  const userData: CreateUserDTO = req.body;
  console.log(userData);
  try {
    if (!userData.email || !userData.role) {
      return res.status(400).send("Missing required fields: email and role");
    }
    if (userData.role !== "admin" && userData.role !== "user") {
      return res.status(400).send("Invalid role value");
    }
    if (
      userData.status &&
      userData.status !== "active" &&
      userData.status !== "inactive"
    ) {
      return res.status(400).send("Invalid status value");
    }
    const newUser = await createUserModel(userData);
    res.status(201).send(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Internal Server Error");
  }
}
