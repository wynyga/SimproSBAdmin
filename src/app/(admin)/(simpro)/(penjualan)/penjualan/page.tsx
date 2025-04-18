"use client";

import React, { useState, useEffect } from "react";
import { getUsers } from "../../../../../../utils/users";
import { getUnit } from "../../../../../../utils/Unit";
import { getTransaksi,updateTransaksi,addTransaksi,deleteTransaksi } from "../../../../../../utils/Penjualan";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import TransaksiTable from "@/components/simpro/penjualan/transaksi/TransaksiTable";
import AddTransaksiModal from "@/components/simpro/penjualan/transaksi/AddTransaksiModal";
import EditTransaksiModal from "@/components/simpro/penjualan/transaksi/EditTransaksiModal";
import ConfirmDeleteModal from "@/components/simpro/penjualan/ConfirmDeleteModal";
import { TransaksiDataWithRelasi } from "../../../../../../utils/interfaceTransaksi";

export default function TransaksiPage() {
    const [transaksiList, setTransaksiList] = useState<TransaksiDataWithRelasi[]>([]);
    const [users, setUsers] = useState<{ id: number; nama_user: string }[]>([]);
    const [units, setUnits] = useState<{ id: number; nomor_unit: string }[]>([]);
    const [selectedTransaksi, setSelectedTransaksi] = useState<TransaksiDataWithRelasi | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      fetchAll();
    }, []);
  
    const fetchAll = async () => {
      setLoading(true);
      const userData = await getUsers(setError);
      const unitData = await getUnit(setError);
      const transaksiData = await getTransaksi(setError);
      setUsers(userData.users || []);
      setUnits(unitData || []);
      setTransaksiList(transaksiData || []);
      setLoading(false);
    };
  
    const handleAddTransaksi = async (data: any) => {
      await addTransaksi(data, setError);
      fetchAll();
    };
  
    const handleUpdateTransaksi = async (): Promise<boolean> => {
      if (!selectedTransaksi) return false;
      await updateTransaksi(selectedTransaksi.id!, selectedTransaksi, setError);
      await fetchAll();
      return true;
    };
  
    const handleDeleteConfirm = async () => {
      if (deleteId !== null) {
        await deleteTransaksi(deleteId, setError);
        fetchAll();
        setShowDeleteModal(false);
        setDeleteId(null);
      }
    };
  
    return (
      <div className="min-h-screen px-4 xl:px-10">
        <PageBreadcrumb pageTitle="Manajemen Transaksi" />
        <ComponentCard title="Data Transaksi">
          <div className="flex justify-between items-center mb-4">
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
        </ComponentCard>
  
        {/* MODAL TAMBAH */}
        <AddTransaksiModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTransaksi}
          userList={users}
          unitList={units}
        />
  
        {/* MODAL EDIT */}
        {selectedTransaksi && (
          <EditTransaksiModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            transaksi={selectedTransaksi}
            setTransaksi={setSelectedTransaksi}
            onSubmit={handleUpdateTransaksi}
            userList={users}
            unitList={units}
            error={error}
          />
        )}
  
        {/* MODAL HAPUS */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          message="Apakah Anda yakin ingin menghapus transaksi ini?"
        />
      </div>
    );
  }