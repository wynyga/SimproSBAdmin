  export const getLaporanBulanan = async (
    bulan: number,
    tahun: number,
    setError: Function
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login untuk mengakses data.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/${bulan}/${tahun}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil data laporan bulanan.");
      return await response.json();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil laporan bulanan."
      );
      return [];
    }
  };

  
  // Menambahkan laporan baru
  export const addLaporanBulanan = async (data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menambah laporan.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Gagal menambah laporan bulanan.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menambah laporan bulanan.");
    }
  };
  
  // Mengambil kas masuk bulan lalu
  export const getKasMasuk = async (bulan: number, tahun: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/kas_masuk/${bulan}/${tahun}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data kas masuk.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil kas masuk.");
    }
  };
  
  // Mengambil kas keluar bulan ini
  export const getKasKeluar = async (bulan: number, tahun: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/kas_keluar/${bulan}/${tahun}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data kas keluar.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil kas keluar.");
    }
  };
  
  // Mengambil sisa kas bulan ini
  export const getSisaKas = async (bulan: number, tahun: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/sisa_kas/${bulan}/${tahun}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data sisa kas.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil sisa kas.");
    }
  };
  
  // Mengambil history laporan bulanan
  export const getHistoryLaporan = async (setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengambil riwayat laporan.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil riwayat laporan.");
    }
  };
  
  // Mengambil transaksi kas berdasarkan bulan dan tahun
  export const getTransaksiKas = async (bulan: number, tahun: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/transaksi_kas/journal/${bulan}/${tahun}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data transaksi kas.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil transaksi kas.");
    }
  };
  
  // Mengambil total harga barang dalam stok
  export const getInventory = async (setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/inventory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data inventory.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil inventory.");
    }
  };

  // Memperbarui laporan bulanan berdasarkan ID
export const updateLaporanBulanan = async (id: number, data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk memperbarui laporan bulanan.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Gagal memperbarui laporan bulanan dengan ID: ${id}`);
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui laporan bulanan.");
    }
  };
  
  // Menghapus laporan bulanan berdasarkan ID
  export const deleteLaporanBulanan = async (id: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menghapus laporan bulanan.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal menghapus laporan bulanan dengan ID: ${id}`);
      }
  
      return { message: "Laporan bulanan berhasil dihapus." };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus laporan bulanan.");
    }
  };
  
  // Mengambil ringkasan jurnal transaksi kas berdasarkan bulan dan tahun
  export const getJournalSummary = async (bulan: number, tahun: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/transaksi_kas/journal/${bulan}/${tahun}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data jurnal transaksi kas.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil jurnal transaksi kas.");
    }
  };
  // Mengambil ringkasan pengeluaran bahan dari gudang berdasarkan bulan dan tahun
  export const getGudangOutSummary = async (bulan: number, tahun: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/gudang/summary/${bulan}/${tahun}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data pengeluaran bahan dari gudang.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data pengeluaran bahan dari gudang.");
    }
  };

  // Mengambil total harga persediaan bahan dari stok gudang
export const getStockInventory = async (bulan: number, tahun: number,setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk mengakses data.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/inventory/${bulan}/${tahun}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data persediaan bahan.");
    }

    return await response.json();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data persediaan bahan.");
  } 
};

export const getLaporanTahunan = async (tahun: number, setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk mengakses data.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/tahunan/${tahun}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data laporan tahunan.");
    }

    return await response.json();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil laporan tahunan.");
  }
};

// Ambil Laporan Kas
export const getLaporanKas = async (
  bulan: number,
  tahun: number,
  setError: Function
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Anda harus login untuk mengakses data.");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/lap_bulanan/getLaporanKas/${bulan}/${tahun}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Gagal mengambil data laporan kas.");

    return await response.json();
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan saat mengambil laporan kas."
    );
    return [];
  }
};

