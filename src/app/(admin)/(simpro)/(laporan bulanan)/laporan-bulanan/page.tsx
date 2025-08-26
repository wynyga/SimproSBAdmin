"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { FaDownload } from "react-icons/fa";
import { getLaporanKas } from "../../../../../../utils/LaporanBulanan";

// --- Tipe data yang diperbarui ---
interface Transaction {
  no: number;
  postingDate: string;
  postingTime: string;
  effDate: string;
  effTime: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

interface LaporanData {
  company: string;
  accountOrganizationUnit: string;
  period: string;
  transactions_list: Transaction[];
  startingBalance: number;
  endingBalance: number;
  total_debit: {
    count: number;
    amount: number;
  };
  totalTransactionDebit:number;
  totalTransactionCredit:number;
}

const bulanList = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function LaporanBulananPage() {
  const tahunAwal = 2020;
  const tahunSekarang = new Date().getFullYear();
  const daftarTahun = Array.from({ length: tahunSekarang - tahunAwal + 1 }, (_, i) => tahunSekarang - i);
  
  const [laporan, setLaporan] = useState<LaporanData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBulan, setSelectedBulan] = useState(new Date().getMonth() + 1);
  const [selectedTahun, setSelectedTahun] = useState(tahunSekarang);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLaporanKas(selectedBulan, selectedTahun, setError);
        
        if (data) {
          setLaporan(data);
        } else {
          setLaporan(null);
        }
      } catch (e) {
        setError("Gagal memuat data laporan.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBulan, selectedTahun]);

  if (loading) {
    return (
      <p className="text-sm text-gray-500 dark:text-white px-4 py-6">
        Memuat laporan bulanan...
      </p>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-4 py-6">
        <PageBreadcrumb pageTitle="Laporan Bulanan" />
        <ComponentCard title="Laporan Bulanan">
          <p className="text-sm text-red-500">
            Terjadi kesalahan: {error}
          </p>
        </ComponentCard>
      </div>
    );
  }

  if (!laporan) {
    return (
      <div className="min-h-screen px-4 py-6">
        <PageBreadcrumb pageTitle="Laporan Bulanan" />
        <ComponentCard title="Laporan Bulanan">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tidak ada data laporan yang tersedia.
          </p>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Laporan Bulanan" />
      <ComponentCard 
        title="Rekening Koran" 
        className="bg-blue-100 dark:bg-card"
      >
        {/* Dropdown untuk Bulan dan Tahun */}
        <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
          <select
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {bulanList.map((namaBulan, index) => (
              <option key={index} value={index + 1}>
                {namaBulan}
              </option>
            ))}
          </select>
          <select
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {daftarTahun.map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>
        </div>

        {/* Header Informasi Perusahaan - Gaya Mendatar */}
        <div className="mb-6 rounded-md bg-gray-50 dark:bg-gray-800 p-4 shadow-sm">
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex">
              <span className="w-56 font-semibold">Company</span>
              <span className="mx-2">:</span>
              <span>{laporan.company}</span>
            </div>
            <div className="flex">
              <span className="w-56 font-semibold">Account Organization Unit</span>
              <span className="mx-2">:</span>
              <span>{laporan.accountOrganizationUnit}</span>
            </div>
            <div className="flex">
              <span className="w-56 font-semibold">Period</span>
              <span className="mx-2">:</span>
              <span>{laporan.period}</span>
            </div>
            <div className="flex">
              <span className="w-56 font-semibold">Starting Balance</span>
              <span className="mx-2">:</span>
              <span>{formatRupiah(laporan.startingBalance)}</span>
            </div>
            <div className="flex">
              <span className="w-56 font-semibold">Ending Balance</span>
              <span className="mx-2">:</span>
              <span>{formatRupiah(laporan.endingBalance)}</span>
            </div>
            <div className="flex">
              <span className="w-56 font-semibold">Total Transaction Debit</span>
              <span className="mx-2">:</span>
              <span>{laporan.totalTransactionDebit}</span>
            </div>
            <div className="flex">
              <span className="w-56 font-semibold">Total Transaction Credit</span>
              <span className="mx-2">:</span>
              <span>{laporan.totalTransactionCredit}</span>
            </div>
          </div>
        </div>

        {/* Tabel Data Transaksi */}
        <div className="overflow-auto rounded-lg border dark:border-gray-700">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="border-r px-4 py-2 font-semibold">No.</th>
                <th className="border-r px-4 py-2 font-semibold">Posting Date</th>
                <th className="border-r px-4 py-2 font-semibold">Posting Time</th>
                <th className="border-r px-4 py-2 font-semibold">Eff Date</th>
                <th className="border-r px-4 py-2 font-semibold">Eff Time</th>
                <th className="border-r px-4 py-2 font-semibold">Description</th>
                <th className="border-r px-4 py-2 font-semibold">Debit</th>
                <th className="border-r px-4 py-2 font-semibold">Credit</th>
                <th className="px-4 py-2 font-semibold">Balance</th> 
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-transparent text-gray-800 dark:text-white">
              {/* Add a check for laporan.transactions_list before using it */}
              {laporan.transactions_list && laporan.transactions_list.length > 0 ? (
                laporan.transactions_list.map((transaction) => (
                  <tr key={transaction.no} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="border-r px-4 py-2">{transaction.no}</td>
                    <td className="border-r px-4 py-2">{transaction.postingDate}</td>
                    <td className="border-r px-4 py-2">{transaction.postingTime}</td>
                    <td className="border-r px-4 py-2">{transaction.effDate}</td>
                    <td className="border-r px-4 py-2">{transaction.effTime}</td>
                    <td className="border-r px-4 py-2 max-w-xs">{transaction.description}</td>
                    <td className="border-r px-4 py-2 text-right">
                      {transaction.debit > 0 ? formatRupiah(transaction.debit) : "-"}
                    </td>
                    <td className="border-r px-4 py-2 text-right">
                      {transaction.credit > 0 ? formatRupiah(transaction.credit) : "-"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatRupiah(transaction.balance)}
                    </td> 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Tidak ada transaksi untuk periode ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  );
}