"use client";

import { useState } from "react";
import { getCostTees } from "../../../../utils/CostTeeApi";
import { getTransaksi } from "../../../../utils/Penjualan";
import { storeTransaksiKas } from "../../../../utils/transaksi-kas";
interface CostTee {
  id: number;
  cost_tee_code: string;
  description: string;
  cost_element?: {
    cost_centre?: {
      cost_code: string;
    };
  };
}

interface Transaksi {
  id: number;
  unit?: { nomor_unit: string };
  user_perumahan?: { nama_user: string };
}


interface KeteranganOption {
  value: string;
  label: string;
  rawData?: CostTee | Transaksi; 
}

interface FormData {
  tanggal: string;
  sumber_transaksi: string;
  keterangan_transaksi: string;
  keterangan_transaksi_id: string;
  kode: string;
  jumlah: string;
  metode_pembayaran: string;
  keterangan_objek_transaksi: string;
}

type SetErrorFunc = (error: string | null) => void;

export function useTransaksiKasForm(setError: SetErrorFunc) { 
  const [loading, setLoading] = useState(false);
  const [optionsKeterangan, setOptionsKeterangan] = useState<KeteranganOption[]>([]);

  const [formData, setFormData] = useState<FormData>({
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
      const selected = optionsKeterangan.find((opt) => opt.value === value);
      
      if (formData.sumber_transaksi === "cost_code") {
        // Casting rawData ke CostTee untuk akses properti yang aman
        const costCode = (selected?.rawData as CostTee)?.cost_element?.cost_centre?.cost_code;

        if (costCode === "KASIN") {
          setFormData((prev) => ({ ...prev, [name]: value, kode: "101" }));
        } else if (costCode === "KASOUT") {
          setFormData((prev) => ({ ...prev, [name]: value, kode: "102" }));
        } else {
          setFormData((prev) => ({ ...prev, [name]: value, kode: "" }));
        }
      } else {
        // Untuk "penjualan" atau sumber lain
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
      kode: value === "penjualan" ? "101" : "",
    }));
    setOptionsKeterangan([]);

    try {
      if (value === "cost_code") {
        const result = await getCostTees(setError);
        if (result) {
          setOptionsKeterangan(
            result.map((item: CostTee) => ({ // Ganti 'any' dengan 'CostTee'
              value: item.id.toString(),
              label: `${item.cost_tee_code} - ${item.description}`,
              rawData: item,
            }))
          );
        }
      } else if (value === "penjualan") {
        const result = await getTransaksi(setError);
        const data = result?.data ?? result;

        if (Array.isArray(data)) {
          setOptionsKeterangan(
            data.map((trx: Transaksi) => ({ // Ganti 'any' dengan 'Transaksi'
              value: trx.id.toString(),
              label: `Unit ${trx.unit?.nomor_unit ?? "-"} - ${trx.user_perumahan?.nama_user ?? "-"}`,
              rawData: trx,
            }))
          );
        } else {
          setOptionsKeterangan([]);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil pilihan keterangan:", error);
      setOptionsKeterangan([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.sumber_transaksi || !formData.keterangan_transaksi_id || !formData.kode) {
        throw new Error("Sumber, keterangan, dan jenis transaksi wajib diisi.");
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
    } catch (error: unknown) { // Ganti 'any' dengan 'unknown'
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui saat menyimpan transaksi.");
      }
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