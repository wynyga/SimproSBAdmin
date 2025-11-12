import React from "react";
import CostTeeRow from "./CostTeeRow";

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

interface CostElementRowProps {
  element: CostElementData;
}

export default function CostElementRow({ element }: CostElementRowProps) {
  return (
    <>
      {/* PERBAIKAN #2: 
        Tambahkan cek 'element.total === 0' untuk menyembunyikan
        seluruh baris 'Cost Element' (misal: "Penerimaan dari Down Payment")
        saat mencetak jika totalnya 0.
      */}
      <tr className={`
        bg-white dark:bg-gray-800/20 dark:text-white
        ${element.total === 0 ? 'print:hidden' : ''}
      `}>
        {/* PERBAIKAN #1: 
          Tambahkan 'print:hidden' untuk menyembunyikan kolom kode.
        */}
        <td className="px-4 py-2 pl-8 print:hidden">{element.cost_element_code}</td>
        
        <td className="px-4 py-2">{element.description}</td>
        <td className="px-4 py-2 text-right">
          {element.total.toLocaleString()}
        </td>
      </tr>
      {element.tees.map((tee) => (
        <CostTeeRow key={tee.cost_tee_code} tee={tee} />
      ))}
    </>
  );
}