"use client";

import React, { useEffect, useState } from "react";
import { getCostCenters,addCostCenter,updateCostCenter,deleteCostCenter } from "../../../../../../utils/costcenter";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import AddCostCenterModal from "@/components/simpro/laporan bulanan/cost center/AddCostCenterModal";
import EditCostCenterModal from "@/components/simpro/laporan bulanan/cost center/EditCostCenterModal";

interface CostCenter {
    id: number;
    cost_centre_code: string;
    description: string;
    cost_code: "KASIN" | "KASOUT";
  }
  
  export default function CostCenterPage() {
    const [costCenterList, setCostCenterList] = useState<CostCenter[]>([]);
    const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
  
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
  
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      fetchCostCenters();
    }, []);
  
    const fetchCostCenters = async () => {
      const data = await getCostCenters(setError);
      setCostCenterList(data || []);
    };
  
    const handleAdd = async (formData: {
      cost_centre_code: string;
      description: string;
      cost_code: "KASIN" | "KASOUT";
    }) => {
      await addCostCenter(formData, setError);
      await fetchCostCenters();
    };
  
    const handleUpdate = async () => {
      if (
        !selectedCostCenter ||
        !selectedCostCenter.cost_centre_code.trim() ||
        !selectedCostCenter.description.trim()
      ) {
        setError("Semua field harus diisi.");
        return false;
      }
      await updateCostCenter(selectedCostCenter.id, selectedCostCenter, setError);
      await fetchCostCenters();
      return true;
    };
  
    const handleDelete = async () => {
      if (deleteId !== null) {
        await deleteCostCenter(deleteId, setError);
        setDeleteId(null);
        setShowDeleteModal(false);
        await fetchCostCenters();
      }
    };
  
    return (
      <div className="min-h-screen px-4 xl:px-10">
        <PageBreadcrumb pageTitle="Manajemen Cost Center" />
        <ComponentCard title="Data Cost Center">
          <div className="flex justify-between items-center mb-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowAddModal(true)}
            >
              Tambah Cost Center
            </Button>
          </div>
  
          <div className="overflow-auto rounded border dark:border-gray-700">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
                <tr>
                  <th className="border px-4 py-2 text-left font-semibold">Kode</th>
                  <th className="border px-4 py-2 text-left font-semibold">Deskripsi</th>
                  <th className="border px-4 py-2 text-left font-semibold">Cost Code</th>
                  <th className="border px-4 py-2 text-left font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 dark:text-white">
                {costCenterList.length > 0 ? (
                  costCenterList.map((item) => (
                    <tr key={item.id} className="bg-white dark:bg-transparent">
                      <td className="border px-4 py-2">{item.cost_centre_code}</td>
                      <td className="border px-4 py-2">{item.description}</td>
                      <td className="border px-4 py-2">{item.cost_code}</td>
                      <td className="border px-4 py-2">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            onClick={() => {
                              setSelectedCostCenter(item);
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
                      Tidak ada data cost center.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ComponentCard>
  
        {/* Modals */}
        <AddCostCenterModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
          error={error}
        />
  
        {selectedCostCenter && (
          <EditCostCenterModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            costCenter={selectedCostCenter}
            setCostCenter={setSelectedCostCenter}
            onSubmit={handleUpdate}
            error={error}
          />
        )}
  
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          message="Apakah Anda yakin ingin menghapus cost center ini?"
        />
      </div>
    );
  }