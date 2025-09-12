import React from "react";
import CostElementRow from "./CostElementRow";

interface CostCentreRowProps {
  centre: any;
}

export default function CostCentreRow({ centre }: CostCentreRowProps) {
  return (
    <>
      <tr className="bg-gray-50 dark:bg-gray-900/40 font-medium dark:text-white">
        <td className="px-4 py-2">{centre.cost_centre_code}</td>
        <td className="px-4 py-2">{centre.description}</td>
        <td className="px-4 py-2 text-right">{centre.total.toLocaleString()}</td>
      </tr>
      {centre.elements.map((element: any) => (
        <CostElementRow key={element.cost_element_code} element={element} />
      ))}
    </>
  );
}
