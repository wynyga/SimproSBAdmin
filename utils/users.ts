  export const getUsers = async (setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login untuk mengakses data.");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengambil data user.");
      }

      const result = await response.json();
      return Array.isArray(result) ? result : result.users || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data user.");
      return [];
    }
  };

  
  // Menambahkan User baru 
  export const addUser = async (data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menambah unit.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Gagal menambah user.");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menambah user.");
    }
  };
  
  // Memperbarui User
  export const updateUser = async (id: number, data: any, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk memperbarui user.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Gagal memperbarui user dengan ID: ${id}`);
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui user.");
    }
  };
  
  // Menghapus User
  export const deleteUser = async (id: number, setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk menghapus user.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Gagal menghapus user dengan ID: ${id}`);
      }
  
      return { message: "User berhasil dihapus." };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus user.");
    }
  };

  export const getPaginatedUsers = async (
    page: number,
    search: string,
    setError: (msg: string | null) => void
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login.");
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users?page=${page}&per_page=10&search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) throw new Error("Gagal mengambil data user.");
      return await response.json();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data user.");
      return null;
    }
  };
  
  export const getAllUsers = async (setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda harus login.");
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Gagal mengambil daftar semua user.");
  
      return await response.json(); // ini sudah array
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil semua user.");
      return [];
    }
  };
  