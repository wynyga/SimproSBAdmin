export const getTransaksiKas = async (setKasData: Function, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk melihat transaksi kas.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaksi/kas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal memuat transaksi kas.");
      }
  
      const result = await response.json();
      setKasData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data transaksi kas.");
    }
  };
  
export const storeTransaksiKas = async (data: any, setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk mencatat transaksi kas.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaksi/kas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Gagal menyimpan transaksi kas.");
    }

    return await response.json();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan transaksi kas.");
  }
};
// Mengambil Ringkasan Kas berdasarkan Tahun
export const getRingkasanKas = async (tahun: number, setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk mengakses data.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaksi/kas/ringkasan/${tahun}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data ringkasan kas.");
    }

    return await response.json();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil ringkasan kas.");
  }
};


export const verifyTransaksiKas = async (id: number, setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Anda harus login untuk melakukan verifikasi.");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaksi/kas/${id}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal memverifikasi transaksi.");
    }

    return result;
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memverifikasi transaksi.");
  }
};

export const rejectTransaksiKas = async (id: number, setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Anda harus login untuk melakukan penolakan.");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaksi/kas/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal menolak transaksi.");
    }

    return result;
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menolak transaksi.");
  }
};

export const getHistoryTransaksiKas = async (status: string, startDate: string, endDate: string, perPage: string, page: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk melihat history transaksi.");
    }

    const queryParams = new URLSearchParams({
      status,
      start_date: startDate,
      end_date: endDate,
      per_page: perPage,
      page, // Pastikan page dikirim sebagai string
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transaksi/kas/history?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil history transaksi kas.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching history transaksi kas:", error);
    return [];
  }
};