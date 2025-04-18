"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTransaksiKas,storeTransaksiKas } from "../../../../../utils/transaksi-kas";
import TransaksiKasForm from "@/components/simpro/transaksi kas/TransaksiKasForm";
import ComponentCard from "@/components/common/ComponentCard";

interface KasData {
  saldoKas: number;
  totalCashIn: number;
  totalCashOut: number;
}

export default function TransaksiKasPage() {
  const [kasData, setKasData] = useState<KasData | null>(null);
  const [newTransaksi, setNewTransaksi] = useState({
    tanggal: "",
    keterangan_transaksi: "",
    kode: "101",
    jumlah: "",
    metode_pembayaran: "Tunai",
    keterangan_objek_transaksi: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    fetchKas();
  }, []);

  const fetchKas = async () => {
    setError(null);
    setLoading(true);
    await getTransaksiKas(setKasData, setError);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewTransaksi({ ...newTransaksi, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    await storeTransaksiKas(newTransaksi, setError);
    setLoading(false);

    if (!error) {
      setMessage("Transaksi berhasil ditambahkan.");
      setNewTransaksi({
        tanggal: "",
        keterangan_transaksi: "",
        kode: "101",
        jumlah: "",
        metode_pembayaran: "Tunai",
        keterangan_objek_transaksi: "",
      });
      fetchKas();
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Transaksi Kas" />

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Ringkasan Kas */}
        <ComponentCard title="Ringkasan Transaksi Kas">
          {error && <p className="text-sm text-red-500">{error}</p>}

          {loading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
          ) : (
            kasData && (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-white">Saldo Kas</span>
                  <span className="text-gray-900 dark:text-white">
                    Rp {kasData.saldoKas.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-white">Total Pemasukan</span>
                  <span className="text-gray-900 dark:text-white">
                    Rp {kasData.totalCashIn.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-white">Total Pengeluaran</span>
                  <span className="text-gray-900 dark:text-white">
                    Rp {kasData.totalCashOut.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )
          )}
        </ComponentCard>

        {/* Form Tambah Transaksi */}
        <div className="space-y-6">
          <TransaksiKasForm
            formData={newTransaksi}
            handleChange={handleChange}
            handleSelectChange={(val, name) =>
              setNewTransaksi((prev) => ({ ...prev, [name]: val }))
            }
            handleDateChange={(date) =>
              setNewTransaksi((prev) => ({
                ...prev,
                tanggal: date.toISOString().split("T")[0],
              }))
            }
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        {/* <div className="rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Tambah Transaksi</h4>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-gray-700 dark:text-white">Tanggal: </label>
              <span className="text-gray-900 dark:text-white">
                <input
                    type="date"
                    name="tanggal"
                    value={newTransaksi.tanggal}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
              </span>
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-white">Keterangan: </label>
              <span className="text-gray-900 dark:text-white">
                <input
                    type="text"
                    name="keterangan_transaksi"
                    value={newTransaksi.keterangan_transaksi}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
              </span>
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-white">Jenis Transaksi: </label>
              <span className="text-gray-900 dark:text-white">
                <select name="kode" value={newTransaksi.kode} onChange={handleChange} className="form-select bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800 dark:focus:text-white">
                    <option value="101">Kas Masuk</option>
                    <option value="102">Kas Keluar</option>
                </select>
              </span>
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-white">Jumlah: </label>
              <span className="text-gray-900 dark:text-white">
                <input
                    type="number"
                    name="jumlah"
                    value={newTransaksi.jumlah}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
              </span>              
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-white">Metode Pembayaran: </label>
              <span className="text-gray-900 dark:text-white">
                <select
                    name="metode_pembayaran"
                    value={newTransaksi.metode_pembayaran}
                    onChange={handleChange}
                    className="form-select bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800 dark:focus:text-white"
                >
                    <option value="Tunai">Tunai</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                </select>
              </span>              
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-gray-700 dark:text-white">Keterangan Objek (Opsional): </label>
              <span className="text-gray-900 dark:text-white">
                <input
                    type="text"
                    name="keterangan_objek_transaksi"
                    value={newTransaksi.keterangan_objek_transaksi}
                    onChange={handleChange}
                    className="form-input"
                />
              </span>              
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Transaksi"}
              </button>
            </div>
          </form>
        </div> */}



      </div>
    </div>
  );
}
