"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTransaksiKas } from "../../../../../utils/transaksi-kas";
import TransaksiKasForm from "@/components/simpro/transaksi kas/TransaksiKasForm";
import ComponentCard from "@/components/common/ComponentCard";
// Pastikan path ke hook Anda benar
import { useTransaksiKasForm } from "@/components/simpro/transaksi kas/useTransaksiKasForm";

interface KasData {
  saldoKas: number;
  totalCashIn: number;
  totalCashOut: number;
}

export default function TransaksiKasPage() {
  const [kasData, setKasData] = useState<KasData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingKas, setLoadingKas] = useState<boolean>(false);

  // Menggunakan hook form dengan props yang diperbarui
  const {
    formData,
    loading,
    optionsKeterangan,
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleJenisTransaksiChange, // Handler baru
    handleSubmit,
  } = useTransaksiKasForm(setError); // setError diteruskan ke hook

  useEffect(() => {
    fetchKas();
  }, []);

  const fetchKas = async () => {
    setError(null);
    setLoadingKas(true);
    await getTransaksiKas(setKasData, setError);
    setLoadingKas(false);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Transaksi Kas" />

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Ringkasan Kas */}
        <ComponentCard title="Ringkasan Transaksi Kas">
          {/* Tampilkan error dari hook DI SINI (atau di tempat lain) */}
          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          {loadingKas ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Memuat data...
            </p>
          ) : (
            kasData && (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-white">
                    Saldo Kas
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    Rp {kasData.saldoKas.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-white">
                    Total Pemasukan
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    Rp {Number(kasData.totalCashIn).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-white">
                    Total Pengeluaran
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    Rp {Number(kasData.totalCashOut).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )
          )}
        </ComponentCard>

        {/* Form Tambah Transaksi */}
        <div className="space-y-6">
          <TransaksiKasForm
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleDateChange={handleDateChange}
            handleJenisTransaksiChange={handleJenisTransaksiChange} // Prop baru
            // handleSelectSumber dihapus
            optionsKeterangan={optionsKeterangan}
            handleSubmit={async (e) => {
              await handleSubmit(e);
              // Refresh saldo kas HANYA JIKA submit berhasil
              // (Hook useTransaksiKasForm akan me-lempar error jika gagal,
              // jadi fetchKas() hanya berjalan jika sukses)
              fetchKas();
            }}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}