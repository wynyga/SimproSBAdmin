  "use client";

  import React, { useState, useEffect, useCallback } from "react";
  import { getAllUsers } from "../../../../../../utils/users";
  import { getAllUnit } from "../../../../../../utils/Unit";
  import {
    getPaginatedTransaksi,
    updateTransaksi,
    addTransaksi,
    deleteTransaksi,
  } from "../../../../../../utils/Penjualan";
  import PageBreadcrumb from "@/components/common/PageBreadCrumb";
  import ComponentCard from "@/components/common/ComponentCard";
  import Button from "@/components/ui/button/Button";
  import TransaksiTable from "@/components/simpro/penjualan/transaksi/TransaksiTable";
  import AddTransaksiModal from "@/components/simpro/penjualan/transaksi/AddTransaksiModal";
  import EditTransaksiModal from "@/components/simpro/penjualan/transaksi/EditTransaksiModal";
  import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
  import { TransaksiDataWithRelasi,UnitDetail } from "../../../../../../utils/interfaceTransaksi";
 

  // ✅ Tambahkan field baru yang sesuai dengan backend
  type AddTransaksiPayload = {
    user_id?: string;
    nama_user?: string;
    alamat_user?: string;
    no_telepon?: string;
    unit_id: string;
    harga_jual_standar: number;
    kelebihan_tanah: number;
    penambahan_luas_bangunan: number;
    perubahan_spek_bangunan: number;
    total_harga_jual: number;
    minimum_dp: number;
    biaya_booking: number;
    plafon_kpr?: number;
    kpr_disetujui: string;
    uang_tanda_jadi: number;
  };

  export default function TransaksiPage() {
    const [transaksiList, setTransaksiList] = useState<TransaksiDataWithRelasi[]>([]);
    const [users, setUsers] = useState<{ id: number; nama_user: string }[]>([]);
    const [units, setUnits] = useState<UnitDetail[]>([]);
    const [selectedTransaksi, setSelectedTransaksi] = useState<TransaksiDataWithRelasi | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
      fetchAllStaticData();
    }, []);

    const fetchAllStaticData = async () => {
      const userData = await getAllUsers(setError);
      const unitData = await getAllUnit(setError);
      setUsers(Array.isArray(userData) ? userData : []);
      setUnits(Array.isArray(unitData) ? unitData : []);
    };

    const fetchTransaksiData = useCallback(async () => {
      setLoading(true);
      const res = await getPaginatedTransaksi(currentPage, searchTerm, setError);
      if (res) {
        setTransaksiList(res.data || []);
        setTotalPages(res.last_page || 1);
      }
      setLoading(false);
    }, [currentPage, searchTerm]);

    useEffect(() => {
      fetchTransaksiData();
    }, [fetchTransaksiData]);

    const handleAddTransaksi = async (data: AddTransaksiPayload) => {
      await addTransaksi(data, setError);
      fetchTransaksiData();
    };

    const handleUpdateTransaksi = async (): Promise<boolean> => {
      if (!selectedTransaksi) return false;
      await updateTransaksi(selectedTransaksi.id!, selectedTransaksi, setError);
      await fetchTransaksiData();
      return true;
    };

    const handleDeleteConfirm = async () => {
      if (deleteId !== null) {
        await deleteTransaksi(deleteId, setError);
        fetchTransaksiData();
        setShowDeleteModal(false);
        setDeleteId(null);
      }
    };

    return (
      <div className="min-h-screen px-4 xl:px-10">
        <PageBreadcrumb pageTitle="Manajemen Transaksi" />
        <ComponentCard title="Data Transaksi">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Cari nama user / nomor unit"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowAddModal(true)}
            >
              Tambah Transaksi
            </Button>
          </div>

          <TransaksiTable
            transaksiList={transaksiList}
            loading={loading}
            error={error}
            setEditTransaksi={(data) => {
              setSelectedTransaksi(data);
              setShowEditModal(true);
            }}
            handleDeleteClick={(id) => {
              setDeleteId(id);
              setShowDeleteModal(true);
            }}
          />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-800 dark:text-white">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sebelumnya
              </button>
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </ComponentCard>

        <AddTransaksiModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTransaksi}
          unitList={units}
        />

        {selectedTransaksi && (
          <EditTransaksiModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            transaksi={selectedTransaksi}
            setTransaksi={setSelectedTransaksi}
            onSubmit={handleUpdateTransaksi}
            unitList={units}
            error={error}
          />
        )}

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          message="Apakah Anda yakin ingin menghapus transaksi ini?"
        />
      </div>
    );
  }
