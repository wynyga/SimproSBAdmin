"use client";

import React from "react";

interface TipeRumahData {
  id: number;
  tipe_rumah: string;
  luas_bangunan: number;
  luas_kavling: number;
  harga_standar_tengah: number;
  harga_standar_sudut: number;
  penambahan_bangunan: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedTipe: TipeRumahData | null;
  setSelectedTipe: (tipe: TipeRumahData | null) => void;
  handleUpdateTipe: () => Promise<boolean>;
  validationErrors: { [key: string]: boolean };
  errorMessage: string | null;
}

export default function EditTipeRumahModal({
  isOpen,
  onClose,
  selectedTipe,
  setSelectedTipe,
  handleUpdateTipe,
  validationErrors,
  errorMessage,
}: Props) {
  if (!isOpen || !selectedTipe) return null;

  const handleSubmit = async () => {
    const success = await handleUpdateTipe();
    if (success) {
      onClose();
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded border px-3 py-2 text-sm shadow-sm focus:outline-none ${
      validationErrors[field] ? "border-red-500" : "border-gray-300"
    } dark:border-gray-600 dark:bg-gray-700 dark:text-white`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md transition duration-300">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Tipe Rumah
          </h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Tipe</label>
            <input
              type="text"
              className={inputClass("tipe_rumah")}
              value={selectedTipe.tipe_rumah}
              onChange={(e) =>
                setSelectedTipe({ ...selectedTipe, tipe_rumah: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Luas Bangunan (m²)</label>
            <input
              type="number"
              className={inputClass("luas_bangunan")}
              value={selectedTipe.luas_bangunan}
              onChange={(e) =>
                setSelectedTipe({
                  ...selectedTipe,
                  luas_bangunan: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Luas Kavling (m²)</label>
            <input
              type="number"
              className={inputClass("luas_kavling")}
              value={selectedTipe.luas_kavling}
              onChange={(e) =>
                setSelectedTipe({
                  ...selectedTipe,
                  luas_kavling: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Harga Standar Tengah</label>
            <input
              type="number"
              className={inputClass("harga_standar_tengah")}
              value={selectedTipe.harga_standar_tengah}
              onChange={(e) =>
                setSelectedTipe({
                  ...selectedTipe,
                  harga_standar_tengah: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Harga Standar Sudut</label>
            <input
              type="number"
              className={inputClass("harga_standar_sudut")}
              value={selectedTipe.harga_standar_sudut}
              onChange={(e) =>
                setSelectedTipe({
                  ...selectedTipe,
                  harga_standar_sudut: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Penambahan Bangunan</label>
            <input
              type="number"
              className={inputClass("penambahan_bangunan")}
              value={selectedTipe.penambahan_bangunan}
              onChange={(e) =>
                setSelectedTipe({
                  ...selectedTipe,
                  penambahan_bangunan: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {errorMessage && (
          <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Simpan Perubahan
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
