"use client";

import React from "react";
import Button from "@/components/ui/button/Button";

interface KwitansiItem {
  id: number;
  tanggal: string;
  no_doc: string;
  untuk_pembayaran: string;
  jumlah: number;
  metode_pembayaran: string;
  status: string;
  dibuat_oleh: string;
  transaksi_kas: {
    kode: string;
    status: string;
    dibuat_oleh: string;
  };
}

interface Props {
  transactions: KwitansiItem[];
  onCetakKwitansi: (id: number) => void;
}

export default function HistoryTransaksiKasTable({ transactions, onCetakKwitansi }: Props) {
  return (
    <div className="overflow-auto mt-6 rounded border dark:border-gray-700">
      <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
          <tr>
            <th className="border px-4 py-2">Tanggal</th>
            <th className="border px-4 py-2">Keterangan</th>
            <th className="border px-4 py-2">Jenis</th>
            <th className="border px-4 py-2">Jumlah</th>
            <th className="border px-4 py-2">Metode</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Kwitansi</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 dark:text-white">
          {transactions.length > 0 ? (
            transactions.map((item) => (
              <tr key={item.id} className="bg-white dark:bg-transparent">
                <td className="border px-4 py-2">{item.tanggal}</td>
                <td className="border px-4 py-2">{item.untuk_pembayaran}</td>
                <td className="border px-4 py-2">
                  {item.transaksi_kas?.kode === "101" ? "Kas Masuk" : "Kas Keluar"}
                </td>
                <td className="border px-4 py-2">Rp {item.jumlah.toLocaleString("id-ID")}</td>
                <td className="border px-4 py-2">{item.metode_pembayaran}</td>
                <td className="border px-4 py-2">{item.transaksi_kas?.status}</td>
                <td className="border px-4 py-2 text-center">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onCetakKwitansi(item.id)}
                  >
                    Cetak Kwitansi
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400">
                Tidak ada data kwitansi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
