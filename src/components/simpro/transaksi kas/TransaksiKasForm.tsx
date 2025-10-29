"use client";

import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
// import DatePicker from "@/components/form/date-picker";
import { ChevronDownIcon } from "@/icons";
import TextArea from "@/components/form/input/TextArea";
import Input from "@/components/form/input/InputField";
import { DatePicker } from "antd";
import dayjs from "dayjs";

// Interface Props (tidak ada perubahan)
interface Props {
  formData: {
    tanggal: string;
    keterangan_transaksi_id: string;
    kode: string;
    jumlah: string;
    metode_pembayaran: string;
    keterangan_objek_transaksi: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSelectChange: (value: string, name: string) => void;
  handleDateChange: (date: Date | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleJenisTransaksiChange: (value: "101" | "102") => void;
  optionsKeterangan: { value: string; label: string }[];
  loading: boolean;
}

export default function TransaksiKasForm({
  formData,
  handleChange,
  handleSelectChange,
  handleDateChange,
  handleSubmit,
  handleJenisTransaksiChange,
  optionsKeterangan,
  loading,
}: Props) {
  const metodePembayaranOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Transfer Bank", label: "Transfer Bank" },
    { value: "Cek", label: "Cek" },
    { value: "Giro", label: "Giro" },
    { value: "Draft", label: "Draft" },
  ];
  return (
    <ComponentCard title="Form Tambah Transaksi Kas">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tanggal */}
        <div>
          <Label>Tanggal</Label>
          <div className="relative">
            <DatePicker
              id="tanggal"
              placeholder="Pilih tanggal"
              format="DD-MM-YYYY"
              value={formData.tanggal ? dayjs(formData.tanggal) : null}
              onChange={(date) => {
                handleDateChange(date ? date.toDate() : null);
              }}
              style={{ width: "100%" }}
              className="dark:bg-dark-900"
            />
          </div>
        </div>


        {/* 1. Jenis Transaksi (Tidak ada perubahan) */}
        <div>
          <Label>Jenis Transaksi</Label>
          <div className="relative">
            <Select
              key={`jenis-${formData.kode}`}
              options={[
                { value: "101", label: "Kas Masuk" },
                { value: "102", label: "Kas Keluar" },
              ]}
              placeholder="Pilih Jenis Transaksi"
              value={formData.kode}
              onChange={(value) => handleJenisTransaksiChange(value as "101" | "102")}
              className="dark:bg-dark-900"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {/* 2. Keterangan Transaksi (Sudah diperbaiki) */}
        {formData.kode && (
          <div>
            <Label>Keterangan Transaksi</Label>
            <div className="relative">
              <Select
                key={`keterangan-${formData.keterangan_transaksi_id}`}
                options={optionsKeterangan}
                placeholder={
                  formData.kode === "101"
                    ? "Pilih Keterangan Kas Masuk (KI...)"
                    : "Pilih Keterangan Kas Keluar (KO...)"
                }
                value={formData.keterangan_transaksi_id}
                onChange={(value) =>
                  handleSelectChange(value, "keterangan_transaksi_id")
                }
                className="dark:bg-dark-900"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        )}

        {/* Jumlah (Tidak ada perubahan) */}
        <div>
          <Label>Jumlah</Label>
          <Input
            name="jumlah"
            type="text"
            placeholder="Contoh: 500.000"
            value={
              formData.jumlah
                ? Number(formData.jumlah).toLocaleString("id-ID")
                : "0"
            }
            onChange={(e) => {
              const raw = e.target.value.replace(/\./g, "");
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

        {/* Metode Pembayaran (Sudah diperbaiki) */}
        <div>
          <Label>Metode Pembayaran</Label>
          <div className="relative">
            <Select
              key={`metode-${formData.metode_pembayaran}`}
              options={metodePembayaranOptions}
              value={formData.metode_pembayaran}
              placeholder="Pilih metode pembayaran"
              onChange={(value) => handleSelectChange(value, "metode_pembayaran")}
              className="dark:bg-dark-900"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {/* Keterangan Objek (Tidak ada perubahan) */}
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

        {/* Submit (Tidak ada perubahan) */}
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