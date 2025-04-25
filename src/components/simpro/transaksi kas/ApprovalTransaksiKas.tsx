"use client";

import React, { useEffect, useState } from "react";
import { getTransaksiKas,verifyTransaksiKas,rejectTransaksiKas } from "../../../../utils/transaksi-kas";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { createKwitansi } from "../../../../utils/kwitansi";

interface TransaksiKasData {
  id: number;
  tanggal: string;
  keterangan_transaksi: string;
  kode: string; // 101 = Masuk, 102 = Keluar
  jumlah: number | string;
  metode_pembayaran: string;
  dibuat_oleh: string;
  status: string;
}

export default function ApprovalTransaksiKas() {
  const [pendingApprovals, setPendingApprovals] = useState<TransaksiKasData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    setLoading(true);
    setError(null);

    await getTransaksiKas((result: { transaksiKas: TransaksiKasData[] }) => {
      if (result && Array.isArray(result.transaksiKas)) {
        const filteredData = result.transaksiKas.filter((item) => item.status === "pending");
        setPendingApprovals(filteredData);
      } else {
        setPendingApprovals([]);
      }
    }, setError);

    setLoading(false);
  };
  const handleVerify = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await verifyTransaksiKas(id, setError); // 1. approve transaksi kas
      await createKwitansi(id, setError);     // 2. langsung create kwitansi
      await fetchPendingApprovals();          // 3. refresh list
    } catch (e) {
      console.error("Gagal verifikasi:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    setLoading(true);
    setError(null);
    await rejectTransaksiKas(id, setError);
    await fetchPendingApprovals();
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Approval Transaksi Kas
      </h2>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>}

      {pendingApprovals.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {pendingApprovals.map((item) => (
            <ComponentCard key={item.id} title={item.keterangan_transaksi}>
              <div className="space-y-2 text-sm text-gray-700 dark:text-white/90">
                <div>
                  <span className="font-medium">Tanggal:</span> {item.tanggal}
                </div>
                <div>
                  <span className="font-medium">Jenis Transaksi:</span>{" "}
                  {item.kode === "101" ? "Kas Masuk" : "Kas Keluar"}
                </div>
                <div>
                  <span className="font-medium">Jumlah:</span> Rp {(+item.jumlah).toLocaleString("id-ID")}
                </div>
                <div>
                  <span className="font-medium">Metode Pembayaran:</span> {item.metode_pembayaran}
                </div>
                <div>
                  <span className="font-medium">Dibuat Oleh:</span> {item.dibuat_oleh}
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-blue-700"
                  onClick={() => handleVerify(item.id)}
                >
                  Verifikasi
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => handleReject(item.id)}
                >
                  Tolak
                </Button>
              </div>
            </ComponentCard>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4">Tidak ada transaksi kas yang menunggu persetujuan.</p>
      )}
    </div>
  );
}