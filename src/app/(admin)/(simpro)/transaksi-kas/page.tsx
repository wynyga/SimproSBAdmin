"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTransaksiKas } from "../../../../../utils/transaksi-kas";
import TransaksiKasForm from "@/components/simpro/transaksi kas/TransaksiKasForm";
import ComponentCard from "@/components/common/ComponentCard";
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

  // Gunakan hook form yang baru
  const {
    formData,
    loading,
    optionsKeterangan,
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleSelectSumber,
    handleSubmit,
  } = useTransaksiKasForm(setError);

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
          {error && <p className="text-sm text-red-500">{error}</p>}

          {loadingKas ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
          ) : (
            kasData && (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-white">Saldo Kas</span>
                  <span className="text-gray-900 dark:text-white">
                    Rp {kasData.saldoKas.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-white">Total Pemasukan</span>
                  <span className="text-gray-900 dark:text-white">
                    Rp {kasData.totalCashIn.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-white">Total Pengeluaran</span>
                  <span className="text-gray-900 dark:text-white">
                    Rp {kasData.totalCashOut.toLocaleString("id-ID")}
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
            handleSelectSumber={handleSelectSumber}
            optionsKeterangan={optionsKeterangan}
            handleSubmit={async (e) => {
              await handleSubmit(e);
              fetchKas(); // Refresh saldo kas setelah berhasil tambah transaksi
            }}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
