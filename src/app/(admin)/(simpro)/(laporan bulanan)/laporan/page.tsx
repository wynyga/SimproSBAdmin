"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getLaporanBulanan,
  getJournalSummary,
  getGudangOutSummary,
  getStockInventory,
} from "../../../../../../utils/LaporanBulanan";
import { getProfile } from "../../../../../../utils/auth";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function LaporanBulananPage() {
  const router = useRouter();

  const [bulan, setBulan] = useState<number>(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState<number>(new Date().getFullYear());
  const [gudangOut, setGudangOut] = useState<{ code_account: string; total_rp: string }>({
    code_account: "",
    total_rp: "0",
  });
  const [inventory, setInventory] = useState<{ code_account: string; total_rp: string }>({
    code_account: "",
    total_rp: "0",
  });
  const [debit, setDebit] = useState<number>(0);
  const [kredit, setKredit] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [kasMasuk, setKasMasuk] = useState<number>(0);
  const [kasKeluar, setKasKeluar] = useState<number>(0);
  const [kasSisa, setKasSisa] = useState<number>(0);
  const [, setError] = useState<string | null>(null);

  const [isAllowed, setIsAllowed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const profile = await getProfile((err: string) => setError(err));
        if (profile?.role === "Direktur") {
          setIsAllowed(true);
        }
      } catch {
        setError("Gagal memuat profil pengguna.");
      } finally {
        setCheckingAccess(false);
      }
    };
    checkRole();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [laporan, jurnal, gudang, stok] = await Promise.all([
        getLaporanBulanan(bulan, tahun, setError),
        getJournalSummary(bulan, tahun, setError),
        getGudangOutSummary(bulan, tahun, setError),
        getStockInventory(bulan, tahun, setError),
      ]);

      let masuk = 0;
      let keluar = 0;

      if (Array.isArray(laporan)) {
        for (const item of laporan) {
          const costCode = item?.cost_tee?.cost_element?.cost_centre?.cost_code;
          if (costCode === "KASIN") masuk += Number(item.jumlah);
          if (costCode === "KASOUT") keluar += Number(item.jumlah);
        }
      }

      setKasMasuk(masuk);
      setKasKeluar(keluar);
      setKasSisa(masuk - keluar);

      setDebit(jurnal?.debit || 0);
      setKredit(jurnal?.kredit || 0);
      setSaldo(jurnal?.saldo || 0);

      setGudangOut({
        code_account: gudang?.pengeluaran_bahan?.code_account || "-",
        total_rp: gudang?.pengeluaran_bahan?.total_rp || "0",
      });

      setInventory({
        code_account: stok?.persediaan_bahan?.code_account || "-",
        total_rp: stok?.persediaan_bahan?.total_rp || "0",
      });
    } catch {
      setError("Gagal mengambil data.");
    }
  }, [bulan, tahun]);

  useEffect(() => {
    if (isAllowed) fetchData();
  }, [bulan, tahun, fetchData, isAllowed]);

  if (checkingAccess) {
    return <p className="text-sm text-gray-500 dark:text-white px-4 py-6">Memuat akses pengguna...</p>;
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen px-4 py-6">
        <PageBreadcrumb pageTitle="Laporan Bulanan" />
        <ComponentCard title="Akses Ditolak">
          <p className="text-sm text-red-500">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Kembali ke Dashboard
          </button>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Laporan Bulanan" />

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bulan:</label>
          <select
            value={bulan}
            onChange={(e) => setBulan(Number(e.target.value))}
            className="rounded border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
              </option>
            ))}
          </select>

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-4">Tahun:</label>
          <input
            type="number"
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            className="w-24 rounded border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

     {/* Ringkasan Jurnal */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-md">
          <h4 className="text-gray-600 dark:text-gray-300 font-medium">Total Debit</h4>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            Rp {debit.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-md">
          <h4 className="text-gray-600 dark:text-gray-300 font-medium">Total Kredit</h4>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            Rp {kredit.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-md">
          <h4 className="text-gray-600 dark:text-gray-300 font-medium">Saldo Akhir</h4>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            Rp {saldo.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Ringkasan Kas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-md">
          <h4 className="text-gray-600 dark:text-gray-300 font-medium">Kas Masuk</h4>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            Rp {kasMasuk.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-md">
          <h4 className="text-gray-600 dark:text-gray-300 font-medium">Kas Keluar</h4>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            Rp {kasKeluar.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-md">
          <h4 className="text-gray-600 dark:text-gray-300 font-medium">Sisa Kas</h4>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            Rp {kasSisa.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Gudang & Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-md">
          <h4 className="text-gray-600 dark:text-gray-300 font-medium">Pengeluaran Gudang</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">({gudangOut.code_account})</p>
          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
            Rp {gudangOut.total_rp}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow-md">
          <h4 className="text-gray-600 dark:text-gray-300 font-medium">Inventory Barang</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">({inventory.code_account})</p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
            Rp {Number(inventory.total_rp).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
}
