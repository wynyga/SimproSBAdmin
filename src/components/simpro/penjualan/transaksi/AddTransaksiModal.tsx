"use client";

import React, { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  userList: { id: number; nama_user: string }[];
  unitList: { id: number; nomor_unit: string }[];
}

export default function AddTransaksiModal({
  isOpen,
  onClose,
  onSubmit,
  userList,
  unitList,
}: Props) {
  const [formData, setFormData] = useState({
    user_id: "",
    unit_id: "",
    harga_jual_standar: 0,
    kelebihan_tanah: 0,
    penambahan_luas_bangunan: 0,
    perubahan_spek_bangunan: 0,
    total_harga_jual: 0,
    minimum_dp: 0,
    kewajiban_hutang: 0,
    kpr_disetujui: "Ya",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        user_id: "",
        unit_id: "",
        harga_jual_standar: 0,
        kelebihan_tanah: 0,
        penambahan_luas_bangunan: 0,
        perubahan_spek_bangunan: 0,
        total_harga_jual: 0,
        minimum_dp: 0,
        kewajiban_hutang: 0,
        kpr_disetujui: "Ya",
      });
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const { user_id, unit_id, total_harga_jual } = formData;
    if (!user_id || !unit_id || total_harga_jual <= 0) {
      setError("Semua field wajib diisi dengan benar.");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Tambah Transaksi</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Pembeli</label>
            <select
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
            >
              <option value="">Pilih Pembeli</option>
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nama_user}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Unit</label>
            <select
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.unit_id}
              onChange={(e) =>
                setFormData({ ...formData, unit_id: e.target.value })
              }
            >
              <option value="">Pilih Unit</option>
              {unitList.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.nomor_unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Harga Jual Standar</label>
            <input
              type="number"
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.harga_jual_standar}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  harga_jual_standar: +e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Kelebihan Tanah</label>
            <input
              type="number"
              value={formData.kelebihan_tanah}
              onChange={(e) =>
                setFormData({ ...formData, kelebihan_tanah: +e.target.value })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Penambahan Luas Bangunan</label>
            <input
              type="number"
              value={formData.penambahan_luas_bangunan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  penambahan_luas_bangunan: +e.target.value,
                })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Perubahan Spek Bangunan</label>
            <input
              type="number"
              value={formData.perubahan_spek_bangunan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  perubahan_spek_bangunan: +e.target.value,
                })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Total Harga Jual</label>
            <input
              type="number"
              value={formData.total_harga_jual}
              onChange={(e) =>
                setFormData({ ...formData, total_harga_jual: +e.target.value })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Minimum DP</label>
            <input
              type="number"
              value={formData.minimum_dp}
              onChange={(e) =>
                setFormData({ ...formData, minimum_dp: +e.target.value })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Kewajiban Hutang</label>
            <input
              type="number"
              value={formData.kewajiban_hutang}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kewajiban_hutang: +e.target.value,
                })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Status KPR</label>
            <select
              value={formData.kpr_disetujui}
              onChange={(e) =>
                setFormData({ ...formData, kpr_disetujui: e.target.value })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Simpan
          </button>
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
