"use client";

import React, { useEffect, useState, useCallback } from "react"; // 1. Impor useCallback
import {
  getPaginatedUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../../../../../utils/users";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import AddUserModal from "@/components/simpro/penjualan/users/AddUserModal";
import EditUserModal from "@/components/simpro/penjualan/users/EditUserModal";

interface User {
  id: number;
  nama_user: string;
  alamat_user: string;
  no_telepon: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 2. Bungkus fungsi dengan useCallback
  const fetchUsers = useCallback(async () => {
    const res = await getPaginatedUsers(currentPage, searchTerm, setError);
    if (res) {
      setUsers(res.data || []);
      setTotalPages(res.last_page || 1);
    }
  }, [currentPage, searchTerm]); // <-- Dependensi untuk useCallback

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // 3. Gunakan fungsi yang sudah stabil sebagai dependensi

  const handleAddUser = async (data: {
    nama_user: string;
    alamat_user: string;
    no_telepon: string;
  }) => {
    await addUser(data, setError);
    await fetchUsers();
  };

  const handleUpdateUser = async (): Promise<boolean> => {
    if (!selectedUser) return false;

    await updateUser(
      selectedUser.id,
      {
        nama_user: selectedUser.nama_user,
        alamat_user: selectedUser.alamat_user,
        no_telepon: selectedUser.no_telepon,
      },
      setError
    );

    await fetchUsers();
    return true;
  };

  const handleDeleteUser = async () => {
    if (deleteId !== null) {
      await deleteUser(deleteId, setError);
      await fetchUsers();
      setDeleteId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Manajemen Users (Pembeli)" />
      <ComponentCard title="Data User">
        {/* Search & Tambah */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
          <input
            type="text"
            placeholder="Cari nama, alamat, atau no. telepon..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset halaman saat search
            }}
            className="w-full sm:w-64 rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {/* <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            Tambah User
          </Button> */}
        </div>

        {/* Tabel */}
        <div className="overflow-auto rounded border dark:border-gray-700">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-white">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="border px-4 py-2">Nama</th>
                <th className="border px-4 py-2">Alamat</th>
                <th className="border px-4 py-2">No. Telepon</th>
                {/* <th className="border px-4 py-2">Aksi</th> */}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="bg-white dark:bg-transparent">
                    <td className="border px-4 py-2">{user.nama_user}</td>
                    <td className="border px-4 py-2">{user.alamat_user}</td>
                    <td className="border px-4 py-2">{user.no_telepon}</td>
                    {/* <td className="border px-4 py-2 flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          setDeleteId(user.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Hapus
                      </Button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-white/80">
                    Tidak ada data user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-800 dark:text-gray-100">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Sebelumnya
            </button>
            <span className="mx-2">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </ComponentCard>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUser}
      />

      {selectedUser && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={selectedUser}
          setUser={setSelectedUser}
          onSubmit={handleUpdateUser}
          error={error}
          setError={setError}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        message="Apakah Anda yakin ingin menghapus user ini?"
      />
    </div>
  );
}