"use client";

import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { nama_perumahan: string; lokasi: string }) => Promise<void>;
  error?: string | null;
}

export default function AddPerumahanModal({ isOpen, onClose, onSubmit, error }: Props) {
  const [formData, setFormData] = useState({ nama_perumahan: "", lokasi: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ nama_perumahan: "", lokasi: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Tambah Perumahan</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nama Perumahan</label>
            <input
              type="text"
              value={formData.nama_perumahan}
              onChange={(e) => setFormData({ ...formData, nama_perumahan: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Lokasi</label>
            <input
              type="text"
              value={formData.lokasi}
              onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-4">
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">Simpan</button>
            <button type="button" onClick={onClose} className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700 transition">Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
