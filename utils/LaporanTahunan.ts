export const getLaporanTahunan = async (
  tahun: number,
  setError: (msg: string) => void
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk mengakses data.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/laporan_tahunan/${tahun}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Gagal mengambil data laporan tahunan. Server response: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan saat mengambil laporan tahunan."
    );
    return null;
  }
};
