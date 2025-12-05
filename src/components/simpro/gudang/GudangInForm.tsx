"use client";

import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import { ChevronDownIcon } from "@/icons"; // Pastikan path icon benar
// Jika Anda punya icon printer, import disini, misal: import { FaPrint, FaArrowLeft } from "react-icons/fa";
import TextArea from "@/components/form/input/TextArea";
import { getStock, gudangIn } from "../../../../utils/stock";

interface StockItem {
  kode_barang: string;
  nama_barang: string;
}

interface StockData {
  [category: string]: StockItem[];
}

// Interface untuk menampung respon dari Backend
interface TransactionResult {
  gudang_in: { id: number; no_nota: string; status: string };
  sttb: { id: number; no_doc: string } | null;
  kwitansi: { id: number; no_doc: string } | null;
}

export default function GudangInForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [stockData, setStockData] = useState<StockData>({});
  const [filteredItems, setFilteredItems] = useState<StockItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk menyimpan hasil transaksi sukses
  const [createdData, setCreatedData] = useState<TransactionResult | null>(null);

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

  // Fungsi untuk Reset Form dan Input Baru
  const handleReset = () => {
    setCreatedData(null); // Kembali ke mode form
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.sistem_pembayaran) {
      setError("Sistem pembayaran harus dipilih.");
      setLoading(false);
      return;
    }

    try {
      // NOTE: Pastikan fungsi 'gudangIn' di utils mengembalikan FULL RESPONSE DATA
      // bukan hanya boolean. Lihat catatan di bawah kode ini.
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

      // Asumsi: result.data berisi { gudang_in, sttb, kwitansi }
      if (result && result.data) {
        setCreatedData(result.data);
      } else if (result === true) {
         // Fallback jika utils belum diupdate (hanya return true)
         setError("Data tersimpan, tapi gagal mengambil ID dokumen untuk cetak. Silakan cek riwayat.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };
  // --- TAMPILAN SUKSES & OPSI CETAK ---
  if (createdData) {
    return (
      <ComponentCard title="Transaksi Berhasil">
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Data Tersimpan & Terverifikasi
            </h3>
          </div>

          <div className="pt-6 border-t border-gray-100 w-full">
            <button
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700 font-medium underline"
            >
              Input Barang Masuk Baru
            </button>
          </div>
        </div>
      </ComponentCard>
    );
  }

  // --- TAMPILAN FORM INPUT ---
  return (
    <ComponentCard title="Form Input Gudang Masuk">
      {error && (
        <p className="text-sm mb-4 text-red-500 text-center bg-red-50 py-2 rounded">{error}</p>
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
                options={filteredItems.map((item) => ({
                  value: item.kode_barang,
                  label: item.nama_barang,
                }))}
                value={formData.kode_barang}
                onChange={(kode) => {
                  const selected = filteredItems.find(
                    (item) => item.kode_barang === kode
                  );
                  if (selected) {
                    setFormData((prev) => ({
                      ...prev,
                      nama_barang: selected.nama_barang,
                      kode_barang: selected.kode_barang,
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
            className="bg-gray-100 dark:bg-gray-800"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <Label>Pengirim / Supplier</Label>
            <Input
                name="pengirim"
                placeholder="Nama pengirim"
                value={formData.pengirim}
                onChange={handleInputChange}
                required
            />
            </div>

            <div>
            <Label>No Nota / Surat Jalan</Label>
            <Input
                name="no_nota"
                placeholder="Nomor nota"
                value={formData.no_nota}
                onChange={handleInputChange}
                required
            />
            </div>
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
                // { value: "Transfer Bank", label: "Transfer Bank" },
                // { value: "Giro", label: "Giro" },
                // { value: "Cek", label: "Cek" },
                // { value: "Draft", label: "Draft" },
                { value: "Dua Mingguan", label: "Dua Mingguan (Kredit)" },
                { value: "Bulanan", label: "Bulanan (Kredit)" },
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
            rows={3}
            value={formData.keterangan}
            placeholder="Keterangan tambahan (opsional)"
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
            className="w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-medium text-white hover:bg-brand-700 transition shadow-sm"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Simpan & Verifikasi Otomatis"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}