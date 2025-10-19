import protobuf from "protobufjs";
import path from "path";

const PROTO_PATH = path.join(__dirname, "../protos/user.proto");

let UserMessage: protobuf.Type;
let UserListMessage: protobuf.Type;

// Load protobuf schema
async function loadProto() {
  try {
    const root = await protobuf.load(PROTO_PATH);
    UserMessage = root.lookupType("user.User");
    UserListMessage = root.lookupType("user.UserList");
    console.log("Protobuf schema loaded successfully");
  } catch (error) {
    console.error("Error loading protobuf schema:", error);
    throw error;
  }
}

// Initialize on module load
loadProto();

/**
 * Serialize users to protobuf format
 */
export function serializeUsers(users: any[]): Buffer {
  const userList = users.map((user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status || "active",
    createdAt: user.createdAt
      ? user.createdAt.toISOString()
      : new Date().toISOString(),
    emailHash: user.emailHash || "",
    signature: user.signature || "",
  }));

  const payload = { users: userList };
  const errMsg = UserListMessage.verify(payload);
  if (errMsg) {
    throw Error(errMsg);
  }

  const message = UserListMessage.create(payload);
  const buffer = UserListMessage.encode(message).finish();
  return Buffer.from(buffer);
}

/**
 * Deserialize protobuf data to user objects
 */
export function deserializeUsers(buffer: Buffer): any[] {
  const message = UserListMessage.decode(buffer);
  const object = UserListMessage.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  });
  return (object as any).users || [];
}
