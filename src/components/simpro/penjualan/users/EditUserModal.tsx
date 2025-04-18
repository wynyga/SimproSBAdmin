"use client";

import React from "react";

interface User {
  id: number;
  nama_user: string;
  alamat_user: string;
  no_telepon: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  setUser: (user: User) => void;
  onSubmit: () => Promise<boolean>;
  error?: string | null;
  setError: (value: string | null) => void;
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  setUser,
  onSubmit,
  error,
  setError
}: Props) {
  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.no_telepon.length < 10) {
      setError("Nomor telepon minimal 10 digit.");
      return;
    }
  
    const success = await onSubmit();
    if (success) onClose();
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit User</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nama User</label>
            <input
              type="text"
              name="nama_user"
              value={user.nama_user}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Alamat</label>
            <input
              type="text"
              name="alamat_user"
              value={user.alamat_user}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">No. Telepon</label>
            <input
              type="text"
              name="no_telepon"
              value={user.no_telepon}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
