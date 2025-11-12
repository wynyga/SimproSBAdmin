import React from "react";
import CostElementRow from "./CostElementRow";

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

interface CostCentreRowProps {
  centre: CostCentreData;
}

export default function CostCentreRow({ centre }: CostCentreRowProps) {
  return (
    <>
      {/* ✅ PERBAIKAN: 
        Kita ubah className menjadi dinamis.
        Jika centre.total === 0, tambahkan 'print:hidden'.
      */}
      <tr className={`
        bg-gray-50 dark:bg-gray-900/40 font-medium dark:text-white
        ${centre.total === 0 ? 'print:hidden' : ''}
      `}>
        <td className="px-4 py-2 print:hidden">{centre.cost_centre_code}</td>
        <td className="px-4 py-2">{centre.description}</td>
        <td className="px-4 py-2 text-right">
          {centre.total.toLocaleString()}
        </td>
      </tr>
      {centre.elements.map((element) => (
        <CostElementRow key={element.cost_element_code} element={element} />
      ))}
    </>
  );
}