"use client";

import React, { useEffect, useState } from "react";
import { getGudangHistory, verifyGudangOut, rejectGudangOut } from "../../../utils/stock";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";

interface GudangOutData {
  id: number;
  nama_barang: string;
  peruntukan: string;
  tanggal: string;
  jumlah: number;
  keterangan?: string;
  status: string;
}

export default function ApprovalGudangOut() {
  const [pendingApprovals, setPendingApprovals] = useState<GudangOutData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    setLoading(true);
    setError(null);

    await getGudangHistory((result: { gudang_out: GudangOutData[] }) => {
      if (result && Array.isArray(result.gudang_out)) {
        const filtered = result.gudang_out.filter((i) => i.status === "pending");
        setPendingApprovals(filtered);
      } else {
        setPendingApprovals([]);
      }
    }, setError);

    setLoading(false);
  };

  const handleVerify = async (id: number) => {
    setLoading(true);
    await verifyGudangOut(id, setError);
    await fetchPendingApprovals();
  };

  const handleReject = async (id: number) => {
    setLoading(true);
    await rejectGudangOut(id, setError);
    await fetchPendingApprovals();
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
        Approval Gudang Out
      </h2>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>}

      {pendingApprovals.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {pendingApprovals.map((item) => (
            <ComponentCard key={item.id} title={item.nama_barang}>
              <div className="space-y-2 text-sm text-gray-700 dark:text-white/90">
                <div><span className="font-medium">Peruntukan:</span> {item.peruntukan}</div>
                <div><span className="font-medium">Tanggal Keluar:</span> {item.tanggal}</div>
                <div><span className="font-medium">Jumlah:</span> {item.jumlah}</div>
                <div><span className="font-medium">Keterangan:</span> {item.keterangan || "-"}</div>
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
        <p className="text-sm text-gray-500 mt-4">
          Tidak ada transaksi Gudang Out yang menunggu persetujuan.
        </p>
      )}
    </div>
  );
}
