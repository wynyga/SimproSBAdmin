export const getTransaksi = async (setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk mengakses data.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/transaksi`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data transaksi.");
    }

    return await response.json();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data transaksi.");
  }
};
export const addTransaksi = async (data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menambah transaksi.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/transaksi/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Gagal menambah transaksi.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menambah transaksi.");
    }
  };
  
  // Memperbarui Transaksi
  export const updateTransaksi = async (id: number, data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk memperbarui transaksi.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/transaksi/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Gagal memperbarui transaksi dengan ID: ${id}`);
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui transaksi.");
    }
  };
  
  // Menghapus Transaksi
  export const deleteTransaksi = async (id: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menghapus transaksi.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/transaksi/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal menghapus transaksi dengan ID: ${id}`);
      }
  
      return { message: "Transaksi berhasil dihapus." };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus transaksi.");
    }
  };

  export const getPaginatedTransaksi = async (
    page: number,
    search: string,
    setError: Function
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login.");
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/transaksi?page=${page}&per_page=10&search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) throw new Error("Gagal mengambil data transaksi.");
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data transaksi.");
      return null;
    }
  };

  export const getTransaksiPenjualanListAll = async (setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/transaksi/list/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data transaksi penjualan.");
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data transaksi penjualan.");
    }
  };

  