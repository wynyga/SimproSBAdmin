"use client";

import React, { useEffect, useState, useRef } from "react"; // 1. Import useRef
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getLaporanTahunan } from "../../../../../../utils/LaporanTahunan";
import LaporanTahunanTable from "@/components/simpro/laporan tahunan/LaporanTahunanTable";
import { useReactToPrint } from "react-to-print"; // 2. Import hook

// ... (Interface KASIN, KASOUT, dll. tetap sama) ...

interface TeeData {
  cost_tee_code: string;
  description: string;
  jumlah: number | string;
}

interface CostElementData {
  cost_element_code: string;
  description: string;
  total: number;
  tees: TeeData[];
}

interface CostCentreData {
  cost_centre_code: string;
  description: string;
  total: number;
  elements: CostElementData[];
}

interface LaporanTahunanData {
  KASIN: CostCentreData[];
  KASOUT: CostCentreData[];
}

export default function LaporanTahunanPage() {
  const [data, setData] = useState<LaporanTahunanData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 3. Setup ref untuk area cetak
  const printRef = useRef<HTMLDivElement>(null);

  // 4. Konfigurasi handlePrint (sesuai versi Anda sebelumnya)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Laporan Tahunan",
    pageStyle: `
      @page {
        size: A4 portrait; /* Sesuai permintaan: Portrait */
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact; /* Memaksa warna/bg dicetak */
        }
        table {
           /* Pastikan tabel tidak terpotong antar halaman jika memungkinkan */
           page-break-inside: auto;
        }
        tr {
           page-break-inside: avoid;
           page-break-after: auto;
        }
      }
    `,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result: LaporanTahunanData | null = await getLaporanTahunan(
        2025,
        setError
      );
      if (result) setData(result);
    };
    fetchData();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Tahunan" />
      
      {/* 5. Tambahkan tombol cetak */}
      <button
        onClick={handlePrint}
        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 print:hidden"
      >
        Cetak PDF (Portrait)
      </button>

      {/* 6. Pasang ref ke div yang membungkus konten cetak */}
      <div
        ref={printRef}
        className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
      >
        {error && (
          <p className="text-red-500 mb-4 font-medium">Error: {error}</p>
        )}
        {!data && !error && <p className="text-gray-500">Loading...</p>}
        {data && <LaporanTahunanTable data={data} />}
      </div>
    </div>
  );
}