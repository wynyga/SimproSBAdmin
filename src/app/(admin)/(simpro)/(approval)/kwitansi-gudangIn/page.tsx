"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { getGudangHistory } from "../../../../../../utils/stock";
import { cetakSttb } from "../../../../../../utils/kwitansi";
import { getProfile } from "../../../../../../utils/auth";
import GudangInTableSTTB from "@/components/simpro/gudang/GudangInTableSTTB";

interface GudangInData {
  id: number;
  nama_barang: string;
  pengirim: string;
  no_nota: string;
  tanggal_barang_masuk: string;
  jumlah: number;
  keterangan?: string;
  status: string;
  sttb?: {
    id: number;
    no_doc: string;
    tanggal: string;
  } | null;
}

export default function GudangInSTTBPage() {
  const router = useRouter();
  const [gudangInList, setGudangInList] = useState<GudangInData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const profile = await getProfile((err: string) => setError(err));
        if (profile && (profile.role === "Direktur" || profile.role === "Manager")) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch {
        setError("Gagal memuat profil pengguna.");
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, []);

  useEffect(() => {
    fetchGudangIn();
  }, []);

  const fetchGudangIn = async () => {
    setLoading(true);
    try {
      await getGudangHistory((res: { gudang_in: GudangInData[] }) => {
        setGudangInList(res.gudang_in || []);
      }, setError);
    } catch {
      setError("Gagal memuat data Gudang In.");
    }
    setLoading(false);
  };

  const handleCetakSttb = async (id: number) => {
    try {
      await cetakSttb(id);
    } catch (err) {
      console.error("Gagal cetak STTB:", err);
    }
  };

  return (
    <div className="min-h-screen px-4 xl:px-10">
      <PageBreadcrumb pageTitle="Riwayat Gudang In (STTB)" />
      {loading ? (
        <p className="text-sm text-gray-500">Memuat data gudang...</p>
      ) : !isAllowed ? (
        <ComponentCard title="Akses Ditolak">
          <p className="text-sm text-red-500">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Kembali ke Dashboard
          </button>
        </ComponentCard>
      ) : error ? (
        <ComponentCard title="Error">
          <p className="text-sm text-red-500">{error}</p>
        </ComponentCard>
      ) : (
        <GudangInTableSTTB
          gudangInList={gudangInList}
          onCetakSttb={handleCetakSttb}
        />
      )}
    </div>
  );
}
