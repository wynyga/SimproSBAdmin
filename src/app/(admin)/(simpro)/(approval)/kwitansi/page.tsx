"use client";

import React, { useEffect, useState, useCallback } from "react"; // 1. Impor useCallback
import { useRouter } from "next/navigation";
import { getPaginatedKwitansi, cetakKwitansi } from "../../../../../../utils/kwitansi";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import HistoryTransaksiKasTable from "@/components/simpro/transaksi kas/HistoryTransaksiKasTable";
import { getProfile } from "../../../../../../utils/auth";
import ComponentCard from "@/components/common/ComponentCard";

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

export default function HistoryTransaksiKasPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<KwitansiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [page] = useState(1);
  const [search] = useState("");
  const [, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const profile = await getProfile((err: string) => setError(err));
        setIsAllowed(profile && (profile.role === "Direktur" || profile.role === "Manager"));
      } catch {
        setError("Gagal memuat profil pengguna.");
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, []);

  // 2. Bungkus fungsi dengan useCallback dan tambahkan dependensinya
  const fetchKwitansi = useCallback(async () => {
    setLoading(true);
    const data = await getPaginatedKwitansi(page, search, (err) => setError(err));
    setTransactions(data?.data || []);
    setLoading(false);
  }, [page, search]); // Dependensi untuk useCallback

  useEffect(() => {
    fetchKwitansi();
  }, [fetchKwitansi]); // 3. Gunakan fungsi yang sudah di-memoize sebagai dependensi

  const handleCetakKwitansi = async (id: number) => {
    try {
      await cetakKwitansi(id);
    } catch (err) {
      console.error("Gagal cetak kwitansi:", err);
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Riwayat Transaksi Kas" />
      {loading ? (
        <p className="text-sm text-gray-500">Memuat data kwitansi...</p>
      ) : !isAllowed ? (
        <ComponentCard title="Akses Ditolak">
          <p className="text-sm text-red-500">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
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
        <HistoryTransaksiKasTable transactions={transactions} onCetakKwitansi={handleCetakKwitansi} />
      )}
    </div>
  );
}