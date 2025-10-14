"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getLaporanTahunan } from "../../../../../../utils/LaporanTahunan";
import LaporanTahunanTable from "@/components/simpro/laporan tahunan/LaporanTahunanTable";

// Tipe-tipe ini sebaiknya berada di file terpusat (e.g., src/types/laporan.ts)
// dan di-import di sini serta di komponen lainnya.
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
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {error && (
          <p className="text-red-500 mb-4 font-medium">Error: {error}</p>
        )}
        {!data && !error && <p className="text-gray-500">Loading...</p>}
        {data && <LaporanTahunanTable data={data} />}
      </div>
    </div>
  );
}