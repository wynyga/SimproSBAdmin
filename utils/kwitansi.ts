export const createKwitansi = async (transaksi_kas_id: number, setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kwitansi/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ transaksi_kas_id }),
    });

    if (!response.ok) throw new Error("Gagal membuat kwitansi.");
    return await response.json();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat membuat kwitansi.";
    setError(msg);
    console.error("createKwitansi error:", msg);
  }
};

export const cetakKwitansi = async (kwitansiId: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kwitansi/${kwitansiId}/cetak`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Gagal cetak kwitansi.");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    alert("Gagal membuka kwitansi.");
  }
};

export const getKwitansiHistory = async (setData: Function, setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kwitansi/history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Gagal mengambil histori kwitansi.");

    const result = await response.json();
    setData(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data kwitansi.";
    setError(msg);
    console.error("getKwitansiHistory error:", msg);
  }
};

export const createSttb = async (
  gudang_in_id: number,
  sistem_pembayaran: string,
  setError?: (msg: string) => void
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kwitansi/sttb/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ gudang_in_id, sistem_pembayaran }),
    });

    if (!response.ok) throw new Error("Gagal membuat STTB.");
    return await response.json();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat membuat STTB.";
    if (setError) setError(msg);
    console.error("createSttb error:", msg);
  }
};


export const cetakSttb = async (sttbId: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kwitansi/sttb/${sttbId}/cetak`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Gagal cetak STTB.");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    alert("Gagal membuka STTB.");
  }
};

export const getSttbByGudangIn = async (
  gudang_in_id: number,
  setError?: (msg: string) => void
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kwitansi/sttb/${gudang_in_id}/show`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Gagal mengambil data STTB.");
    return await response.json();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil STTB.";
    if (setError) setError(msg);
    console.error("getSttbByGudangIn error:", msg);
  }
};

export const cetakKwitansiCO = async (kwitansiId: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kwitansi/cetak-co/${kwitansiId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Gagal cetak kwitansi CO.");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    alert("Gagal membuka kwitansi CO.");
  }
};

export const getPaginatedKwitansi = async (
  page: number,
  search: string,
  perPage: number,
  onError: (error: string) => void
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login.");
    }

    // 1. Membangun query parameters
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("per_page", String(perPage));
    if (search) {
      params.append("search", search);
    }

    // 2. Fetch ke route 'index' ('/'), BUKAN '/all'
    // URL akan menjadi: /api/kwitansi?page=1&per_page=20&search=...
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/kwitansi?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengambil data kwitansi.");
    }

    // 3. Kembalikan data (sesuai format controller: { data: [...], meta: {...} })
    return await response.json();

  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan";
    onError(message); // Menggunakan callback 'onError' dari page.tsx
    return null; // Kembalikan null agar page.tsx bisa menanganinya
  }
};

export const getAllKwitansi = async (setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Anda harus login.");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/kwitansi/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Gagal mengambil data kwitansi.");
    return await response.json();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil kwitansi.");
    return [];
  }
};
