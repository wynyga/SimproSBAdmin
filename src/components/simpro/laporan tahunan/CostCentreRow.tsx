import React from "react";
import CostElementRow from "./CostElementRow";

// Tipe ini harus cocok dengan yang diharapkan oleh CostElementRow
// Sebaiknya tipe ini di-export dari file komponennya dan di-import di sini
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

// Mendefinisikan struktur untuk prop 'centre'
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
      <tr className="bg-gray-50 dark:bg-gray-900/40 font-medium dark:text-white">
        <td className="px-4 py-2">{centre.cost_centre_code}</td>
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