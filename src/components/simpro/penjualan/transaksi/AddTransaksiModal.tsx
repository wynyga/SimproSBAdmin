"use client";

import React, { useEffect, useState } from "react";
// ✅ Asumsi UnitDetail diimpor dari file interface Anda
import { UnitDetail } from "../../../../../utils/interfaceTransaksi"; 

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
  uang_tanda_jadi: number; // ✅ Field baru
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
  unitList: UnitDetail[]; // ✅ Menggunakan tipe data UnitDetail
}

// --- Fungsi Kalkulasi (Sudah Dikonfirmasi) ---

// Rumus Total Harga: Harga Standar + Semua Tambahan
const calculateTotalHarga = (data: TransaksiFormData) => {
  return (
    Number(data.harga_jual_standar) +
    Number(data.kelebihan_tanah) +
    Number(data.penambahan_luas_bangunan) +
    Number(data.perubahan_spek_bangunan)
  );
};

// Rumus DP: (5% * Harga Standar) + Semua Tambahan
const calculateDP = (data: TransaksiFormData) => {
  // Poin 2: Benar, pakai harga_jual_standar
  const dpBasis = Number(data.harga_jual_standar) * 0.05;
  const tambahan =
    Number(data.kelebihan_tanah) +
    Number(data.penambahan_luas_bangunan) +
    Number(data.perubahan_spek_bangunan);
  return dpBasis + tambahan;
};

