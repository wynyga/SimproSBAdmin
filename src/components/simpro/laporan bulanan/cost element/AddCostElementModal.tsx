"use client";

import React, { useState, useEffect } from "react";

interface CostCenter {
  id: number;
  name: string;
  cost_centre_code: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    cost_centre_code: string;
    cost_element_code: string;
    description: string;
  }) => Promise<void>;
  fetchCostCenters: () => Promise<void>;
  costCenters: CostCenter[];
  error?: string | null;
}

export default function AddCostElementModal({
  isOpen,
  onClose,
  onSubmit,
  fetchCostCenters,
  costCenters,
  error,
}: Props) {
  const [selectedCostCentreCode, setSelectedCostCentreCode] = useState("");
  const [elementNumber, setElementNumber] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (costCenters.length === 0) fetchCostCenters();
  }, []);

  const fullElementCode = selectedCostCentreCode && elementNumber
    ? `${selectedCostCentreCode}-${elementNumber}`
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCostCentreCode || !elementNumber.trim() || !description.trim()) return;
    const payload = {
      cost_centre_code: selectedCostCentreCode,
      cost_element_code: fullElementCode,
      description,
    };
    await onSubmit(payload);
    onClose();
    setSelectedCostCentreCode("");
    setElementNumber("");
    setDescription("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Tambah Cost Element</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pilih Cost Center</label>
            <select
              value={selectedCostCentreCode}
              onChange={(e) => setSelectedCostCentreCode(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Pilih Cost Center</option>
              {costCenters.map((cc) => (
                <option key={cc.id} value={cc.cost_centre_code}>
                  {cc.name} ({cc.cost_centre_code})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kode Cost Element (angka)</label>
            <input
              type="text"
              value={elementNumber}
              onChange={(e) => setElementNumber(e.target.value)}
              placeholder="Contoh: 01"
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
            {fullElementCode && (
              <p className="text-sm text-gray-500 mt-1">
                Kode akhir: <span className="font-semibold">{fullElementCode}</span>
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
