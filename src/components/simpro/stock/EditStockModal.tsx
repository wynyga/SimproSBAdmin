"use client";

import React from "react";

export interface StockItemEdit {
  kode_barang: string;
  nama_barang: string;
  uty: string;
  satuan: string;
  harga_satuan: number | string;
  stock_bahan: number | string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stockItem: StockItemEdit | null;
  setStockItem: (item: StockItemEdit) => void;
  onSubmit: () => Promise<boolean>;
  error?: string | null;
}

export default function EditStockModal({
  isOpen,
  onClose,
  stockItem,
  setStockItem,
  onSubmit,
  error,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (stockItem) {
      setStockItem({
        ...stockItem,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit();
    if (success) {
      onClose();
    }
  };

  if (!isOpen || !stockItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Stok Gudang</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nama Barang */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nama Barang</label>
            <input
              type="text"
              name="nama_barang"
              value={stockItem.nama_barang || ""} 
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Uty */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Uty</label>
            <input
              type="text"
              name="uty"
              value={stockItem.uty || ""} 
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Satuan */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Satuan</label>
            <input
              type="text"
              name="satuan"
              value={stockItem.satuan || ""} 
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Harga Satuan */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Harga Satuan</label>
            <input
              type="number"
              name="harga_satuan"
              value={stockItem.harga_satuan || ""} 
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
              min="0"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500 mb-4 -mt-2">{error}</p>}

          {/* Action Buttons */}
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