"use client";

import React, { useEffect, useState } from "react";

// --- Tipe & Interface ---
type TransaksiFormData = {
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
  kpr_disetujui: string;
};

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
  onSubmit: (data: TransaksiFormData) => void;
  unitList: { id: number; nomor_unit: string }[];
}

export default function AddTransaksiModal({
  isOpen,
  onClose,
  onSubmit,
  unitList,
}: Props) {
  const [formData, setFormData] = useState<TransaksiFormData>({
    nama_user: "",
    alamat_user: "",
    no_telepon: "",
    unit_id: "",
    harga_jual_standar: 0,
    kelebihan_tanah: 0,
    penambahan_luas_bangunan: 0,
    perubahan_spek_bangunan: 0,
    total_harga_jual: 0,
    minimum_dp: 0,
    biaya_booking: 0,
    kpr_disetujui: "Ya",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nama_user: "",
        alamat_user: "",
        no_telepon: "",
        unit_id: "",
        harga_jual_standar: 0,
        kelebihan_tanah: 0,
        penambahan_luas_bangunan: 0,
        perubahan_spek_bangunan: 0,
        total_harga_jual: 0,
        minimum_dp: 0,
        biaya_booking: 0,
        kpr_disetujui: "Ya",
      });
      setError(null);
    }
  }, [isOpen]);

  const calculateTotalHarga = (data: TransaksiFormData) => {
    return (
      Number(data.harga_jual_standar) +
      Number(data.kelebihan_tanah) +
      Number(data.penambahan_luas_bangunan) +
      Number(data.perubahan_spek_bangunan)
    );
  };

  // --- UPDATED handleChange ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target; // Diubah ke 'let'

    // Validasi input: Hanya izinkan angka untuk no_telepon
    if (name === "no_telepon") {
      value = value.replace(/\D/g, ""); // Hapus semua karakter non-digit
    }

    const updatedForm: TransaksiFormData = {
      ...formData,
      // Tentukan field mana yang string, mana yang number
      [name]: [
        "kpr_disetujui",
        "unit_id",
        "nama_user",
        "alamat_user",
        "no_telepon", // no_telepon tetap string, tapi 'value'-nya sudah difilter
      ].includes(name)
        ? value // Simpan sebagai string
        : Number(value) || 0, // Sisanya (dari InputNumber) simpan sebagai Angka
    };

    updatedForm.total_harga_jual = calculateTotalHarga(updatedForm);
    setFormData(updatedForm);
  };

  // --- UPDATED handleSubmit ---
  const handleSubmit = () => {
    // 1. Validasi Unit
    if (!formData.unit_id) {
      setError("Unit wajib diisi.");
      return;
    }

    // 2. Validasi Data User
    if (!formData.nama_user) {
      setError("Nama pembeli wajib diisi.");
      return;
    }
    if (!formData.alamat_user) {
      setError("Alamat pembeli wajib diisi.");
      return;
    }

    // 3. Validasi Nomor Telepon (Kosong)
    if (!formData.no_telepon) {
      setError("No telepon wajib diisi.");
      return;
    }

    // 4. Validasi Nomor Telepon (Panjang Minimal)
    if (formData.no_telepon.length < 10) {
      setError("No telepon minimal harus 10 angka.");
      return;
    }

    // Jika semua validasi lolos
    setError(null); // Bersihkan error
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
      <div className="w-[95%] sm:w-full max-w-4xl mx-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Tambah Transaksi</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User Baru (input fields) */}
          <>
            <div>
              <label className="block text-sm mb-1">Nama Pembeli</label>
              <input
                type="text"
                name="nama_user"
                value={formData.nama_user}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Alamat</label>
              <input
                type="text"
                name="alamat_user"
                value={formData.alamat_user}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">No Telepon</label>
              <input
                type="text" // Tetap text agar bisa difilter oleh handleChange
                name="no_telepon"
                value={formData.no_telepon}
                onChange={handleChange}
                placeholder="Minimal 10 angka"
                className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </>

          {/* Select Unit */}
          <div>
            <label className="block text-sm mb-1">Unit</label>
            <select
              name="unit_id"
              value={formData.unit_id}
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
            value={formData.harga_jual_standar}
            handleChange={handleChange}
          />
          <InputNumber
            label="Kelebihan Tanah"
            name="kelebihan_tanah"
            value={formData.kelebihan_tanah}
            handleChange={handleChange}
          />
          <InputNumber
            label="Penambahan Luas Bangunan"
            name="penambahan_luas_bangunan"
            value={formData.penambahan_luas_bangunan}
            handleChange={handleChange}
          />
          <InputNumber
            label="Perubahan Spek Bangunan"
            name="perubahan_spek_bangunan"
            value={formData.perubahan_spek_bangunan}
            handleChange={handleChange}
          />
          <InputNumber
            label="Total Harga Jual"
            name="total_harga_jual"
            value={formData.total_harga_jual}
            handleChange={() => {}}
            disabled
          />
          <InputNumber
            label="Minimum DP"
            name="minimum_dp"
            value={formData.minimum_dp}
            handleChange={handleChange}
          />
          <InputNumber
            label="Biaya Booking"
            name="biaya_booking"
            value={formData.biaya_booking}
            handleChange={handleChange}
          />

          {/* Status KPR */}
          <div>
            <label className="block text-sm mb-1">Status KPR</label>
            <select
              name="kpr_disetujui"
              value={formData.kpr_disetujui}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Simpan
          </button>
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

// Input Number Component
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
            handleChange({
              target: {
                name,
                value: raw,
              },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }}
        disabled={disabled}
        className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>
  );
}