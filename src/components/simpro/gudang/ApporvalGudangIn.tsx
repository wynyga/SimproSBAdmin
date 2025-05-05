"use client";

import React, { useEffect, useState } from "react";
import {
  getGudangHistory,
  verifyGudangIn,
  rejectGudangIn,
  fetchGudangInById
} from "../../../../utils/stock";
import { createSttb } from "../../../../utils/kwitansi";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";

interface GudangInData {
  id: number;
  nama_barang: string;
  pengirim: string;
  no_nota: string;
  tanggal_barang_masuk: string;
  jumlah: number;
  keterangan?: string;
  status: string;
  jenis_penerimaan: "Langsung" | "Tidak Langsung" | "Ambil Sendiri";
}

export default function ApprovalGudangIn() {
  const [pendingApprovals, setPendingApprovals] = useState<GudangInData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    setLoading(true);
    setError(null);

    await getGudangHistory((result: { gudang_in: GudangInData[] }) => {
      if (result && Array.isArray(result.gudang_in)) {
        const filtered = result.gudang_in.filter((i) => i.status === "pending");
        setPendingApprovals(filtered);
      } else {
        setPendingApprovals([]);
      }
    }, setError);

    setLoading(false);
  };

  const handleVerify = async (item: GudangInData) => {
    setLoading(true);
    setError(null);
    try {
      await verifyGudangIn(item.id, setError); // 1. verifikasi GudangIn
  
      // 🔄 Fetch ulang data GudangIn by ID untuk memastikan status sudah updated
      const refreshed = await fetchGudangInById(item.id); // implementasi fetch by ID
      if (refreshed?.status === "verified") {
        await createSttb(item.id, refreshed.jenis_penerimaan, setError); // 2. create STTB
      } else {
        setError("Status belum terverifikasi, mohon coba beberapa detik lagi.");
      }
  
      await fetchPendingApprovals(); // 3. refresh list
    } catch (err) {
      console.error("Verifikasi gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    setLoading(true);
    setError(null);
    await rejectGudangIn(id, setError);
    await fetchPendingApprovals();
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Approval Gudang In
      </h2>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>}

      {pendingApprovals.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {pendingApprovals.map((item) => (
            <ComponentCard key={item.id} title={item.nama_barang}>
              <div className="space-y-2 text-sm text-gray-700 dark:text-white/90">
                <div><span className="font-medium">Pengirim:</span> {item.pengirim}</div>
                <div><span className="font-medium">No Nota:</span> {item.no_nota}</div>
                <div><span className="font-medium">Tanggal Masuk:</span> {item.tanggal_barang_masuk}</div>
                <div><span className="font-medium">Jumlah:</span> {item.jumlah}</div>
                <div><span className="font-medium">Jenis Penerimaan:</span> {item.jenis_penerimaan}</div>
                <div><span className="font-medium">Keterangan:</span> {item.keterangan || "-"}</div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-blue-700"
                  onClick={() => handleVerify(item)}
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
        <p className="text-sm text-gray-500 mt-4">
          Tidak ada transaksi Gudang In yang menunggu persetujuan.
        </p>
      )}
    </div>
  );
}
