"use client";

import React, { useEffect, useState } from "react";
// ✅ Impor interface yang relevan
import {
  TransaksiDataWithRelasi,
  UnitDetail,
} from "../../../../../utils/interfaceTransaksi";
 import { updateUser } from "../../../../../utils/users";

// --- Interface ---
interface InputNumberProps {
  label: string;
  name:
    | "harga_jual_standar"
    | "kelebihan_tanah"
    | "penambahan_luas_bangunan"
    | "perubahan_spek_bangunan"
    | "total_harga_jual"
    | "minimum_dp"
    | "biaya_booking"
    | "uang_tanda_jadi"; // ✅ Field baru
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

type NewUserFields = {
  nama_user?: string;
  alamat_user?: string;
  no_telepon?: string;
};

// ✅ Perluas Tipe Transaksi untuk Edit
//    (Asumsi 'unit' di TransaksiDataWithRelasi butuh 'kategori' dan 'harga_jual'
//     yang tidak ada di definisi interface Anda)
type EditableTransaksi = TransaksiDataWithRelasi &
  Partial<NewUserFields> & {
    uang_tanda_jadi?: number;
    unit?: { // ✅ Menimpa (override) interface 'unit'
        nomor_unit: string;
        kategori?: 'standar' | 'non standar' | 'sudut' | string | null; // <-- WAJIB ADA
        blok?: { nama_blok: string };
        tipe_rumah?: { 
            tipe_rumah: string;
            harga_jual?: number; // <-- WAJIB ADA
        };
    };
  };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaksi: EditableTransaksi;
  setTransaksi: (data: EditableTransaksi) => void;
  onSubmit: () => Promise<boolean>;
  unitList: UnitDetail[]; // ✅ Menggunakan tipe data UnitDetail
  error?: string | null;
}

// --- Fungsi Kalkulasi (Sama seperti Add Modal) ---

const calculateTotalHarga = (data: EditableTransaksi) => {
  return (
    Number(data.harga_jual_standar) +
    Number(data.kelebihan_tanah) +
    Number(data.penambahan_luas_bangunan) +
    Number(data.perubahan_spek_bangunan)
  );
};

const calculateDP = (data: EditableTransaksi) => {
  const dpBasis = Number(data.harga_jual_standar) * 0.05;
  const tambahan =
    Number(data.kelebihan_tanah) +
    Number(data.penambahan_luas_bangunan) +
    Number(data.perubahan_spek_bangunan);
  return dpBasis + tambahan;
};

// --- Komponen Modal ---

