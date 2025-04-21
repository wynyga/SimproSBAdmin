"use client";

import React, { useEffect, useState } from "react";
import { getUsers, registerUser, resetUserPassword,deleteUser } from "../../../../../../utils/auth";
import ResetPasswordModal from "@/components/simpro/admin/ResetPasswordModal";
import AddAccountModal from "@/components/simpro/admin/AddAccountModal";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AccountPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(setError);
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("Gagal memuat data akun.");
    }
    setLoading(false);
  };

  const handleResetPassword = async (newPassword: string, confirmPassword: string) => {
    if (!selectedUserId) return;
    await resetUserPassword(selectedUserId, newPassword, confirmPassword, setError);
    setShowResetModal(false);
    setSelectedUserId(null);
  };

  const handleAddAccount = async (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) => {
    setActionError(null);

    if (formData.password !== formData.confirmPassword) {
      setActionError("Konfirmasi password tidak cocok.");
      return;
    }

    const result = await registerUser(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
      setActionError
    );

    if (result) {
      setShowAddModal(false);
      fetchUsers();
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    await deleteUser(selectedUserId, setError);
    setShowDeleteModal(false);
    setSelectedUserId(null);
    fetchUsers();
  };

  return (
    <div className="min-h-screen px-4 py-6 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manajemen Akun</h2>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          Buat Akun Baru
        </Button>
      </div>

      <ComponentCard title="Daftar Akun">
        {loading ? (
          <p className="text-gray-600 dark:text-white">Memuat data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : users.length > 0 ? (
          <div className="overflow-auto rounded border dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Nama</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2 flex gap-2 justify-end">
                      <Button
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setShowResetModal(true);
                        }}
                      >
                        Reset Password
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-white">Tidak ada data akun.</p>
        )}
      </ComponentCard>

      <AddAccountModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAccount}
        error={actionError}
      />

      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onSubmit={handleResetPassword}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        message="Apakah Anda yakin ingin menghapus akun ini?"
      />
    </div>
  );
}
