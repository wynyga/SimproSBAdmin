"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SearchForm from "../../../../../../../component/SearchForm";
import SearchResults from "../../../../../../../component/SearchResults";
import UpdateStockModal from "../../../../../../../component/UpdateStockModal";
import { updateStock,searchStock, } from "../../../../../../../utils/stock";
import { StockData } from "../../../../../../../utils/StockData";

export default function SearchStockPage() {
  const [mounted, setMounted] = useState(false);
  const [searchParams, setSearchParams] = useState({ nama_barang: "", kode_barang: "" });
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSearch = async () => {
    setError(null);
    await searchStock(
      searchParams,
      (data: Record<string, StockData[]>) => {
        const combinedResults = Object.values(data).flat();
        setSearchResults(combinedResults);
      },
      setError
    );
  };

  const handleUpdateStock = async (): Promise<boolean> => {
    if (!selectedStock) return false;
  
    setError(null);
    setMessage(null);
  
    const newValidationErrors: { [key: string]: boolean } = {};
    const requiredFields: (keyof typeof selectedStock)[] = [
      "nama_barang",
      "uty",
      "satuan",
      "harga_satuan",
      "stock_bahan",
    ];
  
    requiredFields.forEach((field) => {
      if (
        selectedStock[field] === "" ||
        selectedStock[field] === null ||
        selectedStock[field] === undefined
      ) {
        newValidationErrors[field] = true;
      }
    });
  
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      setError("Semua field harus diisi.");
      return false; // <--- penting
    }
  
    let errorCaught = false;
    await updateStock(
      selectedStock.kode_barang,
      {
        nama_barang: selectedStock.nama_barang,
        uty: selectedStock.uty,
        satuan: selectedStock.satuan,
        harga_satuan: Number(selectedStock.harga_satuan),
        stock_bahan: Number(selectedStock.stock_bahan),
      },
      (err: string) => {
        if (err) {
          setError(err);
          errorCaught = true;
        }
      }
    );
  
    if (errorCaught) return false;
  
    setSearchResults((prevResults) =>
      prevResults.map((item) =>
        item.kode_barang === selectedStock.kode_barang
          ? {
              ...selectedStock,
              harga_satuan: `${Number(selectedStock.harga_satuan).toLocaleString("id-ID")}`,
              total_price: `${(
                Number(selectedStock.harga_satuan) * Number(selectedStock.stock_bahan)
              ).toLocaleString("id-ID")}`,
            }
          : item
      )
    );
  
    setMessage("Stok berhasil diperbarui.");
    setValidationErrors({});
    setTimeout(() => setMessage(null), 3000);
  
    return true;
  };
   
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Pencarian Stok" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Form Pencarian</h3>
          <button
            onClick={() => router.push("/stock")}
            className="inline-flex items-center gap-2 rounded bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
          >
            Kembali ke Stok
          </button>
        </div>

        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">{error}</div>}
        {message && <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">{message}</div>}

        <SearchForm
          searchParams={searchParams}
          handleInputChange={(e) =>
            setSearchParams({ ...searchParams, [e.target.name]: e.target.value })
          }
          handleSearch={handleSearch}
        />

        <SearchResults
        searchResults={searchResults}
        handleSelectStock={(stock) => {
            setSelectedStock(stock);
            setModalOpen(true);
        }}
        />

        <UpdateStockModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setValidationErrors({});
            setError(null);
          }}
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          handleUpdateStock={handleUpdateStock}
          validationErrors={validationErrors}
          errorMessage={error}
        />
      </div>
    </div>
  );
}
