"use client";

import React, { useEffect, useState } from "react";
import { getBlok,addBlok,updateBlok,deleteBlok } from "../../../../../../utils/blok";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import AddBlokModal from "@/components/simpro/penjualan/blok/AddBlokModal";
import EditBlokModal from "@/components/simpro/penjualan/blok/EditBlokModal";

interface Blok {
  id: number;
  nama_blok: string;
}

export default function BlokPage() {
  const [blokList, setBlokList] = useState<Blok[]>([]);
  const [selectedBlok, setSelectedBlok] = useState<Blok | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlok();
  }, []);

  const fetchBlok = async () => {
    const data = await getBlok(setError);
    setBlokList(data || []);
  };

  const handleAdd = async (namaBlok: string) => {
    await addBlok({ nama_blok: namaBlok }, setError);
    await fetchBlok();
  };

  const handleUpdate = async () => {
    if (!selectedBlok || !selectedBlok.nama_blok.trim()) {
      setError("Nama blok tidak boleh kosong.");
      return false;
    }
    await updateBlok(selectedBlok.id, { nama_blok: selectedBlok.nama_blok }, setError);
    await fetchBlok();
    return true;
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteBlok(deleteId, setError);
      setDeleteId(null);
      setShowDeleteModal(false);
      await fetchBlok();
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Manajemen Blok" />
      <ComponentCard title="Data Blok">
        <div className="flex justify-between items-center mb-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            Tambah Blok
          </Button>
        </div>

        <div className="overflow-auto rounded border dark:border-gray-700">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
                <tr>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">
                    Nama Blok
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">
                    Aksi
                    </th>
                </tr>
                </thead>
                <tbody className="text-gray-800 dark:text-white">
                {blokList.length > 0 ? (
                    blokList.map((blok) => (
                    <tr key={blok.id} className="bg-white dark:bg-transparent">
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        {blok.nama_blok}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                        <div className="flex items-center gap-2 justify-end">
                            <Button
                            size="sm"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            onClick={() => {
                                setSelectedBlok(blok);
                                setShowEditModal(true);
                            }}
                            >
                            Edit
                            </Button>
                            <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => {
                                setDeleteId(blok.id);
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
                    <td colSpan={2} className="text-center py-4 text-gray-500 dark:text-gray-400">
                        Tidak ada data blok.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>

      </ComponentCard>

      {/* Modals */}
      <AddBlokModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        error={error}
      />

      {selectedBlok && (
        <EditBlokModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          blok={selectedBlok}
          setBlok={setSelectedBlok}
          onSubmit={handleUpdate}
          error={error}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus blok ini?"
      />
    </div>
  );
}
