"use client";

import React from "react";
import { TransaksiDataWithRelasi } from "../../../../../utils/interfaceTransaksi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaksi: TransaksiDataWithRelasi;
  setTransaksi: (data: TransaksiDataWithRelasi) => void;
  onSubmit: () => Promise<boolean>;
  userList: { id: number; nama_user: string }[];
  unitList: { id: number; nomor_unit: string }[];
  error?: string | null;
}

export default function EditTransaksiModal({
  isOpen,
  onClose,
  transaksi,
  setTransaksi,
  onSubmit,
  userList,
  unitList,
  error,
}: Props) {
  if (!isOpen || !transaksi) return null;

  const handleSubmit = async () => {
    const success = await onSubmit();
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Transaksi</h4>
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
              value={transaksi.user_id}
              onChange={(e) =>
                setTransaksi({ ...transaksi, user_id: e.target.value })
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
              value={transaksi.unit_id}
              onChange={(e) =>
                setTransaksi({ ...transaksi, unit_id: e.target.value })
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
              value={transaksi.harga_jual_standar}
              onChange={(e) =>
                setTransaksi({
                  ...transaksi,
                  harga_jual_standar: +e.target.value,
                })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Kelebihan Tanah</label>
            <input
              type="number"
              value={transaksi.kelebihan_tanah}
              onChange={(e) =>
                setTransaksi({
                  ...transaksi,
                  kelebihan_tanah: +e.target.value,
                })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Penambahan Luas Bangunan</label>
            <input
              type="number"
              value={transaksi.penambahan_luas_bangunan}
              onChange={(e) =>
                setTransaksi({
                  ...transaksi,
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
              value={transaksi.perubahan_spek_bangunan}
              onChange={(e) =>
                setTransaksi({
                  ...transaksi,
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
              value={transaksi.total_harga_jual}
              onChange={(e) =>
                setTransaksi({
                  ...transaksi,
                  total_harga_jual: +e.target.value,
                })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Minimum DP</label>
            <input
              type="number"
              value={transaksi.minimum_dp}
              onChange={(e) =>
                setTransaksi({
                  ...transaksi,
                  minimum_dp: +e.target.value,
                })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Kewajiban Hutang</label>
            <input
              type="number"
              value={transaksi.kewajiban_hutang}
              onChange={(e) =>
                setTransaksi({
                  ...transaksi,
                  kewajiban_hutang: +e.target.value,
                })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Status KPR</label>
            <select
              value={transaksi.kpr_disetujui}
              onChange={(e) =>
                setTransaksi({ ...transaksi, kpr_disetujui: e.target.value })
              }
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Simpan Perubahan
          </button>
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-white dark:hover:bg-gray-700 transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
