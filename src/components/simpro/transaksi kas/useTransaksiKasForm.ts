"use client";

import { useState } from "react";
import { getCostTees } from "../../../../utils/CostTeeApi";
import { getTransaksi } from "../../../../utils/Penjualan";
import { storeTransaksiKas } from "../../../../utils/transaksi-kas";

interface KeteranganOption {
  value: string;
  label: string;
  rawData?: any;
}

export function useTransaksiKasForm(setError: Function) {
  const [loading, setLoading] = useState(false);
  const [optionsKeterangan, setOptionsKeterangan] = useState<KeteranganOption[]>([]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === "keterangan_transaksi_id") {
      if (formData.sumber_transaksi === "cost_code") {
        const selected = optionsKeterangan.find((opt) => opt.value === value);
        const costCode = selected?.rawData?.cost_element?.cost_centre?.cost_code;
  
        if (costCode === "KASIN") {
          setFormData((prev) => ({ ...prev, [name]: value, kode: "101" }));
        } else if (costCode === "KASOUT") {
          setFormData((prev) => ({ ...prev, [name]: value, kode: "102" }));
        } else {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
      } else if (formData.sumber_transaksi === "penjualan") {
        // Semua penjualan dianggap kas masuk
        setFormData((prev) => ({ ...prev, [name]: value, kode: "101" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const handleDateChange = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, tanggal: formattedDate }));
  };

  const handleSelectSumber = async (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sumber_transaksi: value,
      keterangan_transaksi_id: "",
      kode: "", // reset jenis transaksi
    }));
    setOptionsKeterangan([]);

    try {
      if (value === "cost_code") {
        const result = await getCostTees(setError);
        if (result) {
          setOptionsKeterangan(
            result.map((item: any) => ({
              value: item.id.toString(),
              label: `${item.cost_tee_code} - ${item.description}`,
              rawData: item,
            }))
          );
        }
      } else if (value === "penjualan") {
        const result = await getTransaksi(setError);
        if (result) {
          setOptionsKeterangan(
            result.map((item: any) => ({
              value: item.id.toString(),
              label: `Unit ${item.unit?.nomor_unit || "-"} - ${item.user_perumahan?.nama_user || "-"}`,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Gagal mengambil pilihan keterangan:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.sumber_transaksi || !formData.keterangan_transaksi_id || !formData.kode) {
        throw new Error("Sumber transaksi, keterangan transaksi, dan jenis transaksi wajib diisi.");
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
