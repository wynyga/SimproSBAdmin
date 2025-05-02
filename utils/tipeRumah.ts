export const getTipeRumah = async (setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/tipe_rumah`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data tipe rumah.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data tipe rumah.");
    }
  };
  
  // Mendapatkan tipe rumah berdasarkan ID
  export const getTipeRumahById = async (id: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/tipe_rumah/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal mengambil data tipe rumah dengan ID: ${id}`);
      }
  
      return await response.json();
    } catch (err) {
      console.warn(err)
    }
  };
  
  // Menambahkan tipe rumah baru
  export const addTipeRumah = async (data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menambah tipe rumah.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/tipe_rumah/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Gagal menambah tipe rumah.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menambah tipe rumah.");
    }
  };
  
  // Memperbarui tipe rumah
  export const updateTipeRumah = async (id: number, data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk memperbarui tipe rumah.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/tipe_rumah/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Gagal memperbarui tipe rumah dengan ID: ${id}`);
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui tipe rumah.");
    }
  };
  
  // Menghapus tipe rumah
  export const deleteTipeRumah = async (id: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menghapus tipe rumah.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/tipe_rumah/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal menghapus tipe rumah dengan ID: ${id}`);
      }
  
      return { message: "Tipe rumah berhasil dihapus." };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus tipe rumah.");
    }
  };

  export const getPaginatedTipeRumah = async (
    page: number,
    search: string,
    setError: (msg: string | null) => void
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login.");
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/tipe_rumah?page=${page}&per_page=10&search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) throw new Error("Gagal mengambil data tipe rumah.");
      return await response.json();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data.");
      return null;
    }
  };

  export const getAllTipeRumah = async (setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login.");
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/penjualan/tipe_rumah/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Gagal mengambil data tipe rumah.");
  
      return await response.json(); // hasil array
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil tipe rumah.");
      return [];
    }
  };
  
  