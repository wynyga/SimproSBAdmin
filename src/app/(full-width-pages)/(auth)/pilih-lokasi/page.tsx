import PilihLokasi from "@/components/pilih-lokasi/PilihLokasi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilih Lokasi | SIMPRO",
  description: "Halaman pemilihan lokasi perumahan sebelum masuk dashboard",
};

export default function PilihLokasiPage() {
  return <PilihLokasi />;
}
