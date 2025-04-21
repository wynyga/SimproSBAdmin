// 🔍 GET semua data perumahan
export const getAllPerumahan = async (setError: Function) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perumahan`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal memuat data perumahan");
      }
  
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
};
  
  // 📄 GET detail perumahan by ID
export const getPerumahanById = async (id: number, setError: Function) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perumahan/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        });

        if (!response.ok) {
        throw new Error("Gagal memuat data perumahan");
        }

        return await response.json();
    } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
};

export const storePerumahan = async (
    data: {
        nama_perumahan: string;
        lokasi: string;
    },
    setError: Function
    ) => {
    try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perumahan/store`, {
        method: "POST",
        headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan perumahan");
    }

    return result;
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan perumahan");
    }
};
  
// ✏️ UPDATE perumahan
export const updatePerumahan = async (
    id: number,
    data: {
        nama_perumahan: string;
        lokasi: string;
    },
    setError: Function
    ) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perumahan/update/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
        throw new Error(result.message || "Gagal memperbarui perumahan");
        }

        return result;
    } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat update perumahan");
    }
};
  
// ❌ DELETE perumahan
export const deletePerumahan = async (id: number, setError: Function) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perumahan/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        });

        if (!response.ok) {
        throw new Error("Gagal menghapus data perumahan");
        }

        return await response.json();
    } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus perumahan");
    }
};
