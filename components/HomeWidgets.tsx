"use client";

import React from "react";
import Header from "./header";
import Breadcrumb from "./ui/breadcrumb";

type Card = {
  title: string;
  description: string;
  link: string;
};

type Section = {
  title: string;
  subtitle: string;
  cards: Card[];
};

const sections: Section[] = [
  {
    title: "Para safar",
    subtitle: "Recibí el dinero y usalo para lo que quieras.",
    cards: [
      {
        title: "Express",
        description:
          "Pedí hoy un extra y lo devolvés en una cuota en hasta 45 días.",
        link: "/express",
      },
      {
        title: "Refinanciación de deuda",
        description:
          "Simulá un nuevo préstamo a menor tasa para pagar uno más caro.",
        link: "/refinanciamiento",
      },
      {
        title: "Cuotificación",
        description:
          "Recuperá el dinero que gastaste desde tu cuenta y devolvelo en 3 o 6 cuotas",
        link: "/cuotificacion",
      },
    ],
  },
  {
    title: "Para proyectos",
    subtitle:
      "Pedí un préstamo para renovar tu casa, viajar, comprar tecnología o lo que quieras. Lo devolvés en hasta 72 meses.",
    cards: [
      {
        title: "Personal",
        description: "Dinero en efectivo para usar en lo que quieras.",
        link: "/personal-en-pesos",
      },
      {
        title: "Personal UVA",
        description: "Préstamo en pesos ajustado por UVA. Usalo para lo que quieras y devolvelo en cuotas actualizadas según la inflación.",
        link: "/personal-en-uvas",
      },
    ],
  },
  {
    title: "Para un uso definido",
    subtitle: "Soñá en grande y alcanzá eso que tanto querés.",
    cards: [
      {
        title: "Hipotecario UVA",
        description: "Financiá hasta el 70% de tu primera vivienda.",
        link: "/hipotecario-uva",
      },
    ],
  },
  {
    title: "Para ahorrar",
    subtitle: "Hacé que tus ahorros rindan más que la inflación.",
    cards: [
      {
        title: "Frascos",
        description: "Invertí en plazos fijos con rendimientos por encima de la inflación.",
        link: "/frascos",
      },
    ],
  },
];

export default function HomeWidgets() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto p-6 max-w-6xl">
        <Breadcrumb pathname="" />
        <h1 className="text-4xl text-start font-extrabold text-gray-900 mb-2">
          ¡Hola!
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          ¿Qué tipo de préstamo querés simular?
        </p>

        {sections.map((section, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600 mb-6">{section.subtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {section.cards.map((card, cidx) => (
                <a
                  key={cidx}
                  href={card.link}
                  className="flex flex-col bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {card.description}
                  </p>
                  <span className="text-orange-600 font-medium text-sm hover:underline mt-auto">
                    Simular
                  </span>
                </a>
              ))}
            </div>
            {idx < sections.length - 1 && (
              <hr className="my-12 border-t-2 border-gray-200" />
            )}
          </div>
        ))}
      </main>
    </div>
  );
}