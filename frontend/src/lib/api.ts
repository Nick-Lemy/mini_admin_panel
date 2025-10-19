import { User, CreateUserDto, UpdateUserDto } from "@/types/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3043/api/v1";

export const api = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  async getUserById(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },

  async createUser(data: CreateUserDto): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  },

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
  },

  async exportUsers(): Promise<ArrayBuffer> {
    const response = await fetch(`${API_BASE_URL}/users/export`);
    if (!response.ok) throw new Error("Failed to export users");
    return response.arrayBuffer();
  },

  async getPublicKey(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/users/public-key`);
    if (!response.ok) throw new Error("Failed to fetch public key");
    const data = await response.json();
    return data.publicKey;
  },
};
