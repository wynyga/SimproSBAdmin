"use client";

import React, { useEffect, useState } from "react";
import { getTipeRumah,deleteTipeRumah,updateTipeRumah,addTipeRumah } from "../../../../../../utils/tipeRumah";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import AddTipeRumahModal from "@/components/simpro/penjualan/AddTipeRumahModal";
import EditTipeRumahModal from "@/components/simpro/penjualan/EditTipeRumahModal";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";

interface TipeRumah {
  id: number;
  tipe_rumah: string;
  luas_bangunan: number;
  luas_kavling: number;
  harga_standar_tengah: number;
  harga_standar_sudut: number;
  penambahan_bangunan: number;
}

export default function TipeRumahPage() {
  const [tipeRumah, setTipeRumah] = useState<TipeRumah[]>([]);
  const [selectedTipe, setSelectedTipe] = useState<TipeRumah | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTipeRumah();
  }, []);

  const fetchTipeRumah = async () => {
    const data = await getTipeRumah(setErrorMessage);
    setTipeRumah(data || []);
  };

  const handleAdd = async (data: Omit<TipeRumah, "id">) => {
    setErrorMessage(null);
    await addTipeRumah(data, setErrorMessage);
    await fetchTipeRumah();
  };

  const handleEdit = async () => {
    setErrorMessage(null);
    setValidationErrors({});
    if (!selectedTipe) return false;

    const emptyFields = [
      "tipe_rumah",
      "luas_bangunan",
      "luas_kavling",
      "harga_standar_tengah",
      "harga_standar_sudut",
      "penambahan_bangunan",
    ].filter((field) => !selectedTipe[field as keyof TipeRumah] && selectedTipe[field as keyof TipeRumah] !== 0);

    if (emptyFields.length > 0) {
      const errorMap = emptyFields.reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setValidationErrors(errorMap);
      setErrorMessage("Semua field wajib diisi.");
      return false;
    }

    await updateTipeRumah(selectedTipe.id, selectedTipe, setErrorMessage);
    await fetchTipeRumah();
    return true;
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteTipeRumah(deleteId, setErrorMessage);
      await fetchTipeRumah();
      setShowDeleteModal(false); // ← ini yang ditambahkan
    }
  };
  

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Manajemen Tipe Rumah" />
      <ComponentCard title="Data Tipe Rumah">
        <div className="flex justify-between items-center mb-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            Tambah Tipe Rumah
          </Button>
        </div>

        <div className="overflow-auto rounded border dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-white text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Nama</th>
                <th className="px-4 py-2">Luas Bangunan</th>
                <th className="px-4 py-2">Luas Kavling</th>
                <th className="px-4 py-2">Harga Tengah</th>
                <th className="px-4 py-2">Harga Sudut</th>
                <th className="px-4 py-2">Penambahan</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-white">
              {tipeRumah.length > 0 ? (
                tipeRumah.map((tipe) => (
                  <tr key={tipe.id}>
                    <td className="px-4 py-2">{tipe.tipe_rumah}</td>
                    <td className="px-4 py-2">{tipe.luas_bangunan} m²</td>
                    <td className="px-4 py-2">{tipe.luas_kavling} m²</td>
                    <td className="px-4 py-2">Rp {tipe.harga_standar_tengah.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-2">Rp {tipe.harga_standar_sudut.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-2">Rp {tipe.penambahan_bangunan.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-2 flex gap-2 justify-end">
                      <Button
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={() => {
                          setSelectedTipe(tipe);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          setDeleteId(tipe.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500 dark:text-white">
                    Tidak ada data
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {/* Modal Area */}
      <AddTipeRumahModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        error={errorMessage}
      />

      <EditTipeRumahModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedTipe={selectedTipe}
        setSelectedTipe={setSelectedTipe}
        handleUpdateTipe={handleEdit}
        validationErrors={validationErrors}
        errorMessage={errorMessage}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus tipe rumah ini?"
      />
    </div>
  );
}
