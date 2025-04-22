"use client";

import React from "react";

interface LaporanBulanan {
  id: number;
  cost_tee_id: number;
  bulan: number;
  tahun: number;
  jumlah: number;
  cost_tee?: {
    description: string;
    cost_tee_code: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  laporan: LaporanBulanan;
  setLaporan: (data: LaporanBulanan) => void;
  onSubmit: () => Promise<boolean>;
  error?: string | null;
}

export default function EditLaporanBulananModal({
  isOpen,
  onClose,
  laporan,
  setLaporan,
  onSubmit,
  error,
}: Props) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit();
    if (success) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLaporan({ ...laporan, [name]: Number(value) });
  };

  if (!isOpen || !laporan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Laporan Bulanan</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Cost Tee</label>
            <input
              type="text"
              value={`${laporan.cost_tee?.description ?? "-"} (${laporan.cost_tee?.cost_tee_code ?? "-"})`}
              disabled
              className="w-full rounded border border-gray-300 px-3 py-2 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bulan</label>
              <input
                name="bulan"
                type="number"
                value={laporan.bulan}
                onChange={handleChange}
                min={1}
                max={12}
                className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tahun</label>
              <input
                name="tahun"
                type="number"
                value={laporan.tahun}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Jumlah (Rp)</label>
            <input
              name="jumlah"
              type="number"
              value={laporan.jumlah}
              onChange={handleChange}
              min={0}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
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
