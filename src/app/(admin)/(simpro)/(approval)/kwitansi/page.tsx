"use client";

import React, { useEffect, useState } from "react";
import { getHistoryTransaksiKas } from "../../../../../../utils/transaksi-kas";
import {cetakKwitansi } from "../../../../../../utils/kwitansi";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import HistoryTransaksiKasTable from "@/components/simpro/transaksi kas/HistoryTransaksiKasTable";


interface TransaksiKasItem {
  id: number;
  tanggal: string;
  keterangan_transaksi: string;
  kode: string;
  jumlah: number;
  metode_pembayaran: string;
  dibuat_oleh: string;
  status: string;
  kwitansi_id?: number; // opsional
}

export default function HistoryTransaksiKasPage() {
  const [transactions, setTransactions] = useState<TransaksiKasItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const perPage = 10;

  useEffect(() => {
    fetchHistory();
  }, [page, statusFilter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistoryTransaksiKas(statusFilter, "", "", perPage.toString(), page.toString());
      setTransactions(data.data || []);
    } catch (err) {
      setError("Gagal memuat data history transaksi kas.");
    }
    setLoading(false);
  };

  const handleCetakKwitansi = async (kwitansiId: number) => {
    try {
      await cetakKwitansi(kwitansiId);
    } catch (err) {
      console.error("Gagal cetak kwitansi:", err);
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Riwayat Transaksi Kas" />

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <HistoryTransaksiKasTable
          transactions={transactions}
          onCetakKwitansi={handleCetakKwitansi}
        />
      )}
    </div>
  );
}