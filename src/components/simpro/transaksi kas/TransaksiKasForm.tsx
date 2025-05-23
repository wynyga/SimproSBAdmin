"use client";

import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import { ChevronDownIcon } from "@/icons";
import TextArea from "@/components/form/input/TextArea";

interface Props {
  formData: {
    tanggal: string;
    sumber_transaksi: string;
    keterangan_transaksi_id: string;
    kode: string;
    jumlah: string;
    metode_pembayaran: string;
    keterangan_objek_transaksi: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
  handleDateChange: (date: Date) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleSelectSumber: (value: string) => void;
  optionsKeterangan: { value: string; label: string }[];
  loading: boolean;
}

export default function TransaksiKasForm({
  formData,
  handleChange,
  handleSelectChange,
  handleDateChange,
  handleSubmit,
  handleSelectSumber,
  optionsKeterangan,
  loading,
}: Props) {
  const sumberOptions = [
    { value: "cost_code", label: "Cost Code" },
    { value: "penjualan", label: "Penjualan" },
  ];

  const metodePembayaranOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Transfer Bank", label: "Transfer Bank" },
    { value: "Cek", label: "Cek" },
    { value: "Giro", label: "Giro" },
    { value: "Draft", label: "Draft" },
  ];

  const renderJenisTransaksiLabel = () => {
    switch (formData.kode) {
      case "101":
        return "Kas Masuk";
      case "102":
        return "Kas Keluar";
      default:
        return "";
    }
  };

  return (
    <ComponentCard title="Form Tambah Transaksi Kas">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tanggal */}
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

        {/* Sumber Transaksi */}
        <div>
          <Label>Sumber Transaksi</Label>
          <div className="relative">
            <Select
              options={sumberOptions}
              placeholder="Pilih sumber transaksi"
              defaultValue={formData.sumber_transaksi}
              onChange={(value) => handleSelectSumber(value)}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {/* Keterangan Transaksi */}
        {formData.sumber_transaksi && (
          <div>
            <Label>Keterangan Transaksi</Label>
            <div className="relative">
              <Select
                options={optionsKeterangan}
                placeholder="Pilih keterangan"
                defaultValue={formData.keterangan_transaksi_id}
                onChange={(value) => handleSelectChange(value, "keterangan_transaksi_id")}
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        )}

        {/* Jenis Transaksi (otomatis & readonly) */}
        <div>
          <Label>Jenis Transaksi</Label>
          <Input
            name="kode"
            value={renderJenisTransaksiLabel()}
            onChange={() => {}}
            disabled
          />
        </div>

        {/* Jumlah */}
        <div>
          <Label>Jumlah</Label>
          <Input
            name="jumlah"
            type="text"
            placeholder="Contoh: 500.000"
            value={Number(formData.jumlah || 0).toLocaleString("id-ID")}
            onChange={(e) => {
              const raw = e.target.value.replace(/\./g, ""); // hilangkan titik
              if (!isNaN(Number(raw))) {
                handleChange({
                  target: {
                    name: "jumlah",
                    value: raw,
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            required
          />
        </div>

        {/* Metode Pembayaran */}
        <div>
          <Label>Metode Pembayaran</Label>
          <div className="relative">
            <Select
              options={metodePembayaranOptions}
              defaultValue={formData.metode_pembayaran}
              placeholder="Pilih metode pembayaran"
              onChange={(value) => handleSelectChange(value, "metode_pembayaran")}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {/* Keterangan Objek */}
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

        {/* Submit */}
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
