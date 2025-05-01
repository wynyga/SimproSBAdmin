"use client";

import React from "react";

interface Perumahan {
  id: number;
  nama_perumahan: string;
  lokasi: string;
  inisial: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  perumahan: Perumahan;
  setPerumahan: (p: Perumahan) => void;
  onSubmit: () => Promise<boolean>;
  error?: string | null;
}

export default function EditPerumahanModal({
  isOpen,
  onClose,
  perumahan,
  setPerumahan,
  onSubmit,
  error,
}: Props) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit();
    if (success) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Perumahan</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nama Perumahan</label>
            <input
              type="text"
              value={perumahan.nama_perumahan}
              onChange={(e) =>
                setPerumahan({ ...perumahan, nama_perumahan: e.target.value })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Inisial</label>
            <input
              type="text"
              value={perumahan.inisial}
              onChange={(e) =>
                setPerumahan({ ...perumahan, inisial: e.target.value.toUpperCase() })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 uppercase dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Lokasi</label>
            <input
              type="text"
              value={perumahan.lokasi}
              onChange={(e) =>
                setPerumahan({ ...perumahan, lokasi: e.target.value })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

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
