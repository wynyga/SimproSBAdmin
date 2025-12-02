import React, {useState} from "react";
import CostElementRow from "./CostElementRow";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

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
  // State untuk mengontrol buka/tutup
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function
  const toggleOpen = () => setIsOpen(!isOpen);

  // Cek apakah baris ini harus disembunyikan saat print (jika total 0)
  const isHiddenPrint = centre.total === 0 ? "print:hidden" : "";

  return (
    <>
      <tr
        onClick={toggleOpen}
        className={`
          cursor-pointer border-b border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800
          bg-gray-50 dark:bg-gray-900/40 font-bold text-gray-800 dark:text-white
          transition-colors duration-200
          ${isHiddenPrint}
        `}
      >
        <td className="px-4 py-3 print:hidden">{centre.cost_centre_code}</td>
        
        {/* Kolom Deskripsi dengan Ikon */}
        <td className="px-4 py-3 flex items-center gap-2">
          <span className="text-gray-500 text-xs">
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          {centre.description}
        </td>

        <td className="px-4 py-3 text-right">
          {centre.total.toLocaleString()}
        </td>
      </tr>

      {/* LOGIKA DROP DOWN:
         Hanya render anak-anaknya (CostElementRow) jika isOpen === true 
         ATAU jika sedang dicetak (opsional, lihat catatan di bawah).
      */}
      {isOpen &&
        centre.elements.map((element) => (
          <CostElementRow key={element.cost_element_code} element={element} />
        ))}
    </>
  );
}