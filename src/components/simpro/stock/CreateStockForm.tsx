"use client";

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { addStock } from "../../../../utils/stock";

const modelMap = [
  "day_work",
  "equipment",
  "tools",
  "land_stone_sand",
  "cement",
  "rebar",
  "wood",
  "roof_ceiling_tile",
  "keramik_floor",
  "paint_glass_wallpaper",
  "others",
  "oil_chemical_perekat",
  "sanitary",
  "piping_pump",
  "lighting",
];

export default function CreateStockForm() {
  const [formData, setFormData] = useState({
    jenis_peralatan: "",
    nama_barang: "",
    uty: "1",
    satuan: "pcs",
    harga_satuan: 0,
    stock_bahan: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "harga_satuan" || name === "stock_bahan" ? +value : value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
  
    // Validasi manual
    if (
      !formData.jenis_peralatan ||
      !formData.nama_barang ||
      !formData.uty ||
      !formData.satuan ||
      formData.harga_satuan <= 0 ||
      formData.stock_bahan <= 0
    ) {
      setError("Semua field wajib diisi dengan benar.");
      return;
    }
  
    setLoading(true);
    await addStock(formData, setError);
  
    if (!error) {
      setMessage("Stok berhasil ditambahkan!");
      setFormData({
        jenis_peralatan: "",
        nama_barang: "",
        uty: "1",
        satuan: "pcs",
        harga_satuan: 0,
        stock_bahan: 0,
      });
  
      setTimeout(() => setMessage(null), 3000);
    }
  
    setLoading(false);
  };
  

  return (
    <ComponentCard title="Form Tambah Stock">
      {error && (
        <p className="text-sm mb-4 text-red-500 text-center">{error}</p>
      )}
      {message && (
        <p className="text-sm mb-4 text-green-600 text-center">{message}</p>
      )}

      <div className="space-y-5">
        <div>
          <Label>Jenis Stock</Label>
          <Select
            placeholder="Pilih jenis"
            defaultValue={formData.jenis_peralatan}
            options={modelMap.map((item) => ({
              value: item,
              label: item.replace(/_/g, " ").toUpperCase(),
            }))}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, jenis_peralatan: val }))
            }
          />
        </div>

        <div>
          <Label>Nama Barang</Label>
          <Input
            name="nama_barang"
            placeholder="Contoh: Sekop Besi"
            value={formData.nama_barang}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>UTY</Label>
            <Input
              name="uty"
              value={formData.uty}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Satuan</Label>
            <Input
              name="satuan"
              value={formData.satuan}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Harga Satuan</Label>
            <Input
              name="harga_satuan"
              type="number"
              min="0"
              value={formData.harga_satuan}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Stock Bahan</Label>
            <Input
                name="stock_bahan"
                type="number"
                min="0" 
                value={formData.stock_bahan}
                onChange={handleInputChange}
                required
            />
          </div>
        </div>

        <Button
          type="button"
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Tambah Stock"}
        </Button>
      </div>
    </ComponentCard>
  );
}
