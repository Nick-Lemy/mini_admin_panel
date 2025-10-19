export interface User {
  id: number;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
  emailHash?: string;
  signature?: string;
}

export interface CreateUserDto {
  email: string;
  role: string;
  status: "active" | "inactive";
}

export interface UpdateUserDto {
  email?: string;
  role?: string;
  status?: "active" | "inactive";
}
