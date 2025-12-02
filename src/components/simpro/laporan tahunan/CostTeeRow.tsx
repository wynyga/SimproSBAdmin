import React from "react";

interface TeeData {
  cost_tee_code: string;
  description: string;
  jumlah: number | string;
}

interface CostTeeRowProps {
  tee: TeeData;
}

export default function CostTeeRow({ tee }: CostTeeRowProps) {
  const jumlahAngka = parseFloat(String(tee.jumlah));

  return (
    <tr
      className={`
        text-sm text-gray-500 dark:text-gray-400
        hover:bg-blue-50 dark:hover:bg-blue-900/10
        ${jumlahAngka === 0 ? "print:hidden" : ""}
      `}
    >
      <td className="px-4 py-1 pl-12 print:hidden text-xs italic">
        {tee.cost_tee_code}
      </td>
      
      {/* Indentasi lebih dalam (pl-16) untuk level 3 */}
      <td className="px-4 py-1 pl-16">
        {tee.description}
      </td>
      
      <td className="px-4 py-1 text-right">
        {jumlahAngka.toLocaleString()}
      </td>
    </tr>
  );
}