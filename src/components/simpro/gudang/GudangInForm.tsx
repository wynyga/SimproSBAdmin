"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import { ChevronDownIcon } from "@/icons";
import TextArea from "@/components/form/input/TextArea";
import { getStock,gudangIn } from "../../../../utils/stock";

interface StockItem {
  type: string;
  nama_barang: string;
}

interface StockData {
  [category: string]: StockItem[];
}

export default function GudangInForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [stockData, setStockData] = useState<StockData>({});
  const [filteredItems, setFilteredItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    kategori: "",
    kode_barang: "",
    nama_barang: "",
    pengirim: "",
    no_nota: "",
    tanggal_barang_masuk: "",
    jumlah: 1,
    keterangan: "",
  });

  useEffect(() => {
    const fetchStock = async () => {
      const data = await getStock();
      if (data) {
        setStockData(data);
        setCategories(Object.keys(data));
      }
    };
    fetchStock();
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

  const handleSelectKodeBarang = (kode: string) => {
    const selectedItem = filteredItems.find((item) => item.type === kode);
    if (selectedItem) {
      setFormData((prev) => ({
        ...prev,
        kode_barang: selectedItem.type,
        nama_barang: selectedItem.nama_barang,
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
      tanggal_barang_masuk: formatted,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const result = await gudangIn(
      formData.kode_barang,
      formData.pengirim,
      formData.no_nota,
      formData.tanggal_barang_masuk,
      formData.jumlah,
      formData.keterangan,
      setError
    );

    if (result) {
      setSuccessMessage("Barang berhasil disimpan.");
      setFormData({
        kategori: "",
        kode_barang: "",
        nama_barang: "",
        pengirim: "",
        no_nota: "",
        tanggal_barang_masuk: "",
        jumlah: 1,
        keterangan: "",
      });
      setFilteredItems([]);
    }

    setLoading(false);
  };

  return (
    <ComponentCard title="Form Input Gudang Masuk">
      {error && (
        <p className="text-sm mb-4 text-red-500 text-center">{error}</p>
      )}
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
            <span className="absolute text-gray-500 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {formData.kategori && (
          <div>
            <Label>Kode Barang</Label>
            <div className="relative">
              <Select
                placeholder="Pilih kode barang"
                options={filteredItems.map((item) => ({
                  value: item.type,
                  label: item.type,
                }))}
                defaultValue={formData.kode_barang}
                onChange={handleSelectKodeBarang}
              />
              <span className="absolute text-gray-500 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        )}

        <div>
          <Label>Nama Barang</Label>
          <Input
            name="nama_barang"
            value={formData.nama_barang}
            onChange={handleInputChange}
            disabled
          />
        </div>

        <div>
          <Label>Pengirim</Label>
          <Input
            name="pengirim"
            placeholder="Nama pengirim"
            value={formData.pengirim}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label>No Nota</Label>
          <Input
            name="no_nota"
            placeholder="Nomor nota"
            value={formData.no_nota}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <DatePicker
            id="tanggal_barang_masuk"
            label="Tanggal Barang Masuk"
            placeholder="Pilih tanggal"
            onChange={(dates, dateStr) => handleDateChange(new Date(dateStr))}
          />
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
            placeholder="Contoh: dikirim dari gudang pusat"
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
            {loading ? "Menyimpan..." : "Simpan Barang Masuk"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
