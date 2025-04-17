"use client";

import React from "react";
import { StockData } from "../utils/StockData";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedStock: StockData | null;
  setSelectedStock: (stock: StockData | null) => void;
  handleUpdateStock: () => Promise<boolean>; // return true if success
  validationErrors: { [key: string]: boolean };
  errorMessage: string | null;
}

export default function UpdateStockModal({
  isOpen,
  onClose,
  selectedStock,
  setSelectedStock,
  handleUpdateStock,
  validationErrors,
  errorMessage,
}: Props) {
  if (!isOpen || !selectedStock) return null;

  const handleSubmit = async () => {
    const success = await handleUpdateStock();
    if (success) {
      onClose(); 
    }
  }; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md transition duration-300">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Edit Stok</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Nama Barang
            </label>
            <input
              type="text"
              className={`w-full rounded border px-3 py-2 text-sm shadow-sm focus:outline-none ${
                validationErrors.nama_barang ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
              value={selectedStock.nama_barang}
              onChange={(e) =>
                setSelectedStock({ ...selectedStock, nama_barang: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Harga Satuan
            </label>
            <input
              type="number"
              className={`w-full rounded border px-3 py-2 text-sm shadow-sm focus:outline-none ${
                validationErrors.harga_satuan ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
              value={selectedStock.harga_satuan}
              onChange={(e) =>
                setSelectedStock({ ...selectedStock, harga_satuan: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Satuan
            </label>
            <input
              type="text"
              className={`w-full rounded border px-3 py-2 text-sm shadow-sm focus:outline-none ${
                validationErrors.satuan ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
              value={selectedStock.satuan}
              onChange={(e) =>
                setSelectedStock({ ...selectedStock, satuan: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Stock Bahan
            </label>
            <input
              type="number"
              className={`w-full rounded border px-3 py-2 text-sm shadow-sm focus:outline-none ${
                validationErrors.stock_bahan ? "border-red-500" : "border-gray-300"
              } dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
              value={selectedStock.stock_bahan}
              onChange={(e) =>
                setSelectedStock({ ...selectedStock, stock_bahan: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Simpan Perubahan
          </button>
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
