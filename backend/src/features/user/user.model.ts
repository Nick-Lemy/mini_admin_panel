import { DataTypes } from "sequelize";
import sequelize from "../../configs/db";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserDTO,
  UserFilterDTO,
} from "../user/user.dto";
import { hashAndSignEmail } from "../../services/crypto.service";

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
    emailHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
export default User;

export async function createUserModel(data: CreateUserDTO) {
  try {
    const existingUser = await getUniqueUserByEmailModel(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash and sign the email
    const { emailHash, signature } = hashAndSignEmail(data.email);

    return User.create({
      ...data,
      emailHash,
      signature,
    });
  } catch (error) {
    console.error("Error checking existing user:", error);
    throw Error("Failed to create user");
  }
}

export async function getUsersModel({ role, status }: UserFilterDTO) {
  console.log(role, status);

  try {
    const users = await User.findAll({
      where: {
        ...(role ? { role } : {}),
        ...(status ? { status } : {}),
      },
    });
    console.log(users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw Error("Failed to fetch users");
  }
}

export async function getUniqueUserByEmailModel(email: string) {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw Error("Failed to fetch user by email");
  }
}

export async function getUniqueUserByIdModel(id: number | string) {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw Error("Failed to fetch user by ID");
  }
}

export async function updateUserStatusModel(
  id: number | string,
  data: UpdateUserDTO
) {
  try {
    const user = await getUniqueUserByIdModel(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updateUser = User.update({ ...data }, { where: { id } });
    return updateUser;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw Error("Failed to update user status");
  }
}

export async function deleteUserModel(id: number | string) {
  try {
    const user = await getUniqueUserByIdModel(id);
    if (!user) {
      throw new Error("User not found");
    }
    const deleteuser = await User.destroy({ where: { id } });
    return deleteuser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw Error("Failed to delete user");
  }
}
