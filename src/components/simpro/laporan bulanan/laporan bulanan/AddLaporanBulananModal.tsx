"use client";

import React, { useEffect, useState } from "react";

interface CostTee {
  id: number;
  cost_tee_code: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    cost_tee_id: number;
    bulan: number;
    tahun: number;
    jumlah: number;
  }) => Promise<void>;
  fetchCostTees: () => Promise<void>;
  costTees: CostTee[];
  error?: string | null;
}

export default function AddLaporanBulananModal({
  isOpen,
  onClose,
  onSubmit,
  fetchCostTees,
  costTees,
  error,
}: Props) {
  const [costTeeId, setCostTeeId] = useState<number | "">("");
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    if (costTees.length === 0) fetchCostTees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!costTeeId || !bulan || !tahun || !jumlah) return;

    await onSubmit({ cost_tee_id: Number(costTeeId), bulan, tahun, jumlah });
    onClose();
    setCostTeeId("");
    setJumlah(0);
    setBulan(new Date().getMonth() + 1);
    setTahun(new Date().getFullYear());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Tambah Laporan Bulanan</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cost Tee</label>
            <select
              value={costTeeId}
              onChange={(e) => setCostTeeId(Number(e.target.value))}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Pilih Cost Tee</option>
              {costTees.map((tee) => (
                <option key={tee.id} value={tee.id}>
                  {tee.description} ({tee.cost_tee_code})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Bulan</label>
              <input
                type="number"
                value={bulan}
                onChange={(e) => setBulan(Number(e.target.value))}
                min={1}
                max={12}
                className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tahun</label>
              <input
                type="number"
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(Number(e.target.value))}
              min={0}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          <div className="flex justify-end gap-3">
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
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
