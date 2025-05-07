import { StockData } from "./StockData";
export const getStock = async () =>
{
    try{
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk memilih lokasi.");
    }

    const response = await fetch (`${process.env.NEXT_PUBLIC_BASE_URL}/api/stock`,{
        method: "GET",
        headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });

    if(!response.ok)
    {
        throw new Error(`Gagal memuat lokasi: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
    }
    catch(e)
    {
    console.warn(e)
    }
}

export const gudangIn = async (
    kode_barang: string,
    pengirim: string,
    no_nota: string,
    tanggal_barang_masuk: string,
    jumlah: number,
    keterangan: string,
    sistem_pembayaran: string,
    setError: Function
) => {
    try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk melakukan input gudang.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gudang/in`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
        kode_barang,
        pengirim,
        no_nota,
        tanggal_barang_masuk,
        jumlah,
        sistem_pembayaran,
        keterangan,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data barang masuk.");
    }

    return result;
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
};

export const gudangOut = async (
    kode_barang: string,
    tanggal: string,
    peruntukan: string,
    jumlah: number,
    keterangan: string,
    setError: Function
)=>{
    try{
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk melakukan input gudang.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gudang/out`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
        kode_barang,
        tanggal,
        peruntukan,
        jumlah,
        keterangan,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data barang keluar.");
    }

    return result;

    }
    catch(err){
    setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
}

export const verifyGudangIn = async (id: number, setError: Function) => {
    try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk memverifikasi transaksi.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gudang/in/verify/${id}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal memverifikasi transaksi Gudang In.");
    }

    return result;
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memverifikasi transaksi.");
    }
};

export const rejectGudangIn = async (id: number, setError: Function) => {
    try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk menolak transaksi.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gudang/in/reject/${id}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal menolak transaksi Gudang In.");
    }

    return result;
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menolak transaksi.");
    }
};

export const verifyGudangOut = async (id: number, setError: Function) => {
    try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk memverifikasi transaksi.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gudang/out/verify/${id}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal memverifikasi transaksi Gudang Out.");
    }

    return result;
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memverifikasi transaksi.");
    }
};

export const rejectGudangOut = async (id: number, setError: Function) => {
    try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk menolak transaksi.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gudang/out/reject/${id}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal menolak transaksi Gudang Out.");
    }

    return result;
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menolak transaksi.");
    }
};

export const getGudangHistory = async (setHistory: Function, setError: Function) => {
    try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk melihat riwayat gudang.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gudang/all`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal memuat riwayat transaksi gudang.");
    }

    setHistory(result);
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data riwayat gudang.");
    }
};


export const addStock = async (data: any, setError: Function) => {
    try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk menambahkan stok.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stock`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan stok.");
    }

    return result;
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menambahkan stok.");
    }
};


export const updateStock = async (
    kode_barang: string,
    data: { nama_barang: string; uty: string; satuan: string; harga_satuan: number; stock_bahan: number },
    setError: Function
) => {
    try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk memperbarui stok.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stock/${kode_barang}`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Gagal memperbarui stok.");
    }

    return result;
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui stok.");
    }
};

export const deleteStock = async (id: number, jenis_peralatan: string, setError: Function) => {
    try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk menghapus stok.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stock/${id}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ jenis_peralatan }), // Diperlukan oleh backend
    });

    if (!response.ok) {
        throw new Error("Gagal menghapus stok.");
    }

    return { message: "Stok berhasil dihapus." };
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus stok.");
    }
};

export const searchStock = async (
    searchParams: { nama_barang?: string; kode_barang?: string },
    setResults: (data: Record<string, StockData[]>) => void,
    setError: (errMsg: string) => void
) => {
    try {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Anda harus login untuk mencari stok.");
    }

    const filteredParams = Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v));
    const queryParams = new URLSearchParams(filteredParams).toString();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stock/search?${queryParams}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Gagal mencari stok: ${response.status}`);
    }

    const result: { data: Record<string, StockData[]> } = await response.json();

    setResults(result.data || {});
    } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mencari stok.");
    }
};

export const fetchGudangInById = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gudang/in/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gagal mengambil data Gudang In.");
      return await res.json();
    } catch (err) {
      console.error("fetchGudangInById error:", err);
      return null;
    }
  };
  