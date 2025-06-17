"use client";

import React from "react";
import Image from "next/image";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function DashboardPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="text-center mb-10">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo/icon.png"
              alt="Logo PT. Bumi Asih"
              width={80}
              height={80}
              className="rounded-full"
              priority
            />
          </div>

          {/* Judul dan Slogan */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Selamat Datang di Sistem Informasi Proyek Properti
          </h1>
          <h2 className="text-xl mt-2 text-gray-600 dark:text-white/70">
            <span className="font-semibold">PT. Bumi Asih</span>
          </h2>
          {/* PERBAIKAN DI SINI */}
          <p className="mt-3 text-gray-500 dark:text-gray-400 italic">
            &ldquo;Mitra Keluarga Bahagia&rdquo;
          </p>
        </div>

        {/* Fitur Utama */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Transaksi Keuangan</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Kelola pemasukan, pengeluaran, dan laba rugi dengan cepat dan efisien.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Manajemen Stok Gudang</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Pantau stok material dan barang masuk-keluar dari setiap cabang (CBU).
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Laporan Keuangan</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Hasilkan laporan bulanan dan tahunan secara otomatis dan akurat.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-white/60 text-sm">
            Dikelola oleh <strong>Divisi IT PT. Bumi Asih</strong> • Versi 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}