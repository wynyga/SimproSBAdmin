export interface StockData {
    kode_barang: string;
    nama_barang: string;
    uty: string;
    satuan: string;
    harga_satuan: string| number;
    stock_bahan: number;
    total_price: string;
    [key: string]: string | number | undefined;
  }
  