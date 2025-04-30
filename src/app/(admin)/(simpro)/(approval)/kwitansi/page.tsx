"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getHistoryTransaksiKas } from "../../../../../../utils/transaksi-kas";
import {cetakKwitansi } from "../../../../../../utils/kwitansi";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import HistoryTransaksiKasTable from "@/components/simpro/transaksi kas/HistoryTransaksiKasTable";
import { getProfile } from "../../../../../../utils/auth";
import ComponentCard from "@/components/common/ComponentCard";

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
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransaksiKasItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [page, ] = useState(1);
  const [statusFilter, ] = useState("");
  const perPage = 10;
  const [, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const profile = await getProfile((err: string) => setError(err));
        if (profile && (profile.role === "Direktur" || profile.role === "Manager")) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch {
        setError("Gagal memuat profil pengguna.");
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, []);

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

      {loading ? (
        <p className="text-sm text-gray-500">Memuat akses pengguna...</p>
      ) : !isAllowed ? (
        <ComponentCard title="Akses Ditolak">
          <p className="text-sm text-red-500">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Kembali ke Dashboard
          </button>
        </ComponentCard>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <HistoryTransaksiKasTable
          transactions={transactions}
          onCetakKwitansi={handleCetakKwitansi}
        />
      )}
    </div>
  );
}