// --- Komponen Modal ---

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
    uang_tanda_jadi: 0, // ✅ Field baru
    kpr_disetujui: "KPR", // ✅ Opsi baru
  });

  const [error, setError] = useState<string | null>(null);
  const [selectedKategori, setSelectedKategori] = useState<string>("standar"); // Default 'standar'

  // Reset form saat modal dibuka
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
        uang_tanda_jadi: 0,
        kpr_disetujui: "KPR",
      });
      setError(null);
      setSelectedKategori("standar"); 
    }
  }, [isOpen]);

  // ✅ LOGIC UTAMA: Dijalankan saat user memilih Unit
  useEffect(() => {
    if (formData.unit_id) {
      const selectedUnit = unitList.find(
        (unit) => unit.id === Number(formData.unit_id)
      );
      
      if (selectedUnit) {
        // ✅ Poin 1: Ambil 'kategori' dari 'unit', bukan 'tipe_rumah'
        // Gunakan lowercase dan default ke 'standar'
        const kategori = selectedUnit.kategori?.toLowerCase() || "standar";
        setSelectedKategori(kategori);

        // ✅ Poin 3: Ambil 'harga_jual' dari 'tipe_rumah'
        const hargaJualStandar = selectedUnit.tipe_rumah?.harga_jual || 0;

        let nextFormData = {
          ...formData,
          harga_jual_standar: hargaJualStandar,
        };

        // Terapkan aturan disable/reset field berdasarkan kategori
        if (kategori === "standar") {
          nextFormData.kelebihan_tanah = 0;
          nextFormData.penambahan_luas_bangunan = 0;
          nextFormData.perubahan_spek_bangunan = 0;
        } else if (kategori === "sudut") {
          nextFormData.penambahan_luas_bangunan = 0;
          nextFormData.perubahan_spek_bangunan = 0;
        }
        // Jika "non standar", tidak ada field yang di-reset

        // Hitung ulang total dan DP
        nextFormData.total_harga_jual = calculateTotalHarga(nextFormData);
        nextFormData.minimum_dp = calculateDP(nextFormData);

        setFormData(nextFormData);
      }
    } else {
      // Jika unit tidak dipilih, reset semuanya
      setSelectedKategori("standar");
      setFormData((prev) => ({
        ...prev,
        harga_jual_standar: 0,
        kelebihan_tanah: 0,
        penambahan_luas_bangunan: 0,
        perubahan_spek_bangunan: 0,
        total_harga_jual: 0,
        minimum_dp: 0,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.unit_id]); // 'unitList' tidak perlu di sini jika stabil


  // --- UPDATED handleChange ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;

    if (name === "no_telepon") {
      value = value.replace(/\D/g, "");
    }

    const updatedForm: TransaksiFormData = {
      ...formData,
      [name]: [
        "kpr_disetujui",
        "unit_id",
        "nama_user",
        "alamat_user",
        "no_telepon",
      ].includes(name)
        ? value
        : Number(value) || 0,
    };

    // Kalkulasi otomatis setiap ada perubahan input angka
    updatedForm.total_harga_jual = calculateTotalHarga(updatedForm);
    updatedForm.minimum_dp = calculateDP(updatedForm);

    setFormData(updatedForm);
  };

  // ... (handleSubmit tidak berubah)
  const handleSubmit = () => {
    if (!formData.unit_id) {
      setError("Unit wajib diisi.");
      return;
    }
    if (!formData.nama_user) {
      setError("Nama pembeli wajib diisi.");
      return;
    }
    if (!formData.alamat_user) {
      setError("Alamat pembeli wajib diisi.");
      return;
    }
    if (!formData.no_telepon) {
      setError("No telepon wajib diisi.");
      return;
    }
    if (formData.no_telepon.length < 10) {
      setError("No telepon minimal harus 10 angka.");
      return;
    }
    setError(null);
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;
  
  // Tentukan field mana yang disabled
  const isKelebihanTanahDisabled = selectedKategori === "standar";
  const isBangunanDisabled = selectedKategori === "standar" || selectedKategori === "sudut";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-2">
      <div className="w-[95%] sm:w-full max-w-4xl mx-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white max-h-[90vh] overflow-y-auto">
        {/* ... (Header Modal) ... */}
        <div className="flex justify-between items-center mb-4">
           <h4 className="text-lg font-semibold">Tambah Transaksi</h4>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"> ✕ </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ... (Input Nama, Alamat, No Telepon) ... */}
          <>
            <div>
              <label className="block text-sm mb-1">Nama Pembeli</label>
              <input type="text" name="nama_user" value={formData.nama_user} onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm mb-1">Alamat</label>
              <input type="text" name="alamat_user" value={formData.alamat_user} onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm mb-1">No Telepon</label>
              <input type="text" name="no_telepon" value={formData.no_telepon} onChange={handleChange} placeholder="Minimal 10 angka" className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
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
            disabled // Harga standar di-disable
          />
          <InputNumber
            label="Kelebihan Tanah"
            name="kelebihan_tanah"
            value={formData.kelebihan_tanah}
            handleChange={handleChange}
            disabled={isKelebihanTanahDisabled} // Logic disable
          />
          <InputNumber
            label="Penambahan Luas Bangunan"
            name="penambahan_luas_bangunan"
            value={formData.penambahan_luas_bangunan}
            handleChange={handleChange}
            disabled={isBangunanDisabled} // Logic disable
          />
          <InputNumber
            label="Perubahan Spek Bangunan"
            name="perubahan_spek_bangunan"
            value={formData.perubahan_spek_bangunan}
            handleChange={handleChange}
            disabled={isBangunanDisabled} // Logic disable
          />
          <InputNumber
            label="Minimum DP"
            name="minimum_dp"
            value={formData.minimum_dp}
            handleChange={() => {}} 
            disabled // DP di-disable
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
              <option value="KPR">KPR</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          {/* ✅ Field Baru */}
          <InputNumber
            label="Uang Tanda Jadi"
            name="uang_tanda_jadi"
            value={formData.uang_tanda_jadi}
            handleChange={handleChange}
          />
          <InputNumber
            label="Total Harga Jual"
            name="total_harga_jual"
            value={formData.total_harga_jual}
            handleChange={() => {}}
            disabled // Total Harga selalu disabled
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {/* ... (Tombol Submit dan Batal) ... */}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={handleSubmit} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"> Simpan </button>
          <button onClick={onClose} className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700"> Batal </button>
        </div>
      </div>
    </div>
  );
}

// --- Komponen InputNumber (Reusable) ---
function InputNumber({
 label,
 name,
 value,
 handleChange,
 disabled = false,
}: InputNumberProps) {
 return (
   <div>
     <label className={`block text-sm mb-1 ${disabled ? 'text-gray-400 dark:text-gray-500' : ''}`}>{label}</label>
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
       className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800"
     />
   </div>
 );
}