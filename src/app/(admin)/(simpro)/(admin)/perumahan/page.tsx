"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import AddPerumahanModal from "@/components/simpro/perumahan/AddPerumahanModal";
import EditPerumahanModal from "@/components/simpro/perumahan/EditPerumahanModal";
import { getAllPerumahan,storePerumahan,updatePerumahan,deletePerumahan } from "../../../../../../utils/Perumahan";

interface Perumahan {
  id: number;
  nama_perumahan: string;
  lokasi: string;
  tanggal_harga?: string;
}

export default function PerumahanPage() {
  const [perumahanList, setPerumahanList] = useState<Perumahan[]>([]);
  const [selectedPerumahan, setSelectedPerumahan] = useState<Perumahan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPerumahan();
  }, []);

  const fetchPerumahan = async () => {
    const data = await getAllPerumahan(setError);
    setPerumahanList(data || []);
  };

  const handleAdd = async (data: { nama_perumahan: string; lokasi: string }) => {
    await storePerumahan(data, setError);
    await fetchPerumahan();
  };

  const handleEdit = (item: Perumahan) => {
    setSelectedPerumahan({
      ...item,
      tanggal_harga: new Date().toISOString().slice(0, 10), // set tanggal_harga default (tidak tampil di form)
    });
    setShowEditModal(true);
  };
  

  const handleUpdate = async () => {
    if (!selectedPerumahan || !selectedPerumahan.nama_perumahan.trim() || !selectedPerumahan.lokasi.trim()) {
      setError("Nama dan lokasi tidak boleh kosong.");
      return false;
    }
    await updatePerumahan(selectedPerumahan.id, selectedPerumahan, setError);
    await fetchPerumahan();
    return true;
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deletePerumahan(deleteId, setError);
      setDeleteId(null);
      setShowDeleteModal(false);
      await fetchPerumahan();
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Manajemen Perumahan" />
      <ComponentCard title="Data Perumahan">
        <div className="flex justify-between items-center mb-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            Tambah Perumahan
          </Button>
        </div>

        <div className="overflow-auto rounded border dark:border-gray-700">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Nama</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Lokasi</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-white">
              {perumahanList.length > 0 ? (
                perumahanList.map((item) => (
                  <tr key={item.id} className="bg-white dark:bg-transparent">
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.nama_perumahan}</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.lokasi}</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          onClick={() => handleEdit(item)}
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
                  <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Tidak ada data perumahan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <AddPerumahanModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        error={error}
      />

      {selectedPerumahan && (
        <EditPerumahanModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          perumahan={selectedPerumahan}
          setPerumahan={setSelectedPerumahan}
          onSubmit={handleUpdate}
          error={error}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus perumahan ini?"
      />
    </div>
  );
}
