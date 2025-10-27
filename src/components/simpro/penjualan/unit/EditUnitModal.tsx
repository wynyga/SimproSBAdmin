"use client";

// 1. Impor useState dan useEffect
import React, { useState, useEffect } from "react";

interface Unit {
  id: number;
  nomor_unit: string;
  blok_id: number;
  tipe_rumah_id: number;
}

interface Blok {
  id: number;
  nama_blok: string;
}

interface TipeRumah {
  id: number;
  tipe_rumah: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit; // Prop 'unit' HANYA sebagai data awal
  // setUnit DIHAPUS
  blokOptions: Blok[];
  tipeOptions: TipeRumah[];
  // 2. onSubmit akan mengirimkan 'data'
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
  // 3. Buat state LOKAL untuk form
  const [formData, setFormData] = useState<Unit>(unit);

  // 4. Sinkronkan state lokal JIKA prop 'unit' berubah
  // (Ini terjadi saat Anda menutup dan membuka modal untuk unit lain)
  useEffect(() => {
    if (unit) {
      setFormData(unit);
    }
  }, [unit]); // Hanya bergantung pada prop 'unit'

  if (!isOpen || !unit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 5. DEBUGGING: Tampilkan data yang AKAN DIKIRIM
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
          {/* Input Nomor Unit */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nomor Unit</label>
            <input
              type="text"
              // 6. Gunakan state LOKAL (formData)
              value={formData.nomor_unit}
              onChange={(e) =>
                // 7. Update state LOKAL (setFormData)
                setFormData({ ...formData, nomor_unit: e.target.value })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Input Blok */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Blok</label>
            <select
              // 6. Gunakan state LOKAL (formData)
              value={formData.blok_id}
              onChange={(e) => {
                // 7. Update state LOKAL (setFormData)
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
              // 6. Gunakan state LOKAL (formData)
              value={formData.tipe_rumah_id}
              onChange={(e) => {
                // 7. Update state LOKAL (setFormData)
                setFormData({ ...formData, tipe_rumah_id: Number(e.target.value) });
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