"use client";

import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";

// 1. Perbarui tipe data 'onSubmit'
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    blok_id: number;
    tipe_rumah_id: number;
    nomor_unit: string;
    kategori: string; // <-- Tambahkan ini
  }) => void;
  blokOptions: { id: number; nama_blok: string }[];
  tipeRumahOptions: { id: number; tipe_rumah: string }[];
}

export default function AddUnitModal({
  isOpen,
  onClose,
  onSubmit,
  blokOptions,
  tipeRumahOptions,
}: Props) {
  // 2. Tambahkan 'kategori' ke state
  const [formData, setFormData] = useState({
    blok_id: "",
    tipe_rumah_id: "",
    nomor_unit: "",
    kategori: "", // <-- Tambahkan ini
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // 3. Perbarui reset state
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        blok_id: "",
        tipe_rumah_id: "",
        nomor_unit: "",
        kategori: "", // <-- Tambahkan ini
      });
      setValidationError(null);
    }
  }, [isOpen]);

  // 4. Perbarui validasi dan data submit
  const handleSubmit = () => {
    if (
      !formData.blok_id ||
      !formData.tipe_rumah_id ||
      !formData.nomor_unit ||
      !formData.kategori // <-- Tambahkan ini
    ) {
      setValidationError("Semua field wajib diisi.");
      return;
    }
    onSubmit({
      blok_id: Number(formData.blok_id),
      tipe_rumah_id: Number(formData.tipe_rumah_id),
      nomor_unit: formData.nomor_unit,
      kategori: formData.kategori, // <-- Tambahkan ini
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Tambah Unit</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Blok</Label>
            <div className="relative">
              <Select
                placeholder="Pilih blok"
                value={formData.blok_id}
                options={blokOptions.map((b) => ({
                  value: String(b.id),
                  label: b.nama_blok,
                }))}
                onChange={(val) => setFormData({ ...formData, blok_id: val })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div>
            <Label>Tipe Rumah</Label>
            <div className="relative">
              <Select
                placeholder="Pilih tipe rumah"
                value={formData.tipe_rumah_id}
                options={tipeRumahOptions.map((t) => ({
                  value: String(t.id),
                  label: t.tipe_rumah,
                }))}
                onChange={(val) =>
                  setFormData({ ...formData, tipe_rumah_id: val })
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* 5. Tambahkan Form Field untuk Kategori */}
          <div>
            <Label>Kategori</Label>
            <div className="relative">
              <Select
                placeholder="Pilih kategori unit"
                value={formData.kategori}
                options={[
                  { value: "standar", label: "Standar" },
                  { value: "non standar", label: "Non Standar" },
                  { value: "sudut", label: "Sudut" },
                ]}
                onChange={(val) => setFormData({ ...formData, kategori: val })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div>
            <Label>Nomor Unit</Label>
            <Input
              name="nomor_unit"
              placeholder="Contoh: A-01"
              value={formData.nomor_unit}
              onChange={(e) =>
                setFormData({ ...formData, nomor_unit: e.target.value })
              }
            />
          </div>

          {validationError && (
            <p className="text-sm text-red-500 text-center">
              {validationError}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Simpan
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
