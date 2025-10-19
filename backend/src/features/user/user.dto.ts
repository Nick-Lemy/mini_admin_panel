export interface CreateUserDTO {
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
}

export interface UserDTO extends CreateUserDTO {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserFilterDTO {
  role?: "admin" | "user";
  status?: "active" | "inactive";
}

export interface UpdateUserDTO {
  status?: "active" | "inactive";
  role?: "admin" | "user";
}
