"use client";

// 1. Impor useState dan useEffect
import React, { useState, useEffect } from "react";

// 2. Perbarui Interface Unit
interface Unit {
  id: number;
  nomor_unit: string;
  blok_id: number;
  tipe_rumah_id: number;
  kategori: string; // <-- Tambahkan ini
}

interface Blok {
  id: number;
  nama_blok: string;
}

interface TipeRumah {
  id: number;
  tipe_rumah: string;
}

// 3. Interface 'Props' sekarang otomatis benar
// karena 'Unit' sudah diperbarui
interface Props {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit;
  blokOptions: Blok[];
  tipeOptions: TipeRumah[];
  onSubmit: (data: Unit) => Promise<boolean>;
  error?: string | null;
}

export default function EditUnitModal({
  isOpen,
  onClose,
  unit,
  blokOptions,
  tipeOptions,
  onSubmit,
  error,
}: Props) {
  const [formData, setFormData] = useState<Unit>(unit);

  useEffect(() => {
    if (unit) {
      setFormData(unit);
    }
  }, [unit]);

  if (!isOpen || !unit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("MODAL: Mengirim data ini ke Page.tsx:", formData);
    const success = await onSubmit(formData); // Kirim state LOKAL
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Unit</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Input Blok */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Blok</label>
            <select
              value={formData.blok_id}
              onChange={(e) => {
                setFormData({ ...formData, blok_id: Number(e.target.value) });
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Pilih Blok</option>
              {blokOptions.map((blok) => (
                <option key={blok.id} value={blok.id}>
                  {blok.nama_blok}
                </option>
              ))}
            </select>
          </div>

          {/* Input Tipe Rumah */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tipe Rumah</label>
            <select
              value={formData.tipe_rumah_id}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  tipe_rumah_id: Number(e.target.value),
                });
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Pilih Tipe</option>
              {tipeOptions.map((tipe) => (
                <option key={tipe.id} value={tipe.id}>
                  {tipe.tipe_rumah}
                </option>
              ))}
            </select>
          </div>

          {/* 4. TAMBAHKAN INPUT KATEGORI */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              // 5. Atasi bug 'null' dengan fallback ke string kosong
              value={formData.kategori || ""}
              onChange={(e) => {
                setFormData({ ...formData, kategori: e.target.value });
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="standar">Standar</option>
              <option value="non standar">Non Standar</option>
              <option value="sudut">Sudut</option>
            </select>
          </div>

          {/* Input Nomor Unit */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nomor Unit</label>
            <input
              type="text"
              value={formData.nomor_unit}
              onChange={(e) =>
                setFormData({ ...formData, nomor_unit: e.target.value })
              }
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
