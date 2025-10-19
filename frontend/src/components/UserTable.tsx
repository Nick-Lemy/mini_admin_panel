"use client";

import { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  verifiedUsers: Set<number>;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export function UserTable({
  users,
  verifiedUsers,
  onEdit,
  onDelete,
}: UserTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Signature
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isVerified = verifiedUsers.has(user.id);
                if (!isVerified) return null;

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.role}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(user)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(user.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
