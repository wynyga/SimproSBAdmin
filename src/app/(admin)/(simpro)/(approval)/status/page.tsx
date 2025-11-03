"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import TransaksiPenjualanTable from "@/components/simpro/TransaksiPenjualanTable/TransaksiPenjualanTable";
import { getPenjualanStatusBayar } from "../../../../../../utils/penjualanStatusBayarApi";

export default function UnitLakuPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const data = await getPenjualanStatusBayar(setError);
    if (data) {
      setTransaksiList(data);
    }

    setLoading(false);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Unit Terjual" />
      <ComponentCard title="Data Penjualan Unit">
        <TransaksiPenjualanTable
          transaksiList={transaksiList}
          loading={loading}
          error={error}
        />
      </ComponentCard>
    </div>
  );
}