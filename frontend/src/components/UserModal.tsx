"use client";

import { User, CreateUserDto, UpdateUserDto } from "@/types/user";
import { useState, useEffect } from "react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => void;
  user?: User | null;
  isLoading?: boolean;
}

export function UserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
}: UserModalProps) {
  const [formData, setFormData] = useState<CreateUserDto>({
    email: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setFormData({
        email: "",
        role: "user",
        status: "active",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md border border-gray-300">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">
            {user ? "Edit User" : "Create New User"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "active" | "inactive",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
