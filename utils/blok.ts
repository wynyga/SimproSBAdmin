export const getBlok = async (setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/blok`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data blok.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data blok.");
    }
  };
  
  // Mendapatkan Blok berdasarkan ID
  export const getBlokById = async (id: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/blok/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal mengambil data blok dengan ID: ${id}`);
      }
  
      return await response.json();
    } catch (err) {
      console.warn(err);
    }
  };
  
  // Menambahkan Blok baru
  export const addBlok = async (data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menambah blok.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/blok/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Gagal menambah blok.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menambah blok.");
    }
  };
  
  // Memperbarui Blok
  export const updateBlok = async (id: number, data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk memperbarui blok.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/blok/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Gagal memperbarui blok dengan ID: ${id}`);
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui blok.");
    }
  };
  
  // Menghapus Blok
  export const deleteBlok = async (id: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menghapus blok.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/blok/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal menghapus blok dengan ID: ${id}`);
      }
  
      return { message: "Blok berhasil dihapus." };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus blok.");
    }
  };