"use client";

import React, { useState } from "react";

interface GudangInItem {
  id: number;
  nama_barang: string;
  pengirim: string;
  no_nota: string;
  tanggal_barang_masuk: string;
  jumlah: number;
  status: string;
  sistem_pembayaran?: string;
}

interface Props {
  gudangInList: GudangInItem[];
  loading: boolean;
  error: string | null;
}

export default function GudangInTable({ gudangInList, loading, error }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedList = gudangInList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(gudangInList.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "verified":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="overflow-x-auto rounded border dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
          <tr>
            <th className="px-4 py-2 text-left">Nama Barang</th>
            <th className="px-4 py-2 text-left">Pengirim</th>
            <th className="px-4 py-2 text-left">No Nota</th>
            <th className="px-4 py-2 text-left">Tanggal Masuk</th>
            <th className="px-4 py-2 text-left">Jumlah</th>
            <th className="px-4 py-2 text-left">Sistem Pembayaran</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-4">Memuat data...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={7} className="text-center text-red-500 py-4">{error}</td>
            </tr>
          ) : paginatedList.length > 0 ? (
            paginatedList.map((item) => (
              <tr key={item.id} className="bg-white dark:bg-transparent">
                <td className="px-4 py-2">{item.nama_barang}</td>
                <td className="px-4 py-2">{item.pengirim}</td>
                <td className="px-4 py-2">{item.no_nota}</td>
                <td className="px-4 py-2">{item.tanggal_barang_masuk}</td>
                <td className="px-4 py-2">{item.jumlah}</td>
                <td className="px-4 py-2">{item.sistem_pembayaran || "-"}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded font-medium ${statusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">Tidak ada data Gudang In.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-md text-sm ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
