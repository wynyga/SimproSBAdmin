"use client";

import React, { useEffect, useState } from "react";

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
  // Prop 'setStockItem' digunakan untuk memanipulasi state di parent
  setStockItem: (item: StockItemEdit) => void;
  onSubmit: () => Promise<boolean>;
  error?: string | null;
}

// Fungsi helper untuk membersihkan string harga ("50.000,00" -> "50000")
const cleanPriceString = (price: string | number): string => {
  if (typeof price === 'number') {
    return String(price);
  }
  // Menghapus titik (separator ribuan) dan semua setelah koma (desimal)
  return String(price).replace(/\./g, "").replace(/,.*/, "");
};

export default function EditStockModal({
  isOpen,
  onClose,
  stockItem,
  setStockItem,
  onSubmit,
  error,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  // --- PERBAIKAN BUG HARGA_SATUAN ---
  // Saat modal dibuka (stockItem berubah), cek harga_satuan.
  // Jika masih string terformat ("50.000,00"),
  // bersihkan dan update state parent agar input <input type="number"> bisa menampilkannya.
  useEffect(() => {
    if (stockItem) {
      const cleanedPrice = cleanPriceString(stockItem.harga_satuan);
      
      // Cek jika nilainya berbeda untuk menghindari loop render
      if (cleanedPrice !== String(stockItem.harga_satuan)) {
        setStockItem({
          ...stockItem,
          harga_satuan: cleanedPrice,
        });
      }
    }
    // Dependency 'isOpen' memastikan ini reset saat modal ditutup & dibuka lagi
  }, [stockItem, setStockItem, isOpen]);

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
    if (isLoading) return; // Mencegah double-submit

    setIsLoading(true);
    const success = await onSubmit();
    setIsLoading(false);

    if (success) {
      onClose();
    }
  };

  // Reset loading state saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !stockItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Detail Item</h4>
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

          {/* Grup Uty & Satuan */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
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
            <div>
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
          </div>

          {/* Harga Satuan */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Harga Satuan</label>
            <input
              type="number"
              name="harga_satuan"
              // Nilai sekarang sudah bersih (misal "50000") berkat useEffect
              value={stockItem.harga_satuan || ""}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
              min="0"
            />
          </div>

          {/* --- TAMBAHAN: STOK BAHAN (READ-ONLY) --- */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Jumlah Stok Saat Ini
            </label>
            <input
              type="number"
              name="stock_bahan"
              value={stockItem.stock_bahan || 0}
              className="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
              disabled // Dinonaktifkan
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Jumlah stok tidak bisa diubah dari menu ini.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 mb-4 -mt-2">{error}</p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700 transition"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}