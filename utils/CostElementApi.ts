// Mendapatkan daftar semua cost element berdasarkan perumahan pengguna
export const getCostElements = async (setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cost_element`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data Cost Element.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data Cost Element.");
    }
  };
  
  // Mendapatkan cost element berdasarkan ID
  export const getCostElementById = async (id: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses data.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cost_element/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal mengambil data Cost Element dengan ID: ${id}`);
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data Cost Element.");
    }
  };
  
  // Menambahkan cost element baru
  export const addCostElement = async (data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menambah Cost Element.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cost_element/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Gagal menambah Cost Element.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menambah Cost Element.");
    }
  };
  
  // Memperbarui cost element
  export const updateCostElement = async (id: number, data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk memperbarui Cost Element.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cost_element/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Gagal memperbarui Cost Element dengan ID: ${id}`);
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui Cost Element.");
    }
  };
  
  // Menghapus cost element
  export const deleteCostElement = async (id: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menghapus Cost Element.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cost_element/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal menghapus Cost Element dengan ID: ${id}`);
      }
  
      return { message: "Cost Element berhasil dihapus." };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus Cost Element.");
    }
  };
  