export default function EditTransaksiModal({
  isOpen,
  onClose,
  transaksi,
  setTransaksi,
  onSubmit,
  unitList,
  error,
}: Props) {
  const [selectedKategori, setSelectedKategori] = useState<string>("standar");
  const [, setUpdateError] = useState<string | null>(null);
  // Efek untuk mengatur kategori saat modal dibuka/transaksi berubah
  useEffect(() => {
    if (isOpen && transaksi.unit) {
      // ✅ Ambil kategori dari 'transaksi.unit.kategori'
      const kategori = transaksi.unit.kategori?.toLowerCase() || "standar";
      setSelectedKategori(kategori);
    } else if (!isOpen) {
      setSelectedKategori("standar"); // Reset saat ditutup
    }
  }, [isOpen, transaksi.unit]);

  if (!isOpen || !transaksi) return null;

const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as { name: string; value: string };

    const next: EditableTransaksi = { ...transaksi };

    switch (name) {
      // --- Numeric Keys ---
      case "harga_jual_standar":
        next.harga_jual_standar = Number(value) || 0;
        break;
      case "kelebihan_tanah":
        next.kelebihan_tanah = Number(value) || 0;
        break;
      case "penambahan_luas_bangunan": // ✅ DITAMBAHKAN
        next.penambahan_luas_bangunan = Number(value) || 0;
        break;
      case "perubahan_spek_bangunan": // ✅ DITAMBAHKAN
        next.perubahan_spek_bangunan = Number(value) || 0;
        break;
      case "total_harga_jual": // ✅ DITAMBAHKAN
        next.total_harga_jual = Number(value) || 0;
        break;
      case "minimum_dp": // ✅ DITAMBAHKAN
        next.minimum_dp = Number(value) || 0;
        break;
      case "biaya_booking":
        next.biaya_booking = Number(value) || 0;
        break;
      case "uang_tanda_jadi":
        next.uang_tanda_jadi = Number(value) || 0;
        break;

      // --- ID Keys ---
      case "user_id":
        next.user_id = value === "" ? 0 : Number(value);
        break;
      case "unit_id":
        next.unit_id = value === "" ? 0 : Number(value);
        
        const selectedUnit = unitList.find(unit => unit.id === next.unit_id);
        const kategori = selectedUnit?.kategori?.toLowerCase() || "standar";
        setSelectedKategori(kategori); 

        next.harga_jual_standar = selectedUnit?.tipe_rumah?.harga_jual || 0;

        if (kategori === "standar") {
          next.kelebihan_tanah = 0;
          next.penambahan_luas_bangunan = 0;
          next.perubahan_spek_bangunan = 0;
        } else if (kategori === "sudut") {
          next.penambahan_luas_bangunan = 0;
          next.perubahan_spek_bangunan = 0;
        }
        break;

      // --- Text Keys ---
      case "kpr_disetujui":
        next.kpr_disetujui = value;
        break;
      case "nama_user": // ✅ DITAMBAHKAN
        next.nama_user = value;
        break;
      case "alamat_user": // ✅ DITAMBAHKAN
        next.alamat_user = value;
        break;
      case "no_telepon":
        next.no_telepon = value.replace(/[^0-9]/g, ""); 
        break;

      default:
        break;
    }

    // Hitung ulang total dan DP setiap ada perubahan
    next.total_harga_jual = calculateTotalHarga(next);
    next.minimum_dp = calculateDP(next);
    
    setTransaksi(next);
  };

  // ... (handleSubmit tidak berubah)
  const handleSubmit = async () => {
    let hasUserError = false;
const localSetError = (msg: string) => {
      hasUserError = true;
      setUpdateError(msg);
    };
    
    setUpdateError(null); // Reset error

    // 1. Validasi
    if (!transaksi.nama_user) {
       localSetError("Nama pembeli wajib diisi.");
       return;
    }
    if (!transaksi.alamat_user) {
       localSetError("Alamat pembeli wajib diisi.");
       return;
    }
    if (!transaksi.no_telepon) {
       localSetError("Nomor telepon wajib diisi.");
       return;
    }
    if (transaksi.no_telepon.length < 10) {
       localSetError("Nomor telepon minimal harus 10 angka.");
       return;
    }
    if (!transaksi.unit_id || transaksi.unit_id === 0) {
       localSetError("Unit wajib dipilih.");
       return;
    }
    if (!transaksi.user_id) {
        localSetError("Error: ID User tidak ditemukan pada transaksi ini.");
        return;
    }
    const userData = {
      nama_user: transaksi.nama_user,
      alamat_user: transaksi.alamat_user,
      no_telepon: transaksi.no_telepon,
    };
    await updateUser(Number(transaksi.user_id), userData, localSetError);
    if (hasUserError) {
      return; 
    }
    const transactionSuccess = await onSubmit(); 
    if (transactionSuccess) {
      onClose();
    }
  };

  // Tentukan field mana yang disabled
  const isKelebihanTanahDisabled = selectedKategori === "standar";
  const isBangunanDisabled = selectedKategori === "standar" || selectedKategori === "sudut";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white max-h-[90vh] overflow-y-auto">
        {/* ... (Header Modal) ... */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Transaksi</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Tutup"> ✕ </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ... (Input Nama, Alamat, No Telepon) ... */}
           <div>
             <label className="block text-sm mb-1">Nama Pembeli</label>
             <input type="text" name="nama_user" value={transaksi.nama_user ?? ""} onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
           </div>
           <div>
             <label className="block text-sm mb-1">Alamat</label>
             <input type="text" name="alamat_user" value={transaksi.alamat_user ?? ""} onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
           </div>
           <div>
             <label className="block text-sm mb-1">No Telepon</label>
             <input type="tel" name="no_telepon" value={transaksi.no_telepon ?? ""} onChange={handleChange} placeholder="Contoh: 081234567890" className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
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
            disabled 
          />
          <InputNumber
            label="Kelebihan Tanah"
            name="kelebihan_tanah"
            value={Number(transaksi.kelebihan_tanah)}
            handleChange={handleChange}
            disabled={isKelebihanTanahDisabled} 
          />
          <InputNumber
            label="Penambahan Luas Bangunan"
            name="penambahan_luas_bangunan"
            value={Number(transaksi.penambahan_luas_bangunan)}
            handleChange={handleChange}
            disabled={isBangunanDisabled}
          />
          <InputNumber
            label="Perubahan Spek Bangunan"
            name="perubahan_spek_bangunan"
            value={Number(transaksi.perubahan_spek_bangunan)}
            handleChange={handleChange}
            disabled={isBangunanDisabled}
          />
          <InputNumber
            label="Total Harga Jual"
            name="total_harga_jual"
            value={Number(transaksi.total_harga_jual)}
            handleChange={() => {}}
            disabled
          />
          <InputNumber
            label="Minimum DP"
            name="minimum_dp"
            value={Number(transaksi.minimum_dp)}
            handleChange={() => {}}
            disabled 
          />
          <InputNumber
            label="Biaya Booking"
            name="biaya_booking"
            value={Number(transaksi.biaya_booking)}
            handleChange={handleChange}
          />
          <InputNumber
            label="Uang Tanda Jadi"
            name="uang_tanda_jadi"
            value={Number(transaksi.uang_tanda_jadi || 0)}
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
              <option value="KPR">KPR</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        {/* ... (Tombol Submit dan Batal) ... */}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={handleSubmit} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"> Simpan Perubahan </button>
          <button onClick={onClose} className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700 transition"> Batal </button>
        </div>
      </div>
    </div>
  );
}

// ... (Komponen InputNumber tidak berubah, bisa di-copy dari atas)
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
             target: { name, value: raw } as unknown as EventTarget &
               HTMLInputElement,
           } as React.ChangeEvent<HTMLInputElement>);
         }
       }}
    disabled={disabled}
       className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800"
   />
  </div>
 );
}