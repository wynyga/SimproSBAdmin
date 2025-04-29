"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { getLaporanTahunan } from "../../../../../../utils/LaporanBulanan";

const bulanList = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function LaporanTahunanPage() {
  const tahunAwal = 2020;
  const tahunSekarang = new Date().getFullYear();
  const daftarTahun = Array.from(
    { length: tahunSekarang - tahunAwal + 1 },
    (_, i) => tahunSekarang - i
  );

  const [laporan, setLaporan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [tahun, setTahun] = useState<number>(tahunSekarang);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLaporanTahunan(tahun, setError);
      if (data) setLaporan(data);
    };
    fetchData();
  }, [tahun]);

  const toggleAccordion = (bulan: number) => {
    setOpenAccordion(openAccordion === bulan ? null : bulan);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Tahunan" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mb-8 flex flex-col items-center justify-center gap-4">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Ringkasan Keuangan Tahun {tahun}
          </h3>
          <select
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {daftarTahun.map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded bg-red-100 p-4 text-center text-red-700 dark:bg-red-800 dark:text-red-100">
            {error}
          </div>
        )}

        {!laporan && !error && (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        )}

        {laporan && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Total Kas Masuk</h4>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">Rp {laporan.total_kas_masuk.total_rp}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Total Kas Keluar</h4>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">Rp {laporan.total_kas_keluar.total_rp}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Sisa Kas</h4>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">Rp {laporan.sisa_kas.total_rp}</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${laporan.sisa_kas.status === "SURPLUS" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"}`}
                >
                  {laporan.sisa_kas.status}
                </span>
              </div>
            </div>

            {/* Accordion per Bulan */}
            <div className="mt-10 space-y-4">
              {bulanList.map((namaBulan, index) => (
                <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-white/[0.05]">
                  <button
                    onClick={() => toggleAccordion(index + 1)}
                    className="w-full px-6 py-4 text-left text-lg font-medium text-gray-800 dark:text-white"
                  >
                    {namaBulan}
                  </button>
                  {openAccordion === index + 1 && (
                    <div className="px-6 pb-4">
                      {laporan.rekap_detail && laporan.rekap_detail[index + 1] ? (
                        <table className="w-full table-auto text-sm">
                          <thead>
                            <tr className="text-gray-600 dark:text-gray-300">
                              <th className="py-2 text-left">Kategori</th>
                              <th className="py-2 text-left">Jenis</th>
                              <th className="py-2 text-right">Jumlah (Rp)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {laporan.rekap_detail[index + 1].map((item: any, idx: number) => (
                              <tr key={idx}>
                                <td className="py-1 text-gray-700 dark:text-gray-200">{item.kategori}</td>
                                <td className="py-1 text-sm text-gray-500 dark:text-gray-400">
                                  {item.jenis === "KASIN" ? "Kas Masuk" : item.jenis === "KASOUT" ? "Kas Keluar" : "-"}
                                </td>
                                <td className="py-1 text-right text-gray-700 dark:text-gray-200">
                                  {item.jumlah.toLocaleString("id-ID")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada data bulan ini.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
