"use client";

import React, { useEffect, useState } from "react";
import { getCostElements,addCostElement,updateCostElement,deleteCostElement } from "../../../../../../utils/CostElementApi";
import { getCostCenters } from "../../../../../../utils/costcenter";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import AddCostElementModal from "@/components/simpro/laporan bulanan/cost element/AddCostElementModal";
import EditCostElementModal from "@/components/simpro/laporan bulanan/cost element/EditCostElementModal";

interface CostElement {
  id: number;
  cost_centre_code: string;
  cost_element_code: string;
  description: string;
}

interface CostCenter {
  id: number;
  name: string;
  cost_centre_code: string;
}

export default function CostElementPage() {
  const [costElements, setCostElements] = useState<CostElement[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [selectedCostElement, setSelectedCostElement] = useState<CostElement | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCostElements();
    fetchCostCenters();
  }, []);

  const fetchCostElements = async () => {
    const data = await getCostElements(setError);
    setCostElements(data || []);
  };

  const fetchCostCenters = async () => {
    const data = await getCostCenters(setError);
    setCostCenters(data || []);
  };

  const handleAdd = async (formData: {
    cost_centre_code: string;
    cost_element_code: string;
    description: string;
  }) => {
    await addCostElement(formData, setError);
    await fetchCostElements();
  };

  const handleUpdate = async () => {
    if (!selectedCostElement || !selectedCostElement.description.trim()) {
      setError("Deskripsi tidak boleh kosong.");
      return false;
    }
    await updateCostElement(selectedCostElement.id, selectedCostElement, setError);
    await fetchCostElements();
    return true;
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteCostElement(deleteId, setError);
      setDeleteId(null);
      setShowDeleteModal(false);
      await fetchCostElements();
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Manajemen Cost Element" />
      <ComponentCard title="Data Cost Element">
        <div className="flex justify-between items-center mb-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            Tambah Cost Element
          </Button>
        </div>

        <div className="overflow-auto rounded border dark:border-gray-700">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="border px-4 py-2 text-left font-semibold">Cost Element Code</th>
                <th className="border px-4 py-2 text-left font-semibold">Cost Center</th>
                <th className="border px-4 py-2 text-left font-semibold">Deskripsi</th>
                <th className="border px-4 py-2 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-white">
              {costElements.length > 0 ? (
                costElements.map((item) => (
                  <tr key={item.id} className="bg-white dark:bg-transparent">
                    <td className="border px-4 py-2">{item.cost_element_code}</td>
                    <td className="border px-4 py-2">{item.cost_centre_code}</td>
                    <td className="border px-4 py-2">{item.description}</td>
                    <td className="border px-4 py-2">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          onClick={() => {
                            setSelectedCostElement(item);
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
                    Tidak ada data cost element.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <AddCostElementModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        fetchCostCenters={fetchCostCenters}
        costCenters={costCenters}
        error={error}
      />

      {selectedCostElement && (
        <EditCostElementModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          costElement={selectedCostElement}
          setCostElement={setSelectedCostElement}
          onSubmit={handleUpdate}
          error={error}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus cost element ini?"
      />
    </div>
  );
}
