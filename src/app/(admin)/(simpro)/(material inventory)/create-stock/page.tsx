"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateStockForm from "@/components/simpro/stock/CreateStockForm";

export default function CreateStockPage() {
  return (
    <div className="min-h-screen">
      <PageBreadcrumb pageTitle="Tambah Stok Barang" />
      <div className="px-4 xl:px-10 py-6">
        <CreateStockForm />
      </div>
    </div>
  );
}
