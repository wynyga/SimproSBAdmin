"use client";

import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { fetchLocations,selectLocation } from "../../../utils/lokasi";
import { useRouter } from "next/navigation";

interface Location {
  id: number;
  nama_perumahan: string;
}

export default function PilihLokasiForm() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchLocations(setLocations, setError, setLoading);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedId) {
      setError("Silakan pilih salah satu lokasi.");
      return;
    }
    setSubmitting(true);
    await selectLocation(selectedId, router, setError);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Pilih Lokasi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pilih perumahan untuk melanjutkan ke dashboard.
            </p>
          </div>

          {error && <p className="mb-3 text-sm text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>Daftar Lokasi <span className="text-error-500">*</span></Label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-brand-200 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={selectedId ?? ""}
                  onChange={(e) => setSelectedId(Number(e.target.value))}
                  disabled={loading}
                  required
                >
                  <option value="" disabled>
                    {loading ? "Memuat lokasi..." : "Pilih lokasi perumahan"}
                  </option>
                  {locations.map((lokasi) => (
                    <option key={lokasi.id} value={lokasi.id}>
                      {lokasi.nama_perumahan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Button className="w-full" size="sm" type="submit" disabled={submitting || loading}>
                  {submitting ? "Menyimpan..." : "Lanjutkan"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
