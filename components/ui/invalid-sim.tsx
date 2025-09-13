import Image from "next/image";
import React from "react";

export default function InvalidSim() {
  return (
    <div className="text-center p-8 bg-white dark:bg-gray-900 max-w-4xl mx-auto">
      <div className="flex justify-center mb-4">
        <Image
          src="/assets/error.png"
          alt="Warning Icon"
          width={48}
          height={48}
          className="animate-pulse"
        />
      </div>
      <p className="font-semibold text-xl text-red-600 dark:text-red-400">
        Datos incompletos o inválidos
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        Por favor, revisa la información proporcionada e inténtalo de nuevo.
      </p>
    </div>
  );
}
