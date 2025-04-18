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
  return (
    <div className="overflow-auto rounded border dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-white text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Pembeli</th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Blok</th>
            <th className="px-4 py-2">Tipe Rumah</th>
            <th className="px-4 py-2">Harga Jual</th>
            <th className="px-4 py-2">Kelebihan Tanah</th>
            <th className="px-4 py-2">Penambahan Bangunan</th>
            <th className="px-4 py-2">Perubahan Spek</th>
            <th className="px-4 py-2">Total Harga</th>
            <th className="px-4 py-2">Minimum DP</th>
            <th className="px-4 py-2">Kewajiban Hutang</th>
            <th className="px-4 py-2">Status KPR</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <tr>
              <td colSpan={13} className="px-4 py-4 text-center text-gray-500 dark:text-white">
                Memuat data...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={13} className="px-4 py-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : transaksiList.length > 0 ? (
            transaksiList.map((item) => (
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
                <td className="px-4 py-2">Rp {Number(item.kewajiban_hutang).toLocaleString("id-ID")}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan={13} className="px-4 py-4 text-center text-gray-500 dark:text-white">
                Tidak ada data transaksi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
