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
  jenis_penerimaan: "Langsung" | "Tidak Langsung" | "Ambil Sendiri",
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
      body: JSON.stringify({ gudang_in_id, jenis_penerimaan }),
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