"use client";

import { useState } from "react";
// 1. Import fungsi API yang baru Anda berikan
import { getCostTeeByCode } from "../../../../utils/CostTeeApi";
// 2. Import fungsi 'store' yang sudah ada
import { storeTransaksiKas } from "../../../../utils/transaksi-kas";

// Tipe berdasarkan contoh output JSON Anda
interface CostTee {
  id: number;
  cost_tee_code: string;
  description: string;
}

// Tipe untuk dropdown
interface KeteranganOption {
  value: string;
  label: string;
}

// 3. Interface FormData baru (lebih sederhana)
interface FormData {
  tanggal: string;
  keterangan_transaksi_id: string;
  kode: string; // "101" (Cash In) or "102" (Cash Out)
  jumlah: string;
  metode_pembayaran: string;
  keterangan_objek_transaksi: string;
  sumber_transaksi: string;
}

type SetErrorFunc = (error: string | null) => void;

export function useTransaksiKasForm(setError: SetErrorFunc) {
  const [loading, setLoading] = useState(false);
  const [optionsKeterangan, setOptionsKeterangan] = useState<KeteranganOption[]>(
    []
  );

  // 4. State formData baru
  const [formData, setFormData] = useState<FormData>({
    tanggal: "",
    keterangan_transaksi_id: "",
    kode: "", // Dimulai kosong, diisi oleh tombol
    jumlah: "",
    metode_pembayaran: "",
    keterangan_objek_transaksi: "",
    sumber_transaksi: "cost_code",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. handleSelectChange disederhanakan (logika KASIN/KASOUT dihapus)
  const handleSelectChange = (value: string, name: string) => {
    // Hanya set nilai, tidak ada logika 'kode' lagi di sini
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    // Handle jika pengguna menghapus tanggal
    if (!date) {
      setFormData((prev) => ({ ...prev, tanggal: "" }));
      return;
    }
    const formattedDate = date.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, tanggal: formattedDate }));
  };

  // 6. Handler BARU (pengganti handleSelectSumber)
  const handleJenisTransaksiChange = async (value: "101" | "102") => {
    // Set 'kode' dan reset 'keterangan'
    setFormData((prev) => ({
      ...prev,
      kode: value,
      keterangan_transaksi_id: "",
    }));
    setOptionsKeterangan([]); // Kosongkan opsi
    setError(null); // Bersihkan error sebelumnya

    try {
      // Tentukan parameter API berdasarkan 'kode'
      const apiCostCode = value === "101" ? "KASIN" : "KASOUT";

      // Panggil API baru Anda
      const result = await getCostTeeByCode(apiCostCode, setError);

      // Proses hasil API
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

  // 7. handleSubmit disesuaikan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validasi baru
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

      // 8. Payload baru (tanpa sumber_transaksi)
      const payload = {
        tanggal: formData.tanggal,
        keterangan_transaksi_id: Number(formData.keterangan_transaksi_id),
        kode: formData.kode,
        jumlah: Number(formData.jumlah),
        metode_pembayaran: formData.metode_pembayaran,
        keterangan_objek_transaksi: formData.keterangan_objek_transaksi,
      };

      await storeTransaksiKas(payload, setError);
      resetForm(); // Reset form setelah sukses
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
      setLoading(false);
    }
  };

  // 9. resetForm disesuaikan
  const resetForm = () => {
    setFormData({
      tanggal: "",
      keterangan_transaksi_id: "",
      kode: "",
      jumlah: "",
      metode_pembayaran: "",
      keterangan_objek_transaksi: "",
      sumber_transaksi: "cost_code",
    });
    setOptionsKeterangan([]);
  };

  // 10. Return value di-update
  return {
    formData,
    loading,
    optionsKeterangan,
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleJenisTransaksiChange, // Handler baru
    handleSubmit,
  };
}