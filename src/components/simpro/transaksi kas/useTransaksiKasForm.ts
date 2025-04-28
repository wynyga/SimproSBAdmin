"use client";

import { useState } from "react";
import { getCostTees } from "../../../../utils/CostTeeApi";
import { getTransaksi } from "../../../../utils/Penjualan";
import { storeTransaksiKas } from "../../../../utils/transaksi-kas";

export function useTransaksiKasForm(setError: Function) {
  const [loading, setLoading] = useState(false);
  const [optionsKeterangan, setOptionsKeterangan] = useState<{ value: string; label: string }[]>([]);
  
  const [formData, setFormData] = useState({
    tanggal: "",
    sumber_transaksi: "",
    keterangan_transaksi: "",
    keterangan_transaksi_id: "",
    kode: "",
    jumlah: "",
    metode_pembayaran: "",
    keterangan_objek_transaksi: "",
  });

  // Handler input biasa
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler select input (custom Select)
  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler tanggal
  const handleDateChange = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, tanggal: formattedDate }));
  };

  // Handler pilihan sumber transaksi
  const handleSelectSumber = async (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sumber_transaksi: value,
      keterangan_transaksi_id: "", // reset pilihan keterangan saat sumber berubah
    }));

    try {
      if (value === "cost_code") {
        const result = await getCostTees(setError);
        if (result) {
          setOptionsKeterangan(
            result.map((item: any) => ({
              value: item.id.toString(),
              label: `${item.code} - ${item.description}`
            }))
          );
        }
      } else if (value === "penjualan") {
        const result = await getTransaksi(setError);
        if (result) {
          setOptionsKeterangan(
            result.map((item: any) => ({
              value: item.id.toString(),
              label: `Unit ${item.unit?.nomor_unit || "-"} - ${item.user_perumahan?.nama_user || "-"}`
            }))
          );
        }
      }
    } catch (error) {
      console.error("Gagal mengambil pilihan keterangan:", error);
    }
  };

  // Handler submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    if (!formData.sumber_transaksi || !formData.keterangan_transaksi_id) {
      throw new Error("Sumber Transaksi dan Keterangan Transaksi wajib dipilih.");
    }

    const payload = {
      tanggal: formData.tanggal,
      sumber_transaksi: formData.sumber_transaksi,
      keterangan_transaksi_id: Number(formData.keterangan_transaksi_id),
      kode: formData.kode,
      jumlah: Number(formData.jumlah),
      metode_pembayaran: formData.metode_pembayaran,
      keterangan_objek_transaksi: formData.keterangan_objek_transaksi,
    };

    // 🔥 Tambahkan ini supaya muncul output JSON di console:
    console.log("Data yang akan dikirim:", JSON.stringify(payload, null, 2));

    await storeTransaksiKas(payload, setError);
    resetForm();
  } catch (error: any) {
    console.error(error);
    setError(error.message || "Terjadi kesalahan saat menyimpan transaksi.");
  } finally {
    setLoading(false);
  }
};


  const resetForm = () => {
    setFormData({
      tanggal: "",
      sumber_transaksi: "",
      keterangan_transaksi: "",
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
    handleSelectSumber,
    handleSubmit,
  };
}
