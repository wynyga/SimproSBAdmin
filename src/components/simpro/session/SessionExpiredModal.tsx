"use client";

import React from "react";

interface SessionExpiredModalProps {
  show: boolean;
  onConfirm: () => void;
}

export default function SessionExpiredModal({
  show,
  onConfirm,
}: SessionExpiredModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center">
          Sesi Berakhir
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          Sesi Anda telah habis. Silakan login kembali untuk melanjutkan.
        </p>
        <button
          onClick={onConfirm}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700"
        >
          Login Kembali
        </button>
      </div>
    </div>
  );
}
