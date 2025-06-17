"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import { ChevronDownIcon } from "@/icons";
import { getStock, gudangOut } from "../../../../utils/stock";
import { getCostTees } from "../../../../utils/CostTeeApi";

// --- INTERFACE BARU & YANG DIPERBARUI ---
interface StockItem {
  type: string;
  nama_barang: string;
}

interface StockData {
  [category: string]: StockItem[];
}

// 1. Definisikan interface yang lebih detail untuk CostTee
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
// --- AKHIR DARI INTERFACE ---

export default function GudangOutForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [stockData, setStockData] = useState<StockData>({});
  const [filteredItems, setFilteredItems] = useState<StockItem[]>([]);
  
  // 2. Gunakan interface CostTee yang baru
  const [costTees, setCostTees] = useState<CostTee[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    kategori: "",
    kode_barang: "",
    nama_barang: "",
    tanggal_barang_keluar: "",
    peruntukan: "",
    jumlah: 1,
    keterangan: "",
  });

  useEffect(() => {
    const fetchInitial = async () => {
      const stock = await getStock();
      if (stock) {
        setStockData(stock);
        setCategories(Object.keys(stock));
      }

      const tees = await getCostTees(setError);
      if (tees) {
        // 3. Ganti `any` dengan tipe `CostTee`
        const filtered = tees.filter(
          (tee: CostTee) => tee.cost_element?.cost_centre?.cost_code === "KASOUT"
        );
        setCostTees(filtered);
      }
    };
    fetchInitial();
  }, []);

  const handleSelectKategori = (kategori: string) => {
    setFormData((prev) => ({
      ...prev,
      kategori,
      kode_barang: "",
      nama_barang: "",
    }));
    setFilteredItems(stockData[kategori] || []);
  };

  const handleSelectNamaBarang = (nama: string) => {
    const item = filteredItems.find((i) => i.nama_barang === nama);
    if (item) {
      setFormData((prev) => ({
        ...prev,
        nama_barang: item.nama_barang,
        kode_barang: item.type,
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "jumlah" ? +value : value,
    }));
  };

  const handleDateChange = (date: Date) => {
    const formatted = date.toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      tanggal_barang_keluar: formatted,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const result = await gudangOut(
      formData.kode_barang,
      formData.tanggal_barang_keluar,
      formData.peruntukan,
      formData.jumlah,
      formData.keterangan,
      setError
    );

    if (result) {
      setSuccessMessage("Barang keluar berhasil disimpan.");
      setFormData({
        kategori: "",
        kode_barang: "",
        nama_barang: "",
        tanggal_barang_keluar: "",
        peruntukan: "",
        jumlah: 1,
        keterangan: "",
      });
      setFilteredItems([]);
    }

    setLoading(false);
  };

  return (
    <ComponentCard title="Form Input Gudang Keluar">
      {error && <p className="text-sm mb-4 text-red-500 text-center">{error}</p>}
      {successMessage && (
        <p className="text-sm mb-4 text-green-600 text-center">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Kategori Barang</Label>
          <div className="relative">
            <Select
              placeholder="Pilih kategori"
              options={categories.map((cat) => ({
                value: cat,
                label: cat.replace(/_/g, " "),
              }))}
              defaultValue={formData.kategori}
              onChange={handleSelectKategori}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {formData.kategori && (
          <div>
            <Label>Nama Barang</Label>
            <div className="relative">
              <Select
                placeholder="Pilih nama barang"
                options={filteredItems.map((item) => ({
                  value: item.nama_barang,
                  label: item.nama_barang,
                }))}
                defaultValue={formData.nama_barang}
                onChange={handleSelectNamaBarang}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        )}

        <div>
          <Label>Kode Barang</Label>
          <Input
            name="kode_barang"
            value={formData.kode_barang}
            onChange={handleInputChange}
            disabled
          />
        </div>


        <div>
          <DatePicker
            id="tanggal_barang_keluar"
            label="Tanggal Barang Keluar"
            placeholder="Pilih tanggal"
            onChange={(dates, dateStr) => handleDateChange(new Date(dateStr))}
          />
        </div>

        <div>
          <Label>Peruntukan</Label>
          <div className="relative">
            <Select
              placeholder="Pilih peruntukan"
              options={costTees.map((tee) => ({
                value: tee.id.toString(),
                label: tee.description,
              }))}
              defaultValue={formData.peruntukan}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, peruntukan: val }))
              }
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>Jumlah</Label>
          <Input
            name="jumlah"
            type="number"
            min="1"
            value={formData.jumlah}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label>Keterangan</Label>
          <TextArea
            rows={4}
            value={formData.keterangan}
            placeholder="Contoh: pemakaian untuk fondasi unit A1"
            onChange={(val) =>
              handleInputChange({
                target: { name: "keterangan", value: val },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Barang Keluar"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}