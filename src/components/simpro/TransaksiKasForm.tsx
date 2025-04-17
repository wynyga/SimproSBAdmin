"use client";

import React from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "@/components/form/date-picker";
import { ChevronDownIcon } from "@/icons";
import TextArea from "../form/input/TextArea";

interface Props {
  formData: {
    tanggal: string;
    keterangan_transaksi: string;
    kode: string;
    jumlah: string;
    metode_pembayaran: string;
    keterangan_objek_transaksi: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
  handleDateChange: (date: Date) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function TransaksiKasForm({
  formData,
  handleChange,
  handleSelectChange,
  handleDateChange,
  handleSubmit,
  loading,
}: Props) {
  const jenisOptions = [
    { value: "101", label: "Kas Masuk" },
    { value: "102", label: "Kas Keluar" },
  ];
  return (
    <ComponentCard title="Form Tambah Transaksi Kas">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <DatePicker
            id="tanggal"
            label="Tanggal"
            placeholder="Pilih tanggal"
            onChange={(dates, dateString) => {
              handleDateChange(new Date(dateString));
            }}
          />
        </div>

        <div>
          <Label>Keterangan Transaksi</Label>
          <Input
            name="keterangan_transaksi"
            placeholder="Contoh: Pembayaran DP"
            value={formData.keterangan_transaksi}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Jenis Transaksi</Label>
          <div className="relative">
          <Select
            options={jenisOptions}
            defaultValue={formData.kode}
            placeholder="Pilih jenis transaksi"
            onChange={(value) => handleSelectChange(value, "kode")}
            className="dark:bg-dark-900"
          />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>Jumlah</Label>
          <Input
            name="jumlah"
            type="number"
            placeholder="Contoh: 500000"
            value={formData.jumlah}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Metode Pembayaran</Label>
          <div className="relative">
            <Select
              options={jenisOptions}
              defaultValue={formData.kode}
              placeholder="Pilih jenis transaksi"
              onChange={(value) => handleSelectChange(value, "kode")}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>Keterangan Objek (Opsional)</Label>
          <TextArea
            rows={4}
            placeholder="Contoh: Pembayaran unit A1"
            value={formData.keterangan_objek_transaksi}
            onChange={(value) =>
              handleChange({
                target: {
                  name: "keterangan_objek_transaksi",
                  value,
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {loading ? "Menyimpan..." : "Simpan Transaksi"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
