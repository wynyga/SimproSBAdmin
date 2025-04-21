"use client";

import React from "react";

interface CostElement {
  id: number;
  cost_centre_code: string;
  cost_element_code: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  costElement: CostElement;
  setCostElement: (data: CostElement) => void;
  onSubmit: () => Promise<boolean>;
  error?: string | null;
}

export default function EditCostElementModal({
  isOpen,
  onClose,
  costElement,
  setCostElement,
  onSubmit,
  error,
}: Props) {
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCostElement({ ...costElement, description: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit();
    if (success) onClose();
  };

  if (!isOpen || !costElement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Cost Element</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Cost Center</label>
            <input
              type="text"
              value={costElement.cost_centre_code}
              disabled
              className="w-full rounded border border-gray-300 px-3 py-2 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Cost Element Code</label>
            <input
              type="text"
              value={costElement.cost_element_code}
              disabled
              className="w-full rounded border border-gray-300 px-3 py-2 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <input
              type="text"
              value={costElement.description}
              onChange={handleDescriptionChange}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

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
