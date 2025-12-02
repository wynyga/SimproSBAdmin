import React, { useState } from "react";
import CostTeeRow from "./CostTeeRow";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

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
  const [isOpen, setIsOpen] = useState(false);
  
  // Fungsi stopPropagation agar saat klik ini, Level 1 tidak ikut tertutup
  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsOpen(!isOpen);
  };

  const isHiddenPrint = element.total === 0 ? "print:hidden" : "";

  return (
    <>
      <tr
        onClick={toggleOpen}
        className={`
          cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50
          bg-white dark:bg-gray-800/20 text-gray-700 dark:text-gray-200
          border-b border-gray-50 font-medium
          ${isHiddenPrint}
        `}
      >
        <td className="px-4 py-2 pl-8 print:hidden text-xs text-gray-400">
          {element.cost_element_code}
        </td>

        <td className="px-4 py-2 pl-8 flex items-center gap-2">
           {/* Indentasi visual (pl-8) */}
           <span className="text-gray-400 text-[10px]">
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          {element.description}
        </td>

        <td className="px-4 py-2 text-right">
          {element.total.toLocaleString()}
        </td>
      </tr>

      {/* Render Level 3 (Tee) jika isOpen */}
      {isOpen &&
        element.tees.map((tee) => (
          <CostTeeRow key={tee.cost_tee_code} tee={tee} />
        ))}
    </>
  );
}