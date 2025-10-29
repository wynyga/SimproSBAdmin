"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import AddPerumahanModal from "@/components/simpro/perumahan/AddPerumahanModal";
import EditPerumahanModal from "@/components/simpro/perumahan/EditPerumahanModal";
import { getAllPerumahan, storePerumahan, updatePerumahan, deletePerumahan } from "../../../../../../utils/Perumahan";
import { getProfile } from "../../../../../../utils/auth";

interface Perumahan {
  id: number;
  nama_perumahan: string;
  lokasi: string;
  inisial: string;
}

export default function PerumahanPage() {
  const router = useRouter();

  const [perumahanList, setPerumahanList] = useState<Perumahan[]>([]);
  const [selectedPerumahan, setSelectedPerumahan] = useState<Perumahan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const profile = await getProfile((err: string) => setError(err));
        if (profile?.role === "Direktur") {
          setIsAllowed(true);
        }
      } catch {
        setError("Gagal memuat profil pengguna.");
      } finally {
        setCheckingAccess(false);
      }
    };
    checkAccess();
  }, []);

  useEffect(() => {
    if (isAllowed) fetchPerumahan();
  }, [isAllowed]);

  const fetchPerumahan = async () => {
    const data = await getAllPerumahan(setError);
    setPerumahanList(data || []);
  };

  const handleAdd = async (data: { nama_perumahan: string; lokasi: string; inisial: string }) => {
    await storePerumahan(data, setError);
    await fetchPerumahan();
  };

  const handleEdit = (item: Perumahan) => {
    setSelectedPerumahan(item);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (
      !selectedPerumahan ||
      !selectedPerumahan.nama_perumahan.trim() ||
      !selectedPerumahan.lokasi.trim() ||
      !selectedPerumahan.inisial.trim()
    ) {
      setError("Nama, lokasi, dan inisial tidak boleh kosong.");
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
    <div className="min-h-screen">
      <PageBreadcrumb pageTitle="Manajemen Perumahan" />
      <div className="px-4 xl:px-10">
        {checkingAccess ? (
          <p className="text-sm text-gray-500 dark:text-white">Memuat akses pengguna...</p>
        ) : !isAllowed ? (
          <ComponentCard title="Akses Ditolak">
            <p className="text-sm text-red-500">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Kembali ke Dashboard
            </button>
          </ComponentCard>
        ) : (
          <>
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
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Nama Properti Perumahan</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Kode</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Lokasi</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 dark:text-white">
                    {perumahanList.length > 0 ? (
                      perumahanList.map((item) => (
                        <tr key={item.id} className="bg-white dark:bg-transparent">
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.nama_perumahan}</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{item.inisial}</td>
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
                        <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">
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
          </>
        )}
      </div>
    </div>
  );
}
