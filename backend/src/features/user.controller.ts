import { Request, Response } from "express";
import { getUsersModel } from "./user.model";
import { UserDTO } from "./user.dto";

export async function getUsersController(req: Request, res: Response) {
  try {
    const users = await getUsersModel();
    res.status(200).send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
}
