"use client";

import React, { useEffect, useState } from "react";
import { getUnit,addUnit,updateUnit,deleteUnit } from "../../../../../../utils/Unit";
import { getBlok } from "../../../../../../utils/blok";
import { getTipeRumah } from "../../../../../../utils/tipeRumah";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import AddUnitModal from "@/components/simpro/penjualan/unit/AddUnitModal";
import EditUnitModal from "@/components/simpro/penjualan/unit/EditUnitModal";

interface Unit {
  id: number;
  nomor_unit: string;
  blok_id: number;
  tipe_rumah_id: number;
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

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [units, bloks, tipeRumah] = await Promise.all([
      getUnit(setError),
      getBlok(setError),
      getTipeRumah(setError),
    ]);
    setUnitList(units || []);
    setBlokList(bloks || []);
    setTipeList(tipeRumah || []);
  };

  const handleAdd = async (data: {
    blok_id: number;
    tipe_rumah_id: number;
    nomor_unit: string;
  }) => {
    await addUnit(data, setError);
    await fetchAll();
  };

  const handleUpdate = async (): Promise<boolean> => {
    if (!selectedUnit || !selectedUnit.nomor_unit.trim()) {
      setError("Nomor unit tidak boleh kosong.");
      return false;
    }

    await updateUnit(
      selectedUnit.id,
      {
        blok_id: selectedUnit.blok_id,
        tipe_rumah_id: selectedUnit.tipe_rumah_id,
        nomor_unit: selectedUnit.nomor_unit,
      },
      setError
    );

    await fetchAll();
    return true;
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteUnit(deleteId, setError);
      await fetchAll();
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Manajemen Unit" />
      <ComponentCard title="Data Unit">
        <div className="flex justify-between items-center mb-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddModal(true)}
          >
            Tambah Unit
          </Button>
        </div>

        <div className="overflow-auto rounded border dark:border-gray-700">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-white">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="border px-4 py-2">Nomor Unit</th>
                <th className="border px-4 py-2">Blok</th>
                <th className="border px-4 py-2">Tipe Rumah</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {unitList.length > 0 ? (
                unitList.map((unit) => (
                  <tr key={unit.id} className="bg-white dark:bg-transparent">
                    <td className="border px-4 py-2">{unit.nomor_unit}</td>
                    <td className="border px-4 py-2">
                      {blokList.find((b) => b.id === unit.blok_id)?.nama_blok ||
                        "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {
                        tipeList.find((t) => t.id === unit.tipe_rumah_id)
                          ?.tipe_rumah
                      }
                    </td>
                    <td className="border px-4 py-2 flex justify-end gap-2">
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Tidak ada data unit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
          setUnit={setSelectedUnit}
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
