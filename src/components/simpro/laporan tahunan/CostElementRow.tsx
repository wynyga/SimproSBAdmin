import React from "react";
import CostTeeRow from "./CostTeeRow";

interface CostElementRowProps {
  element: any;
}

export default function CostElementRow({ element }: CostElementRowProps) {
  return (
    <>
      <tr className="bg-white dark:bg-gray-800/20 dark:text-white">
        <td className="px-4 py-2 pl-8">{element.cost_element_code}</td>
        <td className="px-4 py-2">{element.description}</td>
        <td className="px-4 py-2 text-right">{element.total.toLocaleString()}</td>
      </tr>
      {element.tees.map((tee: any) => (
        <CostTeeRow key={tee.cost_tee_code} tee={tee} />
      ))}
    </>
  );
}
