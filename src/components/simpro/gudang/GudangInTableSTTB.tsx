"use client";

import React from "react";
import Button from "@/components/ui/button/Button";

interface Props {
  gudangInList: {
    id: number;
    nama_barang: string;
    pengirim: string;
    no_nota: string;
    tanggal_barang_masuk: string;
    jumlah: number;
    status: string;
    sttb?: { id: number; no_doc: string; tanggal: string } | null;
    kwitansi_co?: { id: number; no_doc: string; tanggal: string } | null;
  }[];
  onCetakSttb: (id: number) => void;
  onCetakKwitansiCO: (id: number) => void;
}

export default function GudangInTableSTTB({ gudangInList, onCetakSttb, onCetakKwitansiCO }: Props) {
  return (
    <div className="overflow-auto mt-6 rounded border dark:border-gray-700">
      <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
          <tr>
            <th className="border px-4 py-2">Tanggal Masuk</th>
            <th className="border px-4 py-2">Barang</th>
            <th className="border px-4 py-2">Jumlah</th>
            <th className="border px-4 py-2">Pengirim</th>
            <th className="border px-4 py-2">No Nota</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">STTB</th>
            <th className="border px-4 py-2">Kwitansi CO</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 dark:text-white">
          {gudangInList.length > 0 ? (
            gudangInList.map((item) => (
              <tr key={item.id} className="bg-white dark:bg-transparent">
                <td className="border px-4 py-2">{item.tanggal_barang_masuk}</td>
                <td className="border px-4 py-2">{item.nama_barang}</td>
                <td className="border px-4 py-2">{item.jumlah}</td>
                <td className="border px-4 py-2">{item.pengirim}</td>
                <td className="border px-4 py-2">{item.no_nota}</td>
                <td className="border px-4 py-2 capitalize">{item.status}</td>

                {/* STTB */}
                <td className="border px-4 py-2 text-center">
                  {item.status === "verified" ? (
                    item.sttb ? (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => onCetakSttb(item.sttb!.id)}
                      >
                        Cetak STTB
                      </Button>
                    ) : (
                      <span className="italic text-gray-400">Belum Ada STTB</span>
                    )
                  ) : (
                    <span className="italic text-gray-400">Menunggu Verifikasi</span>
                  )}
                </td>

                {/* KWITANSI CO */}
                <td className="border px-4 py-2 text-center">
                  {item.status === "verified" ? (
                    item.kwitansi_co ? (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => onCetakKwitansiCO(item.kwitansi_co!.id)}
                      >
                        Cetak CO
                      </Button>
                    ) : (
                      <span className="italic text-gray-400">Belum Ada CO</span>
                    )
                  ) : (
                    <span className="italic text-gray-400">Menunggu Verifikasi</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-400">
                Tidak ada data Gudang In.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
