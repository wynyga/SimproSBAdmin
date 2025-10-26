"use client";

// 1. Import useRef
import { useState, useRef } from "react";
import { getCostTeeByCode } from "../../../../utils/CostTeeApi";
import { storeTransaksiKas } from "../../../../utils/transaksi-kas";

// ... (Interface tidak berubah) ...
interface CostTee {
  id: number;
  cost_tee_code: string;
  description: string;
}

interface KeteranganOption {
  value: string;
  label: string;
}

interface FormData {
  tanggal: string;
  keterangan_transaksi_id: string;
  kode: string; 
  jumlah: string;
  metode_pembayaran: string;
  keterangan_objek_transaksi: string;
}

type SetErrorFunc = (error: string | null) => void;


export function useTransaksiKasForm(setError: SetErrorFunc) {
  const [loading, setLoading] = useState(false);
  // 2. Buat sebuah "kunci" (lock) menggunakan useRef
  const isSubmitting = useRef(false); 
  
  const [optionsKeterangan, setOptionsKeterangan] = useState<KeteranganOption[]>(
    []
  );
  // ... (State formData dan fungsi handleChange, dll. tidak berubah) ...
  const [formData, setFormData] = useState<FormData>({
    tanggal: "",
    keterangan_transaksi_id: "",
    kode: "",
    jumlah: "",
    metode_pembayaran: "",
    keterangan_objek_transaksi: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      setFormData((prev) => ({ ...prev, tanggal: "" }));
      return;
    }
    const formattedDate = date.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, tanggal: formattedDate }));
  };

  const handleJenisTransaksiChange = async (value: "101" | "102") => {
    // ... (Tidak ada perubahan di fungsi ini) ...
    setFormData((prev) => ({
      ...prev,
      kode: value,
      keterangan_transaksi_id: "",
    }));
    setOptionsKeterangan([]);
    setError(null);

    try {
      const apiCostCode = value === "101" ? "KASIN" : "KASOUT";
      const result = await getCostTeeByCode(apiCostCode, setError);
      if (Array.isArray(result)) {
        setOptionsKeterangan(
          result.map((item: CostTee) => ({
            value: item.id.toString(),
            label: `${item.cost_tee_code} - ${item.description}`,
          }))
        );
      } else {
        setOptionsKeterangan([]);
      }
    } catch (error) {
      console.error("Gagal mengambil pilihan keterangan:", error);
      setOptionsKeterangan([]);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Gagal memuat data keterangan.");
      }
    }
  };


  // --- PERUBAHAN UTAMA DI SINI ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 3. Cek apakah "kunci" sedang aktif. Jika ya, hentikan fungsi.
    if (isSubmitting.current) {
      return; 
    }

    // 4. Aktifkan "kunci" secara instan
    isSubmitting.current = true;
    setLoading(true);
    setError(null);

    try {
      if (
        !formData.kode ||
        !formData.keterangan_transaksi_id ||
        !formData.tanggal ||
        !formData.jumlah ||
        !formData.metode_pembayaran
      ) {
        throw new Error(
          "Harap lengkapi Tanggal, Jenis Transaksi, Keterangan, Jumlah, dan Metode Pembayaran."
        );
      }

      const payload = {
        tanggal: formData.tanggal,
        keterangan_transaksi_id: Number(formData.keterangan_transaksi_id),
        kode: formData.kode,
        jumlah: Number(formData.jumlah),
        metode_pembayaran: formData.metode_pembayaran,
        keterangan_objek_transaksi: formData.keterangan_objek_transaksi,
      };

      await storeTransaksiKas(payload, setError);
      resetForm(); 
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Terjadi kesalahan yang tidak diketahui saat menyimpan transaksi."
        );
      }
    } finally {
      // 5. Selalu buka "kunci" setelah selesai (baik sukses atau gagal)
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  const resetForm = () => {
    // ... (Tidak ada perubahan di fungsi ini) ...
    setFormData({
      tanggal: "",
      keterangan_transaksi_id: "",
      kode: "",
      jumlah: "",
      metode_pembayaran: "",
      keterangan_objek_transaksi: "",
    });
    setOptionsKeterangan([]);
  };

  return {
    formData,
    loading,
    optionsKeterangan,
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleJenisTransaksiChange,
    handleSubmit,
  };
}