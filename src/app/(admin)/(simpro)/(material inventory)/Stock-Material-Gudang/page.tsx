"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { getStock } from "../../../../../../utils/stock";

interface StockItem {
  kode_barang: string;
  nama_barang: string;
  uty: string;
  satuan: string;
  harga_satuan: number | string;
  stock_bahan: number | string;
  total_price?: number | string;
}

export default function LaporanStokGudangPage() {
  const [stockData, setStockData] = useState<Record<string, StockItem[]>>({});
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStock();
      if (!data) return;

      // Filter: hanya kategori yang punya item dengan stock_bahan > 0
      const filteredData: Record<string, StockItem[]> = {};
      for (const key in data) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
        const items: StockItem[] = data[key] || [];

        const itemsDenganStok = items
          .map((it) => ({
            ...it,
            // pastikan tipe terkonversi, dan hitung total jika belum ada
            harga_satuan: typeof it.harga_satuan === "string" ? parseFloat(String(it.harga_satuan).replace(/[^0-9.-]+/g, "")) || 0 : it.harga_satuan,
            stock_bahan: typeof it.stock_bahan === "string" ? parseFloat(String(it.stock_bahan).replace(/[^0-9.-]+/g, "")) || 0 : it.stock_bahan,
          }))
          .filter((it) => Number(it.stock_bahan) > 0)
          .map((it) => ({
            ...it,
            total_price: (Number(it.harga_satuan) || 0) * (Number(it.stock_bahan) || 0),
          }));

        if (itemsDenganStok.length > 0) {
          filteredData[key] = itemsDenganStok;
        }
      }

      setStockData(filteredData);
    };

    fetchData();
  }, []);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (value?: number | string) => {
    const num = Number(value) || 0;
    // format with thousands separator and 2 decimals
    return num.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 pb-12">
      {/* Global print CSS untuk compact layout (jika tidak menggunakan global.css) */}
      <style jsx>{`
        /* Print style overrides */
        @media print {
          /* Remove backgrounds and shadows */
          .no-print { display: none !important; }
          .card-like { box-shadow: none !important; border-radius: 0.25rem !important; padding: 0 !important; margin: 0 0 0.5rem 0 !important; border: 1px solid #ccc !important; }
          .card-header { background: transparent !important; color: #000 !important; padding: 0.35rem 0.5rem !important; font-weight: 700 !important; border-bottom: 0.5px solid #ddd !important; }
          .card-body { padding: 0.25rem 0.5rem !important; }
          /* Ensure all accordions are expanded when print */
          .accordion-content { display: block !important; }
          /* Minify spacing */
          .compact-row { padding: 0.35rem 0 !important; }
          /* Use black text only */
          * { color: #000 !important; background: transparent !important; -webkit-print-color-adjust: exact !important; }
          /* Fit better on A4 */
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div className="flex items-start justify-between gap-4 mt-6 print:hidden">
        <PageBreadcrumb pageTitle="Stock Material di Gudang" />
        <div className="ml-auto">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Cetak (Print / PDF)
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {buttonsData.map((btn, idx) => {
          const items = stockData[btn.apiKey] || [];
          // W2 + Z3: jika kategori kosong (tidak ada stok), kita sembunyikan (web & print)
          if (!items || items.length === 0) return null;

          return (
            <div key={btn.apiKey} className="card-like border border-gray-100 rounded-xl overflow-hidden">
              {/* Header: tombol accordion (menempel ke isi) */}
              <div className="card-header px-4 py-3 bg-white dark:bg-transparent flex items-center gap-3" role="button">
                <button
                  onClick={() => toggle(idx)}
                  className="flex items-center gap-3 w-full text-left focus:outline-none"
                  aria-expanded={openIndex === idx}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-900 text-white shrink-0">
                      <Image
                        src={`/images/icons/Stock/${btn.icon}.png`}
                        alt={btn.label}
                        width={18}
                        height={18}
                      />
                    </div>
                    <span className="text-lg font-semibold  dark:text-white/80">{btn.label}</span>
                  </div>

                  {/* caret */}
                  <div className="ml-auto text-sm text-gray-500 no-print">
                    {openIndex === idx ? "▾" : "▸"}
                  </div>
                </button>
              </div>

              {/* Body: tabel (compact) */}
              <div
                className={`accordion-content card-body ${openIndex === idx ? "block" : "hidden"} mt-0`}
                // For print: always show (CSS @media print will force display:block)
              >
                <div className="px-4 py-3">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm ">
                      <thead>
                        <tr className="text-left text-gray-600  dark:text-white/80">
                          <th className="py-2 pr-6">Kode Material</th>
                          <th className="py-2 pr-6">Nama Barang</th>
                          <th className="py-2 pr-6">jumlah</th>
                          <th className="py-2 pr-6">Satuan</th>
                          <th className="py-2 pr-6">Harga Satuan</th>
                          <th className="py-2 pr-6">Stock</th>
                          <th className="py-2 pr-6">Total Harga</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it, i) => (
                          <tr key={i} className="compact-row border-t border-gray-100  dark:text-white/80">
                            <td className="py-3 pr-6">{it.kode_barang}</td>
                            <td className="py-3 pr-6">{it.nama_barang}</td>
                            <td className="py-3 pr-6">{it.uty}</td>
                            <td className="py-3 pr-6">{it.satuan}</td>
                            <td className="py-3 pr-6">{formatRupiah(it.harga_satuan)}</td>
                            <td className="py-3 pr-6">{Number(it.stock_bahan)}</td>
                            <td className="py-3 pr-6">{formatRupiah(it.total_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Small footer spacing to avoid clipping on print */}
      <div className="h-6 print:h-2" />
    </div>
  );
}

/* ---------- data tombol kategori ---------- */
const buttonsData = [
  { label: "Day Work", icon: "DayWork", apiKey: "day_works" },
  { label: "Equipment", icon: "Equipment", apiKey: "equipments" },
  { label: "Tools", icon: "Tools", apiKey: "tools" },
  { label: "Land, Stone, Sand", icon: "LandStoneSand", apiKey: "land_stone_sands" },
  { label: "Cement", icon: "Cement", apiKey: "cements" },
  { label: "Rebar", icon: "Rebar", apiKey: "rebars" },
  { label: "Wood", icon: "Wood", apiKey: "woods" },
  { label: "Roof", icon: "Roof", apiKey: "roof_ceiling_tiles" },
  { label: "Keramik", icon: "Keramik", apiKey: "keramik_floors" },
  { label: "Paint", icon: "Paint", apiKey: "paint_glass_wallpapers" },
  { label: "Other", icon: "Other", apiKey: "others" },
  { label: "Oil", icon: "Oil", apiKey: "oil_chemical_perekats" },
  { label: "Sanitary", icon: "Sanitary", apiKey: "sanitaries" },
  { label: "Pipa", icon: "Pipa", apiKey: "piping_pumps" },
  { label: "Lightning", icon: "Lightning", apiKey: "lightings" },
];
