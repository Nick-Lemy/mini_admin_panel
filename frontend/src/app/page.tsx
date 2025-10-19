"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User, CreateUserDto, UpdateUserDto } from "@/types/user";
import { CryptoService } from "@/services/crypto.service";
import { ProtobufService } from "@/services/protobuf.service";
import { UserTable } from "@/components/UserTable";
import { UserModal } from "@/components/UserModal";
import { UserGraph } from "@/components/UserGraph";

export default function Home() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [verifiedUsers, setVerifiedUsers] = useState<Set<number>>(new Set());
  const [publicKey, setPublicKey] = useState<string>("");

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: api.getUsers,
  });

  const { data: protobufUsers = [] } = useQuery({
    queryKey: ["protobuf-users"],
    queryFn: async () => {
      const buffer = await api.exportUsers();
      return ProtobufService.decodeUsers(buffer);
    },
  });

  const { data: publicKeyData } = useQuery({
    queryKey: ["public-key"],
    queryFn: api.getPublicKey,
  });

  useEffect(() => {
    if (publicKeyData) {
      setPublicKey(publicKeyData);
    }
  }, [publicKeyData]);

  useEffect(() => {
    if (!publicKey || protobufUsers.length === 0) return;

    const verify = async () => {
      const verified = new Set<number>();

      for (const user of protobufUsers) {
        if (user.emailHash && user.signature) {
          const isValid = await CryptoService.verifyUserSignature(
            user.email,
            user.emailHash,
            user.signature,
            publicKey
          );
          if (isValid) {
            verified.add(user.id);
          }
        }
      }

      setVerifiedUsers(verified);
    };

    verify();
  }, [publicKey, protobufUsers]);

  const createMutation = useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["protobuf-users"] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      api.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["protobuf-users"] });
      setIsModalOpen(false);
      setEditingUser(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["protobuf-users"] });
    },
  });

  const handleSubmit = (data: CreateUserDto | UpdateUserDto) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      createMutation.mutate(data as CreateUserDto);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">Error loading users</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage users with cryptographic signature verification
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium"
          >
            Create New User
          </button>
        </div>

        <div className="space-y-6">
          <UserGraph users={users} />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Users from Protobuf Export
              </h2>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{verifiedUsers.size}</span> of{" "}
                <span className="font-medium">{protobufUsers.length}</span>{" "}
                signatures verified
              </div>
            </div>

            <UserTable
              users={protobufUsers}
              verifiedUsers={verifiedUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          user={editingUser}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </div>
  );
}
