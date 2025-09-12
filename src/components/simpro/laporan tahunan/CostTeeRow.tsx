import React from "react";

interface CostTeeRowProps {
  tee: any;
}

export default function CostTeeRow({ tee }: CostTeeRowProps) {
  return (
    <tr className="text-sm text-gray-600 dark:text-gray-300">
      <td className="px-4 py-2 pl-12">{tee.cost_tee_code}</td>
      <td className="px-4 py-2">{tee.description}</td>
      <td className="px-4 py-2 text-right">
        {parseFloat(tee.jumlah).toLocaleString()}
      </td>
    </tr>
  );
}
