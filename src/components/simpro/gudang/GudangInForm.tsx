"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import { ChevronDownIcon } from "@/icons";
import TextArea from "@/components/form/input/TextArea";
import { getStock, gudangIn } from "../../../../utils/stock";

interface StockItem {
  kode_barang: string;
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
    sistem_pembayaran: "",
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

    // Validasi frontend sederhana
    if (!formData.sistem_pembayaran) {
      setError("Sistem pembayaran harus dipilih.");
      setLoading(false);
      return;
    }

    const result = await gudangIn(
      formData.kode_barang,
      formData.pengirim,
      formData.no_nota,
      formData.tanggal_barang_masuk,
      formData.jumlah,
      formData.keterangan,
      formData.sistem_pembayaran,
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
        sistem_pembayaran: "",
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
        <p className="text-sm mb-4 text-green-600 text-center">
          {successMessage}
        </p>
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
              value={formData.kategori}
              onChange={handleSelectKategori}
            />
            <span className="absolute text-gray-500 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
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
                
                // PERUBAHAN 1: 'options' menggunakan kode_barang sebagai value
                options={filteredItems.map((item) => ({
                  value: item.kode_barang, // <-- Gunakan ID unik
                  label: item.nama_barang, // <-- Ini untuk tampilan
                }))}

                // PERUBAHAN 2: 'value' dari Select sekarang adalah kode_barang
                value={formData.kode_barang}
                
                // PERUBAHAN 3: 'onChange' sekarang menerima 'kode'
                onChange={(kode) => {
                  // Cari item berdasarkan 'kode' yang dipilih
                  const selected = filteredItems.find(
                    (item) => item.kode_barang === kode
                  );
                  if (selected) {
                    setFormData((prev) => ({
                      ...prev,
                      nama_barang: selected.nama_barang, // Tetap isi nama_barang
                      kode_barang: selected.kode_barang, // Isi kode_barang dari 'kode'
                    }));
                  }
                }}
              />
              <span className="absolute text-gray-500 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
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
          <Label>Sistem Pembayaran</Label>
          <div className="relative">
            <Select
              placeholder="Pilih sistem pembayaran"
              options={[
                { value: "Cash", label: "Cash" },
                { value: "Dua Mingguan", label: "Dua Mingguan" },
                { value: "Bulanan", label: "Bulanan" },
              ]}
              value={formData.sistem_pembayaran}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  sistem_pembayaran: value,
                }))
              }
            />
            <span className="absolute text-gray-500 dark:text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none">
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
