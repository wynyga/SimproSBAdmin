"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  getPaginatedUnit,
  addUnit,
  updateUnit,
  deleteUnit,
} from "../../../../../../utils/Unit";
import { getAllBlok } from "../../../../../../utils/blok";
import { getAllTipeRumah } from "../../../../../../utils/tipeRumah";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import AddUnitModal from "@/components/simpro/penjualan/unit/AddUnitModal";
import EditUnitModal from "@/components/simpro/penjualan/unit/EditUnitModal";

// 1. Perbarui Interface Unit
interface Unit {
  id: number;
  nomor_unit: string;
  blok_id: number;
  tipe_rumah_id: number;
  kategori: string; // <-- Tambahkan ini
}

interface Blok {
  id: number;
  nama_blok: string;
}

interface TipeRumah {
  id: number;
  tipe_rumah: string;
}

export default function UnitPage() {
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [blokList, setBlokList] = useState<Blok[]>([]);
  const [tipeList, setTipeList] = useState<TipeRumah[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStaticData = async () => {
      const [bloks, tipeRumah] = await Promise.all([
        getAllBlok(setError),
        getAllTipeRumah(setError),
      ]);

      setBlokList(Array.isArray(bloks) ? bloks : []);
      setTipeList(Array.isArray(tipeRumah) ? tipeRumah : []);
    };
    fetchStaticData();
  }, []);

  const fetchUnits = useCallback(async () => {
    const res = await getPaginatedUnit(currentPage, searchTerm, setError);
    if (res) {
      setUnitList(res.data);
      setTotalPages(res.last_page);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  // 2. Perbarui handleAdd untuk menyertakan 'kategori'
  const handleAdd = async (data: {
    blok_id: number;
    tipe_rumah_id: number;
    nomor_unit: string;
    kategori: string; // <-- Tambahkan ini
  }) => {
    await addUnit(data, setError);
    await fetchUnits();
  };

  // 3. Perbarui handleUpdate untuk mengirim 'kategori'
  const handleUpdate = async (data: Unit): Promise<boolean> => {
    if (!data || !data.nomor_unit.trim()) {
      setError("Nomor unit tidak boleh kosong.");
      return false;
    }
    await updateUnit(
      data.id,
      {
        blok_id: data.blok_id,
        tipe_rumah_id: data.tipe_rumah_id,
        nomor_unit: data.nomor_unit,
        kategori: data.kategori, // <-- Tambahkan ini
      },
      setError
    );
    await fetchUnits();
    return true;
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteUnit(deleteId, setError);
      await fetchUnits();
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Manajemen Unit" />
      <ComponentCard title="Data Unit">
        {/* Search & Add */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <input
            type="text"
            placeholder="Cari Nomor Unit..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-60 rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            Tambah Unit
          </Button>
        </div>

        {/* 4. Perbarui Tabel */}
        <div className="overflow-auto rounded border dark:border-gray-700">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-white">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="border px-4 py-2 text-left">Blok</th>
                <th className="border px-4 py-2 text-left">Nomor Unit</th>
                <th className="border px-4 py-2 text-left">Kategori</th>
                <th className="border px-4 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {unitList.length > 0 ? (
                unitList.map((unit) => (
                  <tr key={unit.id} className="bg-white dark:bg-transparent">
                    <td className="border px-4 py-2">
                      {blokList.find((b) => b.id === unit.blok_id)
                        ?.nama_blok || "-"}
                    </td>
                    <td className="border px-4 py-2">{unit.nomor_unit}</td>
                    {/* <td className="border px-4 py-2">
                      {tipeList.find((t) => t.id === unit.tipe_rumah_id)
                        ?.tipe_rumah || "-"}
                    </td> */}
                    <td className="border px-4 py-2 capitalize">
                      {unit.kategori || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          onClick={() => {
                            setSelectedUnit(unit);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            setDeleteId(unit.id);
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
                  {/* 5. Perbarui colSpan */}
                  <td
                    colSpan={5}
                    className="text-center py-4 text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada data unit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
              Halaman <strong>{currentPage}</strong> dari{" "}
              <strong>{totalPages}</strong>
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

      {/* Modals */}
      <AddUnitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        blokOptions={blokList}
        tipeRumahOptions={tipeList}
      />

      {selectedUnit && (
        <EditUnitModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          unit={selectedUnit}
          blokOptions={blokList}
          tipeOptions={tipeList}
          onSubmit={handleUpdate}
          error={error}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Apakah Anda yakin ingin menghapus unit ini?"
      />
    </div>
  );
}
