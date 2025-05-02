"use client";

import React, { useState } from "react";

interface TransaksiData {
  id: number;
  unit_id: number;
  user_id: number;
  total_harga_jual: number;
  plafon_kpr: number;
  total_bayar: number;
  status_bayar: "lunas" | "cicil" | "utang";
  unit: string | null;
  pembeli: string | null;
}

interface Props {
  transaksiList: TransaksiData[];
  loading: boolean;
  error: string | null;
}

export default function TransaksiPenjualanTable({ transaksiList, loading, error }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lunas":
        return "text-green-700 bg-green-100";
      case "cicil":
        return "text-yellow-700 bg-yellow-100";
      case "utang":
        return "text-red-700 bg-red-100";
      default:
        return "";
    }
  };

  const paginatedList = transaksiList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(transaksiList.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="overflow-x-auto rounded border dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-white text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Pembeli</th>
            <th className="px-4 py-2">Harga Jual</th>
            <th className="px-4 py-2">Plafon KPR</th>
            <th className="px-4 py-2">Sisa Pelunasan</th>
            <th className="px-4 py-2">Sisa Hutang</th>
            <th className="px-4 py-2">Status Bayar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <tr>
              <td colSpan={7} className="px-4 py-4 text-center">Loading...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={7} className="px-4 py-4 text-center text-red-500">{error}</td>
            </tr>
          ) : paginatedList.length > 0 ? (
            paginatedList.map((trx) => (
              <tr key={trx.id}>
                <td className="px-4 py-2">{trx.unit || "-"}</td>
                <td className="px-4 py-2">{trx.pembeli || "-"}</td>
                <td className="px-4 py-2">Rp {trx.total_harga_jual.toLocaleString("id-ID")}</td>
                <td className="px-4 py-2">Rp {trx.plafon_kpr.toLocaleString("id-ID")}</td>
                <td className="px-4 py-2">Rp {trx.total_bayar.toLocaleString("id-ID")}</td>
                <td className="px-4 py-2">
                  Rp {(trx.plafon_kpr - trx.total_bayar).toLocaleString("id-ID")}
                </td>
                <td className={`px-4 py-2 font-semibold rounded ${getStatusColor(trx.status_bayar)}`}>
                  {trx.status_bayar.toUpperCase()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-4 text-center">Tidak ada transaksi.</td>
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
