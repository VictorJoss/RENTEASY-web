import React from "react";

export default function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-300">
      <div className="mb-8 text-center">
        <img src="/logo.svg" alt="RentEasy" className="mx-auto h-16 w-16" />
        <h1 className="text-3xl font-bold mt-2 text-neutral-800">RentEasy</h1>
        <p className="text-neutral-500 text-sm">Gestión de alquileres en Colombia</p>
      </div>
      {children}
    </div>
  );
}
