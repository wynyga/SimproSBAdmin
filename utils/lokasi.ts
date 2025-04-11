export const fetchLocations = async (setLocations: Function, setError: Function, setLoading: Function) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda harus login untuk mengakses lokasi.");
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perumahan`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal memuat lokasi: ${response.status}`);
      }
  
      const data = await response.json();
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
};
  
export const selectLocation = async (id: number, router: any, setError: Function) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
        throw new Error("Anda harus login untuk memilih lokasi.");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/perumahan/select`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ perumahan_id: id }),
        });

        if (!response.ok) {
        throw new Error("Gagal memilih perumahan.");
        }
        router.push(`/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
};