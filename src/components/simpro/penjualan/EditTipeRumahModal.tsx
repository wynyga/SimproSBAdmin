"use client";

import React from "react";
import { formatRupiah } from "../../../../utils/formatRupiah";
// Interface ini sudah benar
interface TipeRumah {
  id: number;
  tipe_rumah: string;
  luas_bangunan: number;
  luas_kavling: number;
  harga_standar: number;
  harga_jual: number;
  penambahan_bangunan: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedTipe: TipeRumah | null;
  setSelectedTipe: (tipe: TipeRumah | null) => void;
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
            <label className="block text-sm font-medium mb-1">
              Luas Bangunan (m²)
            </label>
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
            <label className="block text-sm font-medium mb-1">
              Luas Kavling (m²)
            </label>
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

          {/* Harga Standar */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Harga Standar
            </label>
            <input
              type="text"
              className={inputClass("harga_standar")}
              value={formatRupiah(selectedTipe.harga_standar)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setSelectedTipe({
                  ...selectedTipe,
                  harga_standar: Number(raw),
                });
              }}
            />
          </div>

          {/* Harga Jual */}
          <div>
            <label className="block text-sm font-medium mb-1">Harga Jual</label>
            <input
              type="text"
              className={inputClass("harga_jual")}
              value={formatRupiah(selectedTipe.harga_jual)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setSelectedTipe({
                  ...selectedTipe,
                  harga_jual: Number(raw),
                });
              }}
            />
          </div>

          {/* Penambahan Bangunan */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Penambahan Bangunan
            </label>
            <input
              type="text"
              className={inputClass("penambahan_bangunan")}
              value={formatRupiah(selectedTipe.penambahan_bangunan)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setSelectedTipe({
                  ...selectedTipe,
                  penambahan_bangunan: Number(raw),
                });
              }}
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

