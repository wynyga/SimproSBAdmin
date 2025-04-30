"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "../../../../../../utils/auth";
import {
  getCostTees,
  addCostTee,
  updateCostTee,
  deleteCostTee,
} from "../../../../../../utils/CostTeeApi";
import { getCostElements } from "../../../../../../utils/CostElementApi";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import AddCostTeeModal from "@/components/simpro/laporan bulanan/cost tee/AddCostTeeModal";
import EditCostTeeModal from "@/components/simpro/laporan bulanan/cost tee/EditCostTeeModal";

interface CostTee {
  id: number;
  cost_tee_code: string;
  cost_element_code: string;
  description: string;
}

interface CostElement {
  id: number;
  cost_element_code: string;
  description: string;
}

export default function CostTeePage() {
  const router = useRouter();

  const [costTees, setCostTees] = useState<CostTee[]>([]);
  const [costElements, setCostElements] = useState<CostElement[]>([]);
  const [selectedCostTee, setSelectedCostTee] = useState<CostTee | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    if (isAllowed) {
      fetchCostTees();
      fetchCostElements();
    }
  }, [isAllowed]);

  const checkAccess = async () => {
    try {
      const profile = await getProfile((err: string) => setError(err));
      if (profile && (profile.role === "Direktur" || profile.role === "Manager")) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } catch {
      setError("Gagal memuat profil pengguna.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCostTees = async () => {
    const data = await getCostTees(setError);
    setCostTees(data || []);
  };

  const fetchCostElements = async () => {
    const data = await getCostElements(setError);
    setCostElements(data || []);
  };

  const handleAdd = async (formData: {
    cost_tee_code: string;
    cost_element_code: string;
    description: string;
  }) => {
    await addCostTee(formData, setError);
    await fetchCostTees();
  };

  const handleUpdate = async () => {
    if (!selectedCostTee || !selectedCostTee.description.trim()) {
      setError("Deskripsi tidak boleh kosong.");
      return false;
    }
    await updateCostTee(selectedCostTee.id, selectedCostTee, setError);
    await fetchCostTees();
    return true;
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteCostTee(deleteId, setError);
      setDeleteId(null);
      setShowDeleteModal(false);
      await fetchCostTees();
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Manajemen Cost Tee" />

      {loading ? (
        <p className="text-sm text-gray-500">Memuat akses pengguna...</p>
      ) : !isAllowed ? (
        <ComponentCard title="Akses Ditolak">
          <p className="text-sm text-red-500">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Kembali ke Dashboard
          </button>
        </ComponentCard>
      ) : (
        <>
          <ComponentCard title="Data Cost Tee">
            <div className="flex justify-between items-center mb-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAddModal(true)}
              >
                Tambah Cost Tee
              </Button>
            </div>

            <div className="overflow-auto rounded border dark:border-gray-700">
              <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
                  <tr>
                    <th className="border px-4 py-2 text-left font-semibold">Cost Tee Code</th>
                    <th className="border px-4 py-2 text-left font-semibold">Cost Element</th>
                    <th className="border px-4 py-2 text-left font-semibold">Deskripsi</th>
                    <th className="border px-4 py-2 text-left font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 dark:text-white">
                  {costTees.length > 0 ? (
                    costTees.map((item) => (
                      <tr key={item.id} className="bg-white dark:bg-transparent">
                        <td className="border px-4 py-2">{item.cost_tee_code}</td>
                        <td className="border px-4 py-2">{item.cost_element_code}</td>
                        <td className="border px-4 py-2">{item.description}</td>
                        <td className="border px-4 py-2">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              size="sm"
                              className="bg-yellow-500 hover:bg-yellow-600 text-white"
                              onClick={() => {
                                setSelectedCostTee(item);
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
                      <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">
                        Tidak ada data cost tee.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ComponentCard>

          <AddCostTeeModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
            fetchCostElements={fetchCostElements}
            costElements={costElements}
            error={error}
          />

          {selectedCostTee && (
            <EditCostTeeModal
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              costTee={selectedCostTee}
              setCostTee={setSelectedCostTee}
              onSubmit={handleUpdate}
              error={error}
            />
          )}

          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            message="Apakah Anda yakin ingin menghapus cost tee ini?"
          />
        </>
      )}
    </div>
  );
}
