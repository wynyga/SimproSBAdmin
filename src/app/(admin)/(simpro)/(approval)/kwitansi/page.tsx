"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPaginatedKwitansi, cetakKwitansi } from "../../../../../../utils/kwitansi";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import HistoryTransaksiKasTable from "@/components/simpro/transaksi kas/HistoryTransaksiKasTable";
import { getProfile } from "../../../../../../utils/auth";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button"; // <-- BARU: Impor Tombol untuk paginasi

// --- Interface dari API ---
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

// <-- BARU: Interface untuk metadata paginasi dari API
interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}
// ---

// <-- BARU: Hook sederhana untuk debounce (menunda eksekusi)
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timeout untuk update value setelah delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Bersihkan timeout jika value berubah (mencegah eksekusi)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function HistoryTransaksiKasPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<KwitansiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [, setCheckingAccess] = useState(true);

  // --- State untuk Paginasi & Search ---
  const [page, setPage] = useState(1); // <-- DIUBAH: Menjadi state dinamis
  const [perPage] = useState(20); // <-- BARU: Sesuai permintaan Anda
  const [searchTerm, setSearchTerm] = useState(""); // <-- BARU: State untuk inputan user
  const debouncedSearch = useDebounce(searchTerm, 500); // <-- BARU: State debounced (delay 500ms)
  const [meta, setMeta] = useState<PaginationMeta | null>(null); // <-- BARU: Untuk menyimpan info paginasi
  // ---

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

  // DIUBAH: fetchKwitansi sekarang menggunakan semua state baru
  const fetchKwitansi = useCallback(async () => {
    if (!isAllowed) return; // Jangan fetch jika tidak diizinkan

    setLoading(true);
    setError(null); // Bersihkan error sebelumnya

    // Panggil API dengan parameter paginasi, search, dan perPage
    const data = await getPaginatedKwitansi(
      page,
      debouncedSearch,
      perPage,
      (err) => setError(err) // Callback error dari file fetch
    );

    setTransactions(data?.data || []); // Data kwitansi ada di 'data.data'
    setMeta(data?.meta || null);     // Info paginasi ada di 'data.meta'
    setLoading(false);
  }, [page, debouncedSearch, perPage, isAllowed]); // <-- DIUBAH: Dependensi baru

  useEffect(() => {
    fetchKwitansi();
  }, [fetchKwitansi]); // Dependensi ini sudah benar

  // <-- BARU: Reset ke halaman 1 setiap kali user mengubah pencarian
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleCetakKwitansi = async (id: number) => {
    try {
      await cetakKwitansi(id);
    } catch (err) {
      console.error("Gagal cetak kwitansi:", err);
      // Tambahkan notifikasi error ke user jika perlu
    }
  };

  // <-- BARU: Fungsi untuk merender UI kontrol (Search & Paginasi)
  const renderControls = () => (
    <div className="my-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
      {/* Input Pencarian */}
      <input
        type="text"
        placeholder="Cari (No. Dok, Keterangan...)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 sm:w-1/3"
      />

      {/* Kontrol Paginasi */}
      {meta && meta.last_page > 1 && ( // Hanya tampilkan jika lebih dari 1 halaman
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || loading}
            size="sm"
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Halaman {meta.current_page} dari {meta.last_page}
          </span>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === meta.last_page || loading}
            size="sm"
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  );
  // ---

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Riwayat Transaksi Kas" />

      {/* DIUBAH: Logika loading hanya untuk tampilan awal */}
      {loading && page === 1 && !meta ? (
        <p className="text-sm text-gray-500">Memuat data kwitansi...</p>
      ) : !isAllowed && !setCheckingAccess ? ( // Pastikan pengecekan selesai
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
        // --- Tampilan Utama Jika Sukses ---
        <>
          {/* Tampilkan Kontrol di atas tabel */}
          {renderControls()}

          {/* Tampilkan status loading saat ganti halaman/search */}
          {loading && (
            <p className="py-4 text-center text-sm text-gray-500">Memuat...</p>
          )}

          {/* Tampilkan tabel jika tidak loading DAN ada data */}
          {!loading && transactions.length > 0 && (
            <HistoryTransaksiKasTable
              transactions={transactions}
              onCetakKwitansi={handleCetakKwitansi}
            />
          )}

          {/* Tampilkan pesan jika tidak loading DAN tidak ada data */}
          {!loading && transactions.length === 0 && (
            <div className="rounded border bg-white p-6 text-center text-gray-500 dark:border-gray-700 dark:bg-transparent">
              {debouncedSearch
                ? `Tidak ada data ditemukan untuk "${debouncedSearch}".`
                : "Tidak ada data kwitansi."}
            </div>
          )}
        </>
      )}
    </div>
  );
}