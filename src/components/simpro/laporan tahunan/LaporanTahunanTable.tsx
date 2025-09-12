import React from "react";
import CostCentreRow from "./CostCentreRow";

interface LaporanTahunanTableProps {
  data: any;
}

export default function LaporanTahunanTable({ data }: LaporanTahunanTableProps) {
  return (
    <div className="overflow-x-auto">
      {["KASIN", "KASOUT"].map((jenis) => (
        <div key={jenis} className="mb-10">
          <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
            {jenis === "KASIN" ? "Arus Kas Masuk" : "Arus Kas Keluar"}
          </h2>
          <table className="min-w-full border border-gray-200 text-left text-sm dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800/40 dark:text-white">
              <tr>
                <th className="px-4 py-2">Kode</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {data[jenis]?.map((centre: any) => (
                <CostCentreRow key={centre.cost_centre_code} centre={centre} />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
