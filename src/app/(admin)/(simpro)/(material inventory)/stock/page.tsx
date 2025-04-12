"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getStock } from "../../../../../../utils/stock";

interface StockItem {
  type: string;
  nama_barang: string;
  uty: string;
  harga_satuan: number | string;
  stock_bahan: number | string;
  total_price: number | string;
}

export default function StockPage() {
  const [stockData, setStockData] = useState<Record<string, StockItem[]>>({});
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStock();
      if (data) {
        setStockData(data);
      }
    };
    fetchData();
  }, []);

  const toggleDropdown = (index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Stok Bahan & Material" />

      <div className="grid grid-cols-1 gap-5 mt-6">
        {buttonsData.map((btn, index) => {
          const categoryItems = stockData[btn.apiKey] || [];

          return (
            <ComponentCard key={index} title={btn.label}>
              <button
                onClick={() => toggleDropdown(index)}
                className="w-full flex items-center gap-3 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition"
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

              {activeDropdown === index && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 text-sm">
                  <div className="grid grid-cols-6 font-semibold text-gray-600 dark:text-white/80 mb-2">
                    <div>Type</div>
                    <div>Nama Barang</div>
                    <div>Uty</div>
                    <div>Harga Satuan</div>
                    <div>Stock</div>
                    <div>Total</div>
                  </div>

                  {categoryItems.length > 0 ? (
                    categoryItems.map((item, i) => (
                      <div key={i} className="grid grid-cols-6 py-2 border-t border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white text-sm">
                        <div>{item.type}</div>
                        <div>{item.nama_barang}</div>
                        <div>{item.uty}</div>
                        <div>Rp {(+item.harga_satuan).toLocaleString("id-ID")}</div>
                        <div>{item.stock_bahan}</div>
                        <div>Rp {(+item.total_price).toLocaleString("id-ID")}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Tidak ada data.</p>
                  )}
                </div>
              )}
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
