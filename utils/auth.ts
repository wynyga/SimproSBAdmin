export const loginAPI = async (email:string, password:string, setError:Function, router:any)=>
{
    
    try{
    const response = await fetch (`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,{
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({email,password}),
    });

    const result = await response.json();

    if(!response.ok || !result.data?.access_token)
    {
        throw new Error(result.message ||"Login gagal.");
    }

    const {access_token}=result.data;
    localStorage.setItem("token", access_token);
    router.replace("/pilih-lokasi");
    }
    catch(err){
    setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
}

export const getProfile  = async (setError: Function) => 
{
    try{
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token tidak ditemukan.");
    }

    const response = await fetch (`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/profile`,{
        method:"GET",
        headers: {"Authorization": `Bearer ${token}`}
    })

    if (!response.ok) {
        throw new Error(`Gagal memuat profile: ${response.status}`);
    }

    const result = await response.json();
    return result.data; // Mengembalikan objek data dari respons API
    }
    catch(err)
    {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
};

export const registerUser = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    setError: Function
) => {
try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name,
        email,
        password,
        c_password: confirmPassword, // Sesuai dengan controller
    }),
    });

    const result = await response.json();

    if (!response.ok) {
    throw new Error(result.message || "Gagal mendaftar. Periksa kembali data Anda.");
    }

    return result;
} catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat registrasi.");
}
};

// Fungsi untuk Logout
export const logoutUser = async (setError: Function) => {
try {
    const token = localStorage.getItem("token");
    if (!token) {
    throw new Error("Anda harus login untuk logout.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
    });

    if (!response.ok) {
    throw new Error("Gagal logout.");
    }

    localStorage.removeItem("token"); // Hapus token dari localStorage setelah logout

    return { message: "Logout berhasil" };
} catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat logout.");
}
};

// Fungsi untuk Refresh Token
export const refreshToken = async (setError: Function) => {
try {
    const token = localStorage.getItem("token");
    if (!token) {
    throw new Error("Token tidak ditemukan. Harap login kembali.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
    });

    const result = await response.json();

    if (!response.ok) {
    throw new Error("Gagal memperbarui token.");
    }

    localStorage.setItem("token", result.data.access_token); // Simpan token baru ke localStorage

    return result;
} catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui token.");
}
};
  
  // Mengupdate profil pengguna
export const updateProfile = async (
  name: string,
  email: string,
  setError: Function
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk mengubah profil.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal memperbarui profil.");
    }

    return result;
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui profil.");
  }
};

// Mengubah password pengguna
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  setError: Function
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk mengubah password.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal memperbarui password.");
    }

    return result;
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui password.");
  }
};

// Mengambil daftar semua pengguna
export const getUsers = async (setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk melihat data pengguna.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil daftar pengguna.");
    }

    const result = await response.json();

    if (Array.isArray(result)) {
      return result;
    } else if (result && Array.isArray(result.data)) {
      return result.data; // Jika API membungkus dalam "data"
    } else {
      console.warn("⚠️ Format data API tidak sesuai, mengembalikan array kosong.");
      return [];
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil daftar pengguna.");
    return [];
  }
};


// Mereset password pengguna
export const resetUserPassword = async (
  userId: number,
  newPassword: string,
  confirmPassword: string,
  setError: Function
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk mereset password.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/reset-password/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mereset password pengguna.");
    }

    return result;
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mereset password pengguna.");
  }
};

export const deleteUser = async (userId: number, setError: Function) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Anda harus login untuk menghapus pengguna.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal menghapus pengguna.");
    }

    return result;
  } catch (err) {
    setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus pengguna.");
  }
};


