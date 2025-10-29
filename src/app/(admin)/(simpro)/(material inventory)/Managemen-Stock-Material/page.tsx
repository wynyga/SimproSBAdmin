"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// Import updateStock dan EditStockModal
import { getStock, updateStock } from "../../../../../../utils/stock";
import EditStockModal,{StockItemEdit} from "@/components/simpro/stock/EditStockModal";

interface StockItem {
  kode_barang: string;
  satuan: string;
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockItemToEdit, setStockItemToEdit] =
    useState<StockItemEdit | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    const data = await getStock();
    if (data) {
      setStockData(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDropdown = (index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const handleOpenEditModal = (item: StockItem) => {
    setStockItemToEdit({
      kode_barang: item.kode_barang,
      nama_barang: item.nama_barang,
      uty: item.uty,
      satuan: item.satuan,
      harga_satuan: item.harga_satuan,
      stock_bahan: item.stock_bahan, // Nilai stock asli tetap dimuat ke state
    });
    setIsModalOpen(true);
    setErrorMsg(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStockItemToEdit(null);
    setErrorMsg(null);
  };

  const handleEditSubmit = async (): Promise<boolean> => {
    if (!stockItemToEdit) return false;

    setErrorMsg(null);

    const dataToUpdate = {
      nama_barang: stockItemToEdit.nama_barang,
      uty: stockItemToEdit.uty,
      satuan: stockItemToEdit.satuan,
      harga_satuan: parseFloat(String(stockItemToEdit.harga_satuan)),
      stock_bahan: parseFloat(String(stockItemToEdit.stock_bahan)), // Tetap dikirim ke API
    };

    if (isNaN(dataToUpdate.harga_satuan)) {
      setErrorMsg("Harga harus berupa angka yang valid.");
      return false;
    }
    // Validasi stock_bahan dihapus karena tidak lagi di-input
    // (diasumsikan nilai dari state selalu valid)

    try {
      const result = await updateStock(
        stockItemToEdit.kode_barang,
        dataToUpdate,
        (err: string) => setErrorMsg(err)
      );

      if (result) {
        await fetchData();
        return true;
      }
      return false;
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui."
      );
      return false;
    }
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
                className="w-full flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition"
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
                  {/* --- PERUBAHAN: grid-cols-5 menjadi grid-cols-6 --- */}
                  <div className="grid grid-cols-6 font-semibold text-gray-600 dark:text-white/80 mb-2">
                    <div>Type</div>
                    <div>Nama Barang</div>
                    <div>Uty</div>
                    <div>Satuan</div> 
                    <div>Harga Satuan</div>
                    <div>Aksi</div>
                  </div>

                  {categoryItems.length > 0 ? (
                    categoryItems.map((item, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-6 py-2 border-t border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white text-sm items-center"
                        >
                          <div>{item.kode_barang}</div> 
                          <div>{item.nama_barang}</div>
                          <div>{item.uty}</div>
                          <div>{item.satuan}</div>
                          <div>{item.harga_satuan}</div>
                          <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Tidak ada data.
                    </p>
                  )}
                </div>
              )}
            </ComponentCard>
          );
        })}
      </div>

      <EditStockModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        stockItem={stockItemToEdit}
        setStockItem={setStockItemToEdit}
        onSubmit={handleEditSubmit}
        error={errorMsg}
      />
    </div>
  );
}

const buttonsData = [
  // ... (data tombol tetap sama)
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