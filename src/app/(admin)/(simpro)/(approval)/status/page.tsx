"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import TransaksiPenjualanTable from "@/components/simpro/TransaksiPenjualanTable/TransaksiPenjualanTable";
import { getPenjualanStatusBayar,getPenjualanStatusBayarByStatus } from "../../../../../../utils/penjualanStatusBayarApi";
import Select from "@/components/form/Select"; 

export default function StatusPenjualanPage() {
    const [transaksiList, setTransaksiList] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("all");
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async (status: string = "all") => {
      setLoading(true);
      setError(null);
  
      if (status === "all") {
        const data = await getPenjualanStatusBayar(setError);
        if (data) {
          setTransaksiList(data);
        }
      } else {
        const data = await getPenjualanStatusBayarByStatus(status, setError);
        if (data) {
          setTransaksiList(data);
        }
      }
  
      setLoading(false);
    };
  
    const handleFilterChange = async (value: string) => {
      setSelectedStatus(value);
      await fetchData(value);
    };
  
    const statusOptions = [
      { value: "all", label: "Semua Status" },
      { value: "lunas", label: "Lunas" },
      { value: "cicil", label: "Cicil" },
      { value: "utang", label: "Utang" },
    ];
  
    return (
      <div>
        <PageBreadcrumb pageTitle="Status Pembayaran Penjualan" />
        <ComponentCard title="Data Status Penjualan">
          <div className="mb-6 flex justify-end">
            <div className="w-full max-w-[250px] relative">
              <Select
                options={statusOptions}
                defaultValue={selectedStatus}
                onChange={handleFilterChange}
                placeholder="Pilih Status"
                className="dark:bg-dark-900"
              />
            </div>
          </div>
  
          <TransaksiPenjualanTable
            transaksiList={transaksiList}
            loading={loading}
            error={error}
          />
        </ComponentCard>
      </div>
    );
  }