"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import GudangInTable from "@/components/simpro/gudang/GudangInTable";
import { getGudangHistory } from "../../../../../../../utils/stock";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";

interface GudangInItem {
  id: number;
  nama_barang: string;
  pengirim: string;
  no_nota: string;
  tanggal_barang_masuk: string;
  jumlah: number;
  status: string;
}

interface GudangHistory {
  gudang_in: GudangInItem[];
  gudang_out: unknown[];
}

export default function HistoryGudangInPage() {
  const [data, setData] = useState<GudangInItem[]>([]);
  const [filteredData, setFilteredData] = useState<GudangInItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    getGudangHistory(
      (result: GudangHistory) => {
        setData(result.gudang_in || []);
        setFilteredData(result.gudang_in || []);
      },
      (err: string) => setError(err)
    ).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...data];

    // Filter berdasarkan status
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter berdasarkan nama barang
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [statusFilter, searchTerm, data]);

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="History Gudang In" />
      <ComponentCard title="Riwayat Gudang In">
        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="w-full md:w-1/4">
            <Select
              options={statusOptions}
              defaultValue={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              placeholder="Filter Status"
            />
          </div>
          <div className="w-full md:w-1/3">
            <Input
              name="search"
              placeholder="Cari Nama Barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <GudangInTable gudangInList={filteredData} loading={loading} error={error} />
      </ComponentCard>
    </div>
  );
}