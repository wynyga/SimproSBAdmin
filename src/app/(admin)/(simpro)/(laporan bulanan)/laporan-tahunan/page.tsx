"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getLaporanTahunan } from "../../../../../../utils/LaporanTahunan"; 
import LaporanTahunanTable from "@/components/simpro/laporan tahunan/LaporanTahunanTable";

export default function LaporanTahunanPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getLaporanTahunan(2025, setError);
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
