import React from "react";

export default function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-300 p-4">
      <div className="mb-2 text-center">
        <img src="/logo.png" alt="RentEasy" className="mx-auto h-15 w-20" />
        {/* <h1 className="text-3xl font-bold mt-2 text-neutral-800">RentEasy</h1> */}
        {/* <p className="text-neutral-500 text-sm">Gestión de alquileres en Colombia</p> */}
      </div>
      {children}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-xl shadow-2xl text-xs max-w-xs border border-gray-200 font-mono">
        <h4 className="font-bold text-sm mb-3 text-black">Credenciales para Probar el Sistema</h4>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-700">👤 Rol Propietario:</p>
            <p className="text-gray-800"><strong>Email:</strong> <code className="bg-gray-200 text-black px-1.5 py-0.5 rounded">propietario@gmail.com</code></p>
            <p className="text-gray-800"><strong>Contraseña:</strong> <code className="bg-gray-200 text-black px-1.5 py-0.5 rounded">test12345</code></p>
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <div>
            <p className="font-semibold text-gray-700">👤 Rol Inquilino:</p>
            <p className="text-gray-800"><strong>Email:</strong> <code className="bg-gray-200 text-black px-1.5 py-0.5 rounded">inquilino@gmail.com</code></p>
            <p className="text-gray-800"><strong>Contraseña:</strong> <code className="bg-gray-200 text-black px-1.5 py-0.5 rounded">test12345</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
