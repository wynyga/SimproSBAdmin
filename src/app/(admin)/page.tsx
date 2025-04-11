"use client"; // ⬅️ Pastikan ini tetap ada di baris pertama

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home(): null {
  const router = useRouter();

  useEffect(() => {
    router.push("/signin");
  }, [router]);

  return null; 
}
