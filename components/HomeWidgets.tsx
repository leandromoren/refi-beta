"use client";
import React from "react";
import Header from "./header";
import Breadcrumb from "./ui/breadcrumb";

export default function HomeWidgets() {

  type Card = {
    title: string;
    description?: string;
    list?: string[];
    link?: string;
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto p-6 max-w-6xl ">
        <Breadcrumb pathname="" />
        <h1 className="text-2xl text-start font-bold text-gray-900 mb-8">
          ¿Qué tipo de préstamo querés simular?
        </h1>

        {sections.map((section, idx) => (
          <div key={idx} className="mb-12 ">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 ">
              {section.title}
            </h2>
            <p className="text-gray-600 mb-6">{section.subtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.cards.map((card, cidx) => (
                <div
                  key={cidx}
                  className="bg-white border border-gray-200 rounded-lg p-6 relative flex flex-col"
                >
                  <div className="absolute top-4 right-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {card.title}
                  </h3>

                  {card.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {card.description}
                    </p>
                  )}

                  {card.list && (
                    <ul className="text-gray-600 text-sm mb-4">
                      {card.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {card.link && (
                    <a
                      href={card.link}
                      className="text-orange-600 cursor-pointer font-medium text-sm hover:text-orange-700 hover:underline mt-auto"
                    >
                      Simular
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
