"use client";

import React from "react";

interface SearchFormProps {
  searchParams: { nama_barang: string; kode_barang: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
}

export default function SearchForm({
  searchParams,
  handleInputChange,
  handleSearch,
}: SearchFormProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Cari Stok
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nama Barang
          </label>
          <input
            type="text"
            name="nama_barang"
            value={searchParams.nama_barang}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kode Barang
          </label>
          <input
            type="text"
            name="kode_barang"
            value={searchParams.kode_barang}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 transition"
          >
            Cari
          </button>
        </div>
      </div>
    </div>
  );
}
