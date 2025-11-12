import React from "react";
import CostCentreRow from "./CostCentreRow";

// ... (Interface tetap sama) ...
interface TeeData {
  cost_tee_code: string;
  description: string;
  jumlah: number | string;
}

interface CostElementData {
  cost_element_code: string;
  description: string;
  total: number;
  tees: TeeData[];
}

interface CostCentreData {
  cost_centre_code: string;
  description: string;
  total: number;
  elements: CostElementData[];
}

interface LaporanTahunanData {
  KASIN: CostCentreData[];
  KASOUT: CostCentreData[];
}
// ...

interface LaporanTahunanTableProps {
  data: LaporanTahunanData;
}

export default function LaporanTahunanTable({
  data,
}: LaporanTahunanTableProps) {
  return (
    <div className="overflow-x-auto">
      {(["KASIN", "KASOUT"] as const).map((jenis) => (
        <div key={jenis} className="mb-10">
          <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
            {jenis === "KASIN" ? "Arus Kas Masuk" : "Arus Kas Keluar"}
          </h2>
          <table className="min-w-full border border-gray-200 text-left text-sm dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800/40 dark:text-white">
              <tr>
                {/* PERBAIKAN: Tambahkan 'print:hidden' 
                  untuk menyembunyikan kolom ini saat dicetak 
                */}
                <th className="px-4 py-2 print:hidden">Kode</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {data[jenis]?.map((centre) => (
                <CostCentreRow
                  key={centre.cost_centre_code}
                  centre={centre}
                />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}