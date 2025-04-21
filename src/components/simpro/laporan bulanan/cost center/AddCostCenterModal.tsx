"use client";

import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    cost_centre_code: string;
    description: string;
    cost_code: "KASIN" | "KASOUT";
  }) => Promise<void>;
  error?: string | null;
}

export default function AddCostCenterModal({ isOpen, onClose, onSubmit, error }: Props) {
  const [costCode, setCostCode] = useState<"KASIN" | "KASOUT">("KASIN");
  const [codeNumber, setCodeNumber] = useState("");
  const [description, setDescription] = useState("");

  const getPrefix = () => (costCode === "KASIN" ? "KI" : "KO");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeNumber.trim() || !description.trim()) return;

    const fullCode = `${getPrefix()}${codeNumber}`;
    await onSubmit({ cost_centre_code: fullCode, description, cost_code: costCode });
    onClose();
    setCodeNumber("");
    setDescription("");
    setCostCode("KASIN");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Tambah Cost Center</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Jenis Kas</label>
            <select
              value={costCode}
              onChange={(e) => setCostCode(e.target.value as "KASIN" | "KASOUT")}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="KASIN">KASIN (Kas Masuk)</option>
              <option value="KASOUT">KASOUT (Kas Keluar)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kode (angka saja)</label>
            <input
              type="text"
              value={codeNumber}
              onChange={(e) => setCodeNumber(e.target.value)}
              placeholder="Contoh: 01"
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Kode akhir: <span className="font-semibold">{getPrefix()}{codeNumber || "??"}</span>
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
