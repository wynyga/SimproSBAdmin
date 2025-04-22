"use client";

import React, { useEffect, useState } from "react";
import { getLaporanBulanan,addLaporanBulanan,updateLaporanBulanan,deleteLaporanBulanan } from "../../../../../../utils/LaporanBulanan";
import { getCostTees } from "../../../../../../utils/CostTeeApi";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import AddLaporanBulananModal from "@/components/simpro/laporan bulanan/laporan bulanan/AddLaporanBulananModal";
import EditLaporanBulananModal from "@/components/simpro/laporan bulanan/laporan bulanan/EditLaporanBulananModal";

interface LaporanBulanan {
  id: number;
  cost_tee_id: number;
  bulan: number;
  tahun: number;
  jumlah: number;
  cost_tee?: {
    description: string;
    cost_tee_code: string;
  };
}

interface CostTee {
  id: number;
  cost_tee_code: string;
  description: string;
}

export default function LaporanBulananPage() {
  const [laporanList, setLaporanList] = useState<LaporanBulanan[]>([]);
  const [costTees, setCostTees] = useState<CostTee[]>([]);
  const [selectedLaporan, setSelectedLaporan] = useState<LaporanBulanan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLaporan();
    fetchCostTees();
  }, []);

  const fetchLaporan = async () => {
    const data = await getLaporanBulanan(setError);
    setLaporanList(data || []);
  };

  const fetchCostTees = async () => {
    const data = await getCostTees(setError);
    setCostTees(data || []);
  };

  const handleAdd = async (formData: {
    cost_tee_id: number;
    bulan: number;
    tahun: number;
    jumlah: number;
  }) => {
    await addLaporanBulanan(formData, setError);
    await fetchLaporan();
  };

  const handleUpdate = async () => {
    if (!selectedLaporan || !selectedLaporan.jumlah) return false;
    await updateLaporanBulanan(selectedLaporan.id, selectedLaporan, setError);
    await fetchLaporan();
    return true;
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteLaporanBulanan(deleteId, setError);
      setDeleteId(null);
      setShowDeleteModal(false);
      await fetchLaporan();
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Manajemen Laporan Bulanan" />
      <ComponentCard title="Data Laporan Bulanan">
        <div className="flex justify-between items-center mb-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            Tambah Laporan
          </Button>
        </div>

        <div className="overflow-auto rounded border dark:border-gray-700">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="border px-4 py-2 text-left font-semibold">Kode Cost Tee</th>
                <th className="border px-4 py-2 text-left font-semibold">Deskripsi</th>
                <th className="border px-4 py-2 text-left font-semibold">Bulan</th>
                <th className="border px-4 py-2 text-left font-semibold">Tahun</th>
                <th className="border px-4 py-2 text-left font-semibold">Jumlah (Rp)</th>
                <th className="border px-4 py-2 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-white">
              {laporanList.length > 0 ? (
                laporanList.map((item) => (
                  <tr key={item.id} className="bg-white dark:bg-transparent">
                    <td className="border px-4 py-2">{item.cost_tee?.cost_tee_code || "-"}</td>
                    <td className="border px-4 py-2">{item.cost_tee?.description || "-"}</td>
                    <td className="border px-4 py-2">{item.bulan}</td>
                    <td className="border px-4 py-2">{item.tahun}</td>
                    <td className="border px-4 py-2">
                      Rp {Number(item.jumlah).toLocaleString("id-ID")}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          onClick={() => {
                            setSelectedLaporan(item);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            setDeleteId(item.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Tidak ada data laporan bulanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <AddLaporanBulananModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        fetchCostTees={fetchCostTees}
        costTees={costTees}
        error={error}
      />

      {selectedLaporan && (
        <EditLaporanBulananModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          laporan={selectedLaporan}
          setLaporan={setSelectedLaporan}
          onSubmit={handleUpdate}
          error={error}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus laporan ini?"
      />
    </div>
  );
}