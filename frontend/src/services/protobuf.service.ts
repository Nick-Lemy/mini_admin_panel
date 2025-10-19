import protobuf from "protobufjs";
import { User } from "@/types/user";

export class ProtobufService {
  private static root: protobuf.Root | null = null;

  static async loadProto(): Promise<protobuf.Root> {
    if (this.root) return this.root;

    const protoContent = `
syntax = "proto3";

package user;

message User {
  int32 id = 1;
  string email = 2;
  string role = 3;
  string status = 4;
  string createdAt = 5;
  string emailHash = 6;
  string signature = 7;
}

message UserList {
  repeated User users = 1;
}
    `;

    this.root = protobuf.parse(protoContent).root;
    return this.root;
  }

  static async decodeUsers(buffer: ArrayBuffer): Promise<User[]> {
    try {
      const root = await this.loadProto();
      const UserList = root.lookupType("UserList");

      const message = UserList.decode(new Uint8Array(buffer));
      const object = UserList.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
      });

      return (object.users || []) as User[];
    } catch (error) {
      console.error("Error decoding protobuf:", error);
      throw error;
    }
  }
}
