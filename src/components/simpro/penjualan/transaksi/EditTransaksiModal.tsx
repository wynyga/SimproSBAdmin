"use client";

import React from "react";
import { TransaksiDataWithRelasi } from "../../../../../utils/interfaceTransaksi";

// 1. Definisikan interface untuk props komponen InputNumber
interface InputNumberProps {
  label: string;
  name: string;
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaksi: TransaksiDataWithRelasi;
  setTransaksi: (data: TransaksiDataWithRelasi) => void;
  onSubmit: () => Promise<boolean>;
  userList: { id: number; nama_user: string }[];
  unitList: { id: number; nomor_unit: string }[];
  error?: string | null;
}

export default function EditTransaksiModal({
  isOpen,
  onClose,
  transaksi,
  setTransaksi,
  onSubmit,
  userList,
  unitList,
  error,
}: Props) {
  if (!isOpen || !transaksi) return null;

  const calculateTotalHarga = (data: TransaksiDataWithRelasi) => {
    return (
      Number(data.harga_jual_standar) +
      Number(data.kelebihan_tanah) +
      Number(data.penambahan_luas_bangunan) +
      Number(data.perubahan_spek_bangunan)
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedTransaksi = {
      ...transaksi,
      [name]: name === "kpr_disetujui" ? value : Number(value) || 0,
    };

    // Hitung ulang total harga jual otomatis
    updatedTransaksi.total_harga_jual = calculateTotalHarga(updatedTransaksi);

    setTransaksi(updatedTransaksi);
  };

  const handleSubmit = async () => {
    const success = await onSubmit();
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Transaksi</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select User */}
          <div>
            <label className="block text-sm mb-1">Pembeli</label>
            <select
              name="user_id"
              value={transaksi.user_id}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Pilih Pembeli</option>
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nama_user}
                </option>
              ))}
            </select>
          </div>

          {/* Select Unit */}
          <div>
            <label className="block text-sm mb-1">Unit</label>
            <select
              name="unit_id"
              value={transaksi.unit_id}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Pilih Unit</option>
              {unitList.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.nomor_unit}
                </option>
              ))}
            </select>
          </div>

          {/* Input Fields */}
          <InputNumber label="Harga Jual Standar" name="harga_jual_standar" value={Number(transaksi.harga_jual_standar)} handleChange={handleChange} />
          <InputNumber label="Kelebihan Tanah" name="kelebihan_tanah" value={Number(transaksi.kelebihan_tanah)} handleChange={handleChange} />
          <InputNumber label="Penambahan Luas Bangunan" name="penambahan_luas_bangunan" value={Number(transaksi.penambahan_luas_bangunan)} handleChange={handleChange} />
          <InputNumber label="Perubahan Spek Bangunan" name="perubahan_spek_bangunan" value={Number(transaksi.perubahan_spek_bangunan)} handleChange={handleChange} />
          <InputNumber label="Total Harga Jual" name="total_harga_jual" value={Number(transaksi.total_harga_jual)} handleChange={() => {}} disabled />
          <InputNumber label="Minimum DP" name="minimum_dp" value={Number(transaksi.minimum_dp)} handleChange={handleChange} />
          <InputNumber label="Biaya Booking" name="biaya_booking" value={Number(transaksi.biaya_booking)} handleChange={handleChange} />

          {/* Status KPR */}
          <div>
            <label className="block text-sm mb-1">Status KPR</label>
            <select
              name="kpr_disetujui"
              value={transaksi.kpr_disetujui}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={handleSubmit} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
            Simpan Perubahan
          </button>
          <button onClick={onClose} className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700 transition">
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

// Komponen kecil input number
// 2. Ganti `any` dengan interface yang sudah dibuat
function InputNumber({ label, name, value, handleChange, disabled = false }: InputNumberProps) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>
  );
}