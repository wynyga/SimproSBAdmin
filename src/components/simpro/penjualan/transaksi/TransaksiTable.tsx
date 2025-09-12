"use client";

import React from "react";
import { TransaksiDataWithRelasi } from "../../../../../utils/interfaceTransaksi";
import Button from "@/components/ui/button/Button";

interface Props {
  transaksiList: TransaksiDataWithRelasi[];
  loading: boolean;
  error: string | null;
  setEditTransaksi: (transaksi: TransaksiDataWithRelasi) => void;
  handleDeleteClick: (id: number) => void;
}

export default function TransaksiTable({
  transaksiList,
  loading,
  error,
  setEditTransaksi,
  handleDeleteClick,
}: Props) {
  const headers = [
    "Pembeli",
    "Unit",
    "Blok",
    "Tipe Rumah",
    "Harga Jual",
    "Kelebihan Tanah",
    "Penambahan Bangunan",
    "Perubahan Spek",
    "Total Harga",
    "DP",
    "Biaya Booking",
    "Plafon KPR",
    "Status KPR",
    "Aksi",
  ];

  return (
    <div className="overflow-auto rounded border dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-white text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-2 font-semibold text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-4 text-center text-gray-500 dark:text-white">
                Memuat data...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : transaksiList.length > 0 ? (
            <>
              {transaksiList.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2">{item.user_perumahan?.nama_user || "-"}</td>
                  <td className="px-4 py-2">{item.unit?.nomor_unit || "-"}</td>
                  <td className="px-4 py-2">{item.unit?.blok?.nama_blok || "-"}</td>
                  <td className="px-4 py-2">{item.unit?.tipe_rumah?.tipe_rumah || "-"}</td>
                  <td className="px-4 py-2">Rp {Number(item.harga_jual_standar).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2">Rp {Number(item.kelebihan_tanah).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2">Rp {Number(item.penambahan_luas_bangunan).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2">Rp {Number(item.perubahan_spek_bangunan).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2">Rp {Number(item.total_harga_jual).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2">Rp {Number(item.minimum_dp).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2">Rp {Number(item.biaya_booking).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2">Rp {Number(item.plafon_kpr ?? 0).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2">{item.kpr_disetujui}</td>
                  <td className="px-4 py-2 flex gap-2 justify-end">
                    <Button
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => setEditTransaksi(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDeleteClick(item.id!)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-4 py-4 text-center text-gray-500 dark:text-white">
                Tidak ada data transaksi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
