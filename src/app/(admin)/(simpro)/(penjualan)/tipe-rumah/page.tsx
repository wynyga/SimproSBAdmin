"use client";

import React, { useEffect, useState, useCallback } from "react"; // 1. Impor useCallback
import {
  getPaginatedTipeRumah,
  addTipeRumah,
  updateTipeRumah,
  deleteTipeRumah,
} from "../../../../../../utils/tipeRumah";
import { formatRupiah } from "../../../../../../utils/formatRupiah";
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

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 2. Bungkus fungsi dengan useCallback dan definisikan dependensinya
  const fetchTipeRumah = useCallback(async () => {
    const res = await getPaginatedTipeRumah(currentPage, searchTerm, setErrorMessage);
    if (res) {
      setTipeRumah(res.data);
      setTotalPages(res.last_page);
    }
  }, [currentPage, searchTerm]); // <-- Dependensi untuk useCallback

  useEffect(() => {
    fetchTipeRumah();
  }, [fetchTipeRumah]); // 3. Gunakan fungsi yang sudah di-memoize sebagai dependensi

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
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Manajemen Tipe Rumah" />
      <ComponentCard title="Data Tipe Rumah">
        {/* Search + Tambah */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
          <input
            type="text"
            placeholder="Cari Tipe Rumah..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset halaman
            }}
            className="w-full sm:w-64 rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            Tambah Tipe Rumah
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-auto rounded border dark:border-gray-700">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-white">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="border px-4 py-2">Nama</th>
                <th className="border px-4 py-2">Luas Bangunan</th>
                <th className="border px-4 py-2">Luas Kavling</th>
                <th className="border px-4 py-2">Total Harga</th>
                <th className="border px-4 py-2">Harga Sudut</th>
                <th className="border px-4 py-2">Penambahan</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tipeRumah.length > 0 ? (
                tipeRumah.map((tipe) => (
                  <tr key={tipe.id} className="bg-white dark:bg-transparent">
                    <td className="border px-4 py-2">{tipe.tipe_rumah}</td>
                    <td className="border px-4 py-2">{tipe.luas_bangunan} m²</td>
                    <td className="border px-4 py-2">{tipe.luas_kavling} m²</td>
                    <td className="border px-4 py-2">{formatRupiah(tipe.harga_standar_tengah)}</td>
                    <td className="border px-4 py-2">{formatRupiah(tipe.harga_standar_sudut)}</td>
                    <td className="border px-4 py-2">{formatRupiah(tipe.penambahan_bangunan)}</td>
                    <td className="border px-4 py-2 flex justify-end gap-2">
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
                  <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Tidak ada data tipe rumah.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-800 dark:text-gray-100">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Sebelumnya
            </button>
            <span className="mx-2">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Selanjutnya
            </button>
          </div>
        )}
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