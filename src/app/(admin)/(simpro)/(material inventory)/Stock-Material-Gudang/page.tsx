"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getStock } from "../../../../../../utils/stock";

// Interface berdasarkan file yang Anda berikan
interface StockItem {
  kode_barang: string; // Ini akan digunakan sebagai "Kode Material"
  nama_barang: string;
  uty: string;
  harga_satuan: number | string;
  stock_bahan: number | string;
  total_price: number | string;
}

export default function LaporanStokGudangPage() {
  const [stockData, setStockData] = useState<Record<string, StockItem[]>>({});
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStock();
      if (data) {
        // Objek baru untuk menampung data yang sudah difilter
        const filteredData: Record<string, StockItem[]> = {};

        // Loop melalui setiap kategori di data (mis: 'day_works', 'equipments')
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const items = data[key];

            // Filter item yang stock_bahan > 0
            const itemsDenganStok = items.filter(
              (item: StockItem) => parseFloat(String(item.stock_bahan)) > 0
            );

            // Hanya tambahkan kategori ke data baru jika ada item yang lolos filter
            if (itemsDenganStok.length > 0) {
              filteredData[key] = itemsDenganStok;
            }
          }
        }
        setStockData(filteredData); // Set state HANYA dengan data yang ada stok
      }
    };
    fetchData();
  }, []);

  const toggleDropdown = (index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  // Fungsi untuk memicu print browser
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* --- PERUBAHAN: Judul Halaman dan Tombol Cetak --- */}
      <div className="flex justify-between items-center print:hidden">
        <PageBreadcrumb pageTitle="Stock Material di Gudang" />
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md inline-flex items-center gap-2 transition"
        >
          {/* Anda bisa ganti dengan icon print jika ada */}
          <span>Cetak (Print / PDF)</span>
        </button>
      </div>
      {/* --- AKHIR PERUBAHAN --- */}

      <div className="grid grid-cols-1 gap-5 mt-6">
        {buttonsData.map((btn, index) => {
          // Ambil item yang (sudah difilter di useEffect)
          const categoryItems = stockData[btn.apiKey] || [];

          // --- PERUBAHAN: Jangan render kategori jika tidak ada item stok ---
          if (categoryItems.length === 0) {
            return null;
          }
          // --- AKHIR PERUBAHAN ---

          return (
            <ComponentCard key={index} title={btn.label}>
              {/* --- PERUBAHAN: Sembunyikan tombol accordion saat print --- */}
              <button
                onClick={() => toggleDropdown(index)}
                className="w-full flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition print:hidden"
              >
                <Image
                  src={`/images/icons/Stock/${btn.icon}.png`}
                  alt={btn.label}
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                <span className="font-medium">{btn.label}</span>
              </button>
              {/* --- AKHIR PERUBAHAN --- */}

              {/* --- PERUBAHAN: Selalu tampilkan blok ini saat print --- */}
              <div
                className={`${
                  activeDropdown === index ? "block" : "hidden"
                } mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 text-sm print:block`}
              >
                {/* --- AKHIR PERUBAHAN --- */}

                {/* Kolom sudah sesuai permintaan (6 kolom) */}
                <div className="grid grid-cols-6 font-semibold text-gray-600 dark:text-white/80 mb-2">
                  <div>Kode Material</div> 
                  <div>Nama Barang</div>
                  <div>Uty</div>
                  <div>Harga Satuan</div>
                  <div>Stock</div>
                  <div>Total</div>
                </div>

                {/* categoryItems sudah di-filter, jadi tidak perlu .length > 0 */}
                {categoryItems.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 py-2 border-t border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white text-sm"
                  >
                    <div>{item.kode_barang}</div>
                    <div>{item.nama_barang}</div>
                    <div>{item.uty}</div>
                    <div>{item.harga_satuan}</div>
                    <div>{item.stock_bahan}</div>
                    <div>{item.total_price}</div>
                  </div>
                ))}
                {/* Tidak perlu 'Tidak ada data' karena card sudah di-filter */}
              </div>
            </ComponentCard>
          );
        })}
      </div>
    </div>
  );
}

const buttonsData = [
  { label: "Day Work", icon: "DayWork", apiKey: "day_works" },
  { label: "Equipment", icon: "Equipment", apiKey: "equipments" },
  { label: "Tools", icon: "Tools", apiKey: "tools" },
  {
    label: "Land, Stone, Sand",
    icon: "LandStoneSand",
    apiKey: "land_stone_sands",
  },
  { label: "Cement", icon: "Cement", apiKey: "cements" },
  { label: "Rebar", icon: "Rebar", apiKey: "rebars" },
  { label: "Wood", icon: "Wood", apiKey: "woods" },
  { label: "Roof", icon: "Roof", apiKey: "roof_ceiling_tiles" },
  { label: "Keramik", icon: "Keramik", apiKey: "keramik_floors" },
  {
    label: "Paint",
    icon: "Paint",
    apiKey: "paint_glass_wallpapers",
  },
  { label: "Other", icon: "Other", apiKey: "others" },
  { label: "Oil", icon: "Oil", apiKey: "oil_chemical_perekats" },
  { label: "Sanitary", icon: "Sanitary", apiKey: "sanitaries" },
  { label: "Pipa", icon: "Pipa", apiKey: "piping_pumps" },
  { label: "Lightning", icon: "Lightning", apiKey: "lightings" },
];