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
  // Konversi jumlah ke angka untuk pengecekan
  const jumlahAngka = parseFloat(String(tee.jumlah));

  return (
    /* ✅ PERBAIKAN #2: 
       Tambahkan cek 'jumlahAngka === 0' untuk menyembunyikan
       baris 'Tee' individual (misal: "KIO10101")
       saat mencetak jika jumlahnya 0.
    */
    <tr className={`
      text-sm text-gray-600 dark:text-gray-300
      ${jumlahAngka === 0 ? 'print:hidden' : ''}
    `}>
      {/* ✅ PERBAIKAN #1: 
        Tambahkan 'print:hidden' untuk menyembunyikan kolom kode.
      */}
      <td className="px-4 py-2 pl-12 print:hidden">{tee.cost_tee_code}</td>
      
      <td className="px-4 py-2">{tee.description}</td>
      <td className="px-4 py-2 text-right">
        {jumlahAngka.toLocaleString()}
      </td>
    </tr>
  );
}