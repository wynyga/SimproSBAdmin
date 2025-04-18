"use client";

import React, { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    nama_user: string;
    alamat_user: string;
    no_telepon: string;
  }) => void;
}

export default function AddUserModal({ isOpen, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    nama_user: "",
    alamat_user: "",
    no_telepon: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nama_user: "",
        alamat_user: "",
        no_telepon: "",
      });
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const { nama_user, alamat_user, no_telepon } = formData;
    if (!nama_user || !alamat_user || !no_telepon) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (no_telepon.length < 10) {
      setError("Nomor telepon minimal 10 digit.");
      return;
    }
    onSubmit(formData);
    onClose();
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Tambah User</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nama User</label>
            <input
              type="text"
              value={formData.nama_user}
              onChange={(e) =>
                setFormData({ ...formData, nama_user: e.target.value })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Alamat</label>
            <input
              type="text"
              value={formData.alamat_user}
              onChange={(e) =>
                setFormData({ ...formData, alamat_user: e.target.value })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">No. Telepon</label>
            <input
              type="text"
              value={formData.no_telepon}
              onChange={(e) =>
                setFormData({ ...formData, no_telepon: e.target.value })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Simpan
          </button>
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
