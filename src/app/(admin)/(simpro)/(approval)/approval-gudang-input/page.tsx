"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import ApprovalGudangIn from "@/components/simpro/gudang/ApporvalGudangIn";
import { getProfile } from "../../../../../../utils/auth";

export default function ApprovalGudangInPage() {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const profile = await getProfile((err: string) => setErrorMessage(err));
        if (profile && (profile.role === "Direktur" || profile.role === "Manager")) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch {
        setErrorMessage("Gagal memuat profil pengguna.");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  return (
    <div className="min-h-screen">
      <PageBreadcrumb pageTitle="Approval Gudang In" />
      <div className="px-4 xl:px-10">
        {loading ? (
          <p className="text-sm text-gray-500">Memuat akses pengguna...</p>
        ) : !isAllowed ? (
          <ComponentCard title="Akses Ditolak">
            <p className="text-sm text-red-500">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Kembali ke Beranda Stock
            </button>
          </ComponentCard>
        ) : (
          <ApprovalGudangIn />
        )}
      </div>
    </div>
  );
}
