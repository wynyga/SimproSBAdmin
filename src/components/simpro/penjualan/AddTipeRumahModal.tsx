"use client";

import React, { useState } from "react";
import { formatRupiah } from "../../../../utils/formatRupiah";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormDataState) => Promise<void>;
  error?: string | null;
}

interface FormDataState {
  tipe_rumah: string;
  luas_bangunan: number;
  luas_kavling: number;
  harga_standar_tengah: number;
  harga_standar_sudut: number;
  penambahan_bangunan: number;
}

export default function AddTipeRumahModal({
  isOpen,
  onClose,
  onSubmit,
  error,
}: Props) {
  const [formData, setFormData] = useState<FormDataState>({
    tipe_rumah: "",
    luas_bangunan: 0,
    luas_kavling: 0,
    harga_standar_tengah: 0,
    harga_standar_sudut: 0,
    penambahan_bangunan: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["harga_standar_tengah", "harga_standar_sudut", "penambahan_bangunan"].includes(name)) {
      const raw = value.replace(/[^0-9]/g, ""); // hanya angka
      setFormData((prev) => ({
        ...prev,
        [name]: Number(raw),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "tipe_rumah" ? value : Number(value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Tambah Tipe Rumah</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Tipe */}
          <div>
            <label className="block text-sm font-medium">Nama Tipe Rumah</label>
            <input
              type="text"
              name="tipe_rumah"
              required
              value={formData.tipe_rumah}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Luas Bangunan */}
          <div>
            <label className="block text-sm font-medium">Luas Bangunan (m²)</label>
            <input
              type="number"
              name="luas_bangunan"
              required
              value={formData.luas_bangunan}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Luas Kavling */}
          <div>
            <label className="block text-sm font-medium">Luas Kavling (m²)</label>
            <input
              type="number"
              name="luas_kavling"
              required
              value={formData.luas_kavling}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Harga Standar Tengah */}
          <div>
            <label className="block text-sm font-medium">Harga (Rp)</label>
            <input
              type="text"
              name="harga_standar_tengah"
              required
              value={formData.harga_standar_tengah ? formatRupiah(formData.harga_standar_tengah) : ""}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Harga Standar Sudut */}
          <div>
            <label className="block text-sm font-medium">Harga Sudut (Rp)</label>
            <input
              type="text"
              name="harga_standar_sudut"
              required
              value={formData.harga_standar_sudut ? formatRupiah(formData.harga_standar_sudut) : ""}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Penambahan Bangunan */}
          <div>
            <label className="block text-sm font-medium">Penambahan Bangunan (Rp)</label>
            <input
              type="text"
              name="penambahan_bangunan"
              required
              value={formData.penambahan_bangunan ? formatRupiah(formData.penambahan_bangunan) : ""}
              onChange={handleChange}
              className="w-full mt-1 rounded border px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {error && <div className="col-span-2 text-sm text-red-500">{error}</div>}

          <div className="col-span-2 mt-6 flex justify-end gap-3">
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Simpan
            </button>
            <button
              type="button"
              className="rounded border px-4 py-2 text-gray-700 dark:border-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
