"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GudangInForm from "@/components/simpro/gudang/GudangInForm";

export default function GudangMasukPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Gudang Masuk" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <GudangInForm />
      </div>
    </div>
  );
}
