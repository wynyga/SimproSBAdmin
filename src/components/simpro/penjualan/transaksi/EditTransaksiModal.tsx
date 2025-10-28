"use client";

import React, { useEffect } from "react";
import { TransaksiDataWithRelasi } from "../../../../../utils/interfaceTransaksi";

interface InputNumberProps {
  label: string;
  name:
    | "harga_jual_standar"
    | "kelebihan_tanah"
    | "penambahan_luas_bangunan"
    | "perubahan_spek_bangunan"
    | "total_harga_jual"
    | "minimum_dp"
    | "biaya_booking";
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

type NewUserFields = {
  nama_user?: string;
  alamat_user?: string;
  no_telepon?: string;
};

type EditableTransaksi = TransaksiDataWithRelasi & Partial<NewUserFields>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaksi: EditableTransaksi;
  setTransaksi: (data: EditableTransaksi) => void;
  onSubmit: () => Promise<boolean>;
  unitList: { id: number; nomor_unit: string }[];
  error?: string | null;
}

export default function EditTransaksiModal({
  isOpen,
  onClose,
  transaksi,
  setTransaksi,
  onSubmit,
  unitList,
  error,
}: Props) {
  if (!isOpen || !transaksi) return null;

  const calculateTotalHarga = (data: EditableTransaksi) => {
    return (
      Number(data.harga_jual_standar) +
      Number(data.kelebihan_tanah) +
      Number(data.penambahan_luas_bangunan) +
      Number(data.perubahan_spek_bangunan)
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as { name: string; value: string };

    const next: EditableTransaksi = { ...transaksi };

    switch (name) {
      // ... (case numeric lainnya)
      
      case "harga_jual_standar":
        next.harga_jual_standar = Number(value) || 0;
        break;
      case "kelebihan_tanah":
        next.kelebihan_tanah = Number(value) || 0;
        break;
      case "penambahan_luas_bangunan":
        next.penambahan_luas_bangunan = Number(value) || 0;
        break;
      case "perubahan_spek_bangunan":
        next.perubahan_spek_bangunan = Number(value) || 0;
        break;
      case "total_harga_jual":
        next.total_harga_jual = Number(value) || 0;
        break;
      case "minimum_dp":
        next.minimum_dp = Number(value) || 0;
        break;
      case "biaya_booking":
        next.biaya_booking = Number(value) || 0;
        break;

      // ID keys (select → string → number)
      case "user_id":
        next.user_id = value === "" ? 0 : Number(value);
        break;
      case "unit_id":
        next.unit_id = value === "" ? 0 : Number(value);
        break;

      // Text keys
      case "kpr_disetujui":
        next.kpr_disetujui = value;
        break;
      case "nama_user":
        next.nama_user = value;
        break;
      case "alamat_user":
        next.alamat_user = value;
        break;

      // ✅ PERUBAHAN: Hanya izinkan input angka untuk no_telepon
      case "no_telepon":
        const numericValue = value.replace(/[^0-9]/g, ""); // Hapus non-angka
        next.no_telepon = numericValue;
        break;

      default:
        break;
    }

    next.total_harga_jual = calculateTotalHarga(next);
    setTransaksi(next);
  };

  const handleSubmit = async () => {
    // ✅ PERUBAHAN: Validasi diperketat
    if (!transaksi.nama_user) {
      alert("Nama pembeli wajib diisi.");
      return;
    }
    if (!transaksi.alamat_user) {
      alert("Alamat pembeli wajib diisi.");
      return;
    }
    if (!transaksi.no_telepon) {
      alert("Nomor telepon wajib diisi.");
      return;
    }
    // Validasi minimal 10 digit
    if (transaksi.no_telepon.length < 10) {
      alert("Nomor telepon minimal harus 10 angka.");
      return;
    }
    // Validasi unit_id
    if (!transaksi.unit_id || transaksi.unit_id === 0) {
      alert("Unit wajib dipilih.");
      return;
    }

    const success = await onSubmit();
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Transaksi</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User Baru (Selalu tampil) */}
          <div>
            <label className="block text-sm mb-1">Nama Pembeli</label>
            <input
              type="text"
              name="nama_user"
              value={transaksi.nama_user ?? ""}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Alamat</label>
            <input
              type="text"
              name="alamat_user"
              value={transaksi.alamat_user ?? ""}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">No Telepon</label>
            <input
              type="tel" // ✅ Ganti tipe ke "tel" untuk UX mobile yg lebih baik
              name="no_telepon"
              value={transaksi.no_telepon ?? ""}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Unit */}
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

          {/* Input Harga & DP */}
          <InputNumber
            label="Harga Jual Standar"
            name="harga_jual_standar"
            value={Number(transaksi.harga_jual_standar)}
            handleChange={handleChange}
          />
          <InputNumber
            label="Kelebihan Tanah"
            name="kelebihan_tanah"
            value={Number(transaksi.kelebihan_tanah)}
            handleChange={handleChange}
          />
          <InputNumber
            label="Penambahan Luas Bangunan"
            name="penambahan_luas_bangunan"
            value={Number(transaksi.penambahan_luas_bangunan)}
            handleChange={handleChange}
          />
          <InputNumber
            label="Perubahan Spek Bangunan"
            name="perubahan_spek_bangunan"
            value={Number(transaksi.perubahan_spek_bangunan)}
            handleChange={handleChange}
          />
          <InputNumber
            label="Total Harga Jual"
            name="total_harga_jual"
            value={Number(transaksi.total_harga_jual)}
            handleChange={() => {
              /* read-only */
            }}
            disabled
          />
          <InputNumber
            label="Minimum DP"
            name="minimum_dp"
            value={Number(transaksi.minimum_dp)}
            handleChange={handleChange}
          />
          <InputNumber
            label="Biaya Booking"
            name="biaya_booking"
            value={Number(transaksi.biaya_booking)}
            handleChange={handleChange}
          />

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
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Simpan Perubahan
          </button>
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

// Komponen input number (Tidak berubah)
function InputNumber({
  label,
  name,
  value,
  handleChange,
  disabled = false,
}: InputNumberProps) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={Number(value || 0).toLocaleString("id-ID")}
        onChange={(e) => {
          const raw = e.target.value.replace(/\./g, "");
          if (!isNaN(Number(raw))) {
            // cast event buatan ke tipe yang sesuai, tanpa any
            handleChange({
              target: { name, value: raw } as unknown as EventTarget &
                HTMLInputElement,
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        disabled={disabled}
        className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>
  );
}