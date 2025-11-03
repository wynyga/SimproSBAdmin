// utils/interfaceTransaksi.ts

export interface TransaksiData {
    id?: number;
    unit_id: number | string;
    user_id: number | string;
    harga_jual_standar: number | string;
    kelebihan_tanah: number | string;
    penambahan_luas_bangunan: number | string;
    perubahan_spek_bangunan: number | string;
    total_harga_jual: number | string;
    minimum_dp: number | string;
    biaya_booking: number | string; 
    plafon_kpr?: number | string;   
    kpr_disetujui: "Ya" | "Tidak" | string;
    uang_tanda_jadi: number;
}

export interface TransaksiDataWithRelasi extends TransaksiData {
    user_perumahan?: {
        nama_user: string;
    };
    unit?: {
        nomor_unit: string;
        blok?: { nama_blok: string };
        tipe_rumah?: { tipe_rumah: string };
        kategori?: string;
    };
}

export interface UnitDetail {
  id: number;
  nomor_unit: string;
  // ✅ Kategori ada di 'unit'
  kategori: 'standar' | 'non standar' | 'sudut' | string | null; 
  
  // ✅ Harga Jual ada di dalam 'tipe_rumah'
  tipe_rumah: {
    id: number;
    harga_jual: number; 
  } | null;
}