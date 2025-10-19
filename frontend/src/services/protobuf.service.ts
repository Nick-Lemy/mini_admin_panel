import protobuf from "protobufjs";

export interface User {
  id: number;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  emailHash: string;
  signature: string;
}

let UserListMessage: protobuf.Type;
let isInitialized = false;

/**
 * Load protobuf schema
 */
export async function loadProtoSchema(): Promise<void> {
  if (isInitialized) return;

  try {
    const root = await protobuf.load("/protos/user.proto");
    UserListMessage = root.lookupType("user.UserList");
    isInitialized = true;
    console.log("Protobuf schema loaded successfully");
  } catch (error) {
    console.error("Error loading protobuf schema:", error);
    throw error;
  }
}

/**
 * Deserialize protobuf data to user objects
 */
export async function deserializeUsers(buffer: ArrayBuffer): Promise<User[]> {
  if (!isInitialized) {
    await loadProtoSchema();
  }

  try {
    const uint8Array = new Uint8Array(buffer);
    const message = UserListMessage.decode(uint8Array);
    const object = UserListMessage.toObject(message, {
      longs: String,
      enums: String,
      bytes: String,
    }) as { users?: User[] };
    return object.users || [];
  } catch (error) {
    console.error("Error deserializing users:", error);
    throw error;
  }
}

/**
 * Fetch and deserialize users from the backend
 */
export async function fetchUsersProtobuf(
  apiUrl: string = "http://localhost:3000/api/v1/users/export"
): Promise<User[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    return await deserializeUsers(buffer);
  } catch (error) {
    console.error("Error fetching users protobuf:", error);
    throw error;
  }
}
