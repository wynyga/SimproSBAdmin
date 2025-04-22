"use client";

import React, { useEffect, useState } from "react";

interface CostElement {
  id: number;
  cost_element_code: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    cost_element_code: string;
    cost_tee_code: string;
    description: string;
  }) => Promise<void>;
  fetchCostElements: () => Promise<void>;
  costElements: CostElement[];
  error?: string | null;
}

export default function AddCostTeeModal({
  isOpen,
  onClose,
  onSubmit,
  fetchCostElements,
  costElements,
  error,
}: Props) {
  const [selectedCostElementCode, setSelectedCostElementCode] = useState("");
  const [teeNumber, setTeeNumber] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (costElements.length === 0) fetchCostElements();
  }, []);

  const fullTeeCode = selectedCostElementCode && teeNumber
    ? `${selectedCostElementCode}-${teeNumber}`
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCostElementCode || !teeNumber.trim() || !description.trim()) return;

    const payload = {
      cost_element_code: selectedCostElementCode,
      cost_tee_code: fullTeeCode,
      description,
    };

    await onSubmit(payload);
    onClose();
    setSelectedCostElementCode("");
    setTeeNumber("");
    setDescription("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Tambah Cost Tee</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pilih Cost Element</label>
            <select
              value={selectedCostElementCode}
              onChange={(e) => setSelectedCostElementCode(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Pilih Cost Element</option>
              {costElements.map((ce) => (
                <option key={ce.id} value={ce.cost_element_code}>
                  {ce.description} ({ce.cost_element_code})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kode Cost Tee (angka)</label>
            <input
              type="text"
              value={teeNumber}
              onChange={(e) => setTeeNumber(e.target.value)}
              placeholder="Contoh: 01"
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
            {fullTeeCode && (
              <p className="text-sm text-gray-500 mt-1">
                Kode akhir: <span className="font-semibold">{fullTeeCode}</span>
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
