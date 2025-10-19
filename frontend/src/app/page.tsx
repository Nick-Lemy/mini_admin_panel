"use client";

import { useEffect, useState } from "react";
import { fetchUsersProtobuf, User } from "@/services/protobuf.service";
import { verifySignatureSimple } from "@/services/crypto.service";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [verifiedUsers, setVerifiedUsers] = useState<User[]>([]);
  const [publicKey, setPublicKey] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        // Fetch public key
        const keyResponse = await fetch(
          "http://localhost:3000/api/v1/users/public-key"
        );
        if (!keyResponse.ok) {
          throw new Error("Failed to fetch public key");
        }
        const keyData = await keyResponse.json();
        setPublicKey(keyData.publicKey);

        // Fetch users from protobuf endpoint
        const usersData = await fetchUsersProtobuf();
        setUsers(usersData);

        // Verify signatures
        const verified = usersData.filter((user) => {
          if (!user.emailHash || !user.signature) {
            console.warn(`User ${user.id} missing signature data`);
            return false;
          }

          // Verify the signature
          const isValid = verifySignatureSimple(
            user.emailHash,
            user.signature,
            keyData.publicKey
          );

          if (!isValid) {
            console.warn(`User ${user.id} has invalid signature`);
          }

          return isValid;
        });

        setVerifiedUsers(verified);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">User Management Dashboard</h1>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">System Info</h2>
          <p className="text-sm">Total users fetched: {users.length}</p>
          <p className="text-sm">
            Verified users (valid signatures): {verifiedUsers.length}
          </p>
          <p className="text-sm">
            Invalid/Missing signatures: {users.length - verifiedUsers.length}
          </p>
        </div>

        {publicKey && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Public Key</h2>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all">
              {publicKey}
            </pre>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Signature Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {verifiedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No verified users found
                  </td>
                </tr>
              ) : (
                verifiedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        ✓ Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {users.length > verifiedUsers.length && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800">
              Invalid Users (Not Displayed)
            </h3>
            <p className="text-sm text-yellow-700 mb-2">
              The following users have invalid or missing signatures and are not
              displayed in the table:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-700">
              {users
                .filter(
                  (user) =>
                    !verifiedUsers.find((verified) => verified.id === user.id)
                )
                .map((user) => (
                  <li key={user.id}>
                    ID: {user.id}, Email: {user.email}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
