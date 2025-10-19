import { Request, Response } from "express";
import {
  createUserModel,
  deleteUserModel,
  getUniqueUserByEmailModel,
  getUniqueUserByIdModel,
  getUsersModel,
  updateUserStatusModel,
} from "../user/user.model";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserDTO,
  UserFilterDTO,
} from "../user/user.dto";
import { serializeUsers } from "../../services/protobuf.service";
import { getPublicKey } from "../../services/crypto.service";

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
    res.status(500).send({ error: "Internal Server Error" });
  }
}

export async function getUniqueUserByEmailController(
  req: Request,
  res: Response
) {
  const { email } = req.body;
  try {
    const user = await getUniqueUserByEmailModel(email);
    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).send({ error: "Error fetching user by email" });
  }
}

export async function getUniqueUserByIdController(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await getUniqueUserByIdModel(id);
    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user by Id: ", error);
    res.status(500).send({ error: "Error fetching user by Id" });
  }
}

export async function updateUserController(req: Request, res: Response) {
  const { id } = req.params;
  const userData: UpdateUserDTO = req.body;
  try {
    await updateUserStatusModel(id, { ...userData });
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ error: "Error updating user" });
  }
}

export async function deleteUserController(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await deleteUserModel(id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ error: "Error deleting user" });
  }
}

export async function exportUsersProtobufController(
  req: Request,
  res: Response
) {
  try {
    const users = await getUsersModel({});
    const protobufData = serializeUsers(users);

    res.setHeader("Content-Type", "application/x-protobuf");
    res.setHeader("Content-Disposition", "attachment; filename=users.pb");
    res.send(protobufData);
  } catch (error) {
    console.error("Error exporting users as protobuf:", error);
    res.status(500).send({ error: "Error exporting users" });
  }
}

export async function getPublicKeyController(req: Request, res: Response) {
  try {
    const publicKey = getPublicKey();
    res.status(200).json({ publicKey });
  } catch (error) {
    console.error("Error getting public key:", error);
    res.status(500).send({ error: "Error getting public key" });
  }
}
