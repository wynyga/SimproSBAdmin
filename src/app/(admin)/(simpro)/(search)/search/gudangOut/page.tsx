"use client";

import React, { useEffect, useState,useMemo } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import GudangOutTable from "@/components/simpro/gudang/GudangOutTable";
import { getGudangHistory } from "../../../../../../../utils/stock";
import { getCostTees } from "../../../../../../../utils/CostTeeApi";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";

interface GudangOutItem {
  id: number;
  nama_barang: string;
  peruntukan: string;
  tanggal: string;
  jumlah: number;
  keterangan?: string;
  status: string;
}

interface CostTee {
  id: number;
  description: string;
}

export default function HistoryGudangOutPage() {
  const [gudangOutList, setGudangOutList] = useState<GudangOutItem[]>([]);
  const [costTees, setCostTees] = useState<CostTee[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistoryGudangOut();
  }, []);

  const fetchHistoryGudangOut = async () => {
    setLoading(true);
    setError(null);

    await getGudangHistory((result: { gudang_out: GudangOutItem[] }) => {
      setGudangOutList(result.gudang_out || []);
    }, setError);

    const tees = await getCostTees(setError);
    if (tees) setCostTees(tees);

    setLoading(false);
  };

  const filteredList = useMemo(() => {
    return gudangOutList
      .filter((item) =>
        statusFilter === "all" ? true : item.status === statusFilter
      )
      .filter((item) =>
        item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [gudangOutList, statusFilter, searchTerm]);

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Riwayat Gudang Keluar" />

      <ComponentCard title="History Barang Keluar">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter Status"
          />
          <Input
            placeholder="Cari Nama Barang"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <GudangOutTable
          gudangOutList={filteredList}
          costTees={costTees}
          loading={loading}
          error={error}
        />
      </ComponentCard>
    </div>
  );
}