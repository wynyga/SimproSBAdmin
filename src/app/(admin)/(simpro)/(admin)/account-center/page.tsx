"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, registerUser, resetUserPassword, deleteUser, getProfile } from "../../../../../../utils/auth";
import ResetPasswordModal from "@/components/simpro/admin/ResetPasswordModal";
import AddAccountModal from "@/components/simpro/admin/AddAccountModal";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AccountPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [isAllowed, setIsAllowed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const profile = await getProfile((err: string) => setError(err));
        if (profile?.role === "Direktur") {
          setIsAllowed(true);
        }
      } catch {
        setError("Gagal memuat profil pengguna.");
      } finally {
        setCheckingAccess(false);
      }
    };

    checkRole();
  }, []);

  useEffect(() => {
    if (isAllowed) {
      fetchUsers();
    }
  }, [isAllowed]);

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
  <div className="min-h-screen">
    <PageBreadcrumb pageTitle="Manajemen Akun" />
    <div className="px-4 xl:px-10">
      {checkingAccess ? (
        <p className="text-sm text-gray-500 dark:text-white">Memuat akses pengguna...</p>
      ) : !isAllowed ? (
        <ComponentCard title="Akses Ditolak">
          <p className="text-sm text-red-500">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Kembali ke Dashboard
          </button>
        </ComponentCard>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Manajemen Akun</h2>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Buat Akun Baru
            </Button>
          </div>

          <ComponentCard title="Daftar Akun">
            {loading ? (
              <p className="text-gray-600 dark:text-white">Memuat data...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : users.length > 0 ? (
              <div className="overflow-auto rounded border border-gray-300 dark:border-gray-700">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-600">Nama</th>
                      <th className="px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-600">Email</th>
                      <th className="px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-600">Role</th>
                      <th className="px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 dark:text-white">
                    {users.map((user) => (
                      <tr key={user.id} className="bg-white dark:bg-transparent">
                        <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">{user.name}</td>
                        <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">{user.email}</td>
                        <td className="px-4 py-2 border border-gray-300 dark:border-gray-700 capitalize">{user.role}</td>
                        <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                          <div className="flex gap-2 justify-end">
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
                          </div>
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

          {/* MODALS */}
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
        </>
      )}
    </div>
  </div>
);

}
