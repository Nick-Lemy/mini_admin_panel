import { DataTypes } from "sequelize";
import sequelize from "../utils/db";
import { CreateUserDTO, UpdateUserStatusDTO, UserDTO } from "./user.dto";

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
export default User;

export function createUserModel(data: CreateUserDTO) {
  return User.create({ ...data });
}

export function getUsersModel(
  role?: "admin" | "user",
  status?: "active" | "inactive"
) {
  return User.findAll({
    where: {
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
    },
  });
}

export function getUniqueUserByEmailModel(email: string) {
  return User.findOne({ where: { email } });
}

export function getUniqueUserByIdModel(id: number) {
  return User.findByPk(id);
}

export function updateUserStatusModel(data: UpdateUserStatusDTO) {
  const { status, id } = data;
  return User.update({ status }, { where: { id } });
}
