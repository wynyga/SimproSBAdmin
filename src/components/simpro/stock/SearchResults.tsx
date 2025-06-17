"use client";

import React from "react";
import { StockData } from "../../../../utils/StockData";

interface SearchResultsProps {
  searchResults: StockData[];
  handleSelectStock: (stock: StockData) => void;
}

export default function SearchResults({
  searchResults,
  handleSelectStock,
}: SearchResultsProps) {
  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Hasil Pencarian
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
          <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 font-medium">Kode Barang</th>
              <th className="px-4 py-2 font-medium">Nama Barang</th>
              <th className="px-4 py-2 font-medium">Harga Satuan</th>
              <th className="px-4 py-2 font-medium">Stock Bahan</th>
              <th className="px-4 py-2 font-medium">Satuan</th>
              <th className="px-4 py-2 font-medium">Total Harga</th>
              {/* <th className="px-4 py-2 font-medium">Aksi</th> */}
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((stock, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{stock.kode_barang}</td>
                  <td className="px-4 py-2">{stock.nama_barang}</td>
                  <td className="px-4 py-2">Rp {stock.harga_satuan}</td>
                  <td className="px-4 py-2">{stock.stock_bahan}</td>
                  <td className="px-4 py-2">{stock.satuan}</td>
                  <td className="px-4 py-2">Rp {stock.total_price}</td>
                  {/* <td className="px-4 py-2">
                    <button
                      onClick={() => handleSelectStock(stock)}
                      className="rounded-md bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada hasil ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
