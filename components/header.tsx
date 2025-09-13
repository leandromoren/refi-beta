"use client";
import { TTextsFAQ } from "@/lib/texts-faqs";
import { HelpCircle, Coffee } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "./ui/logo";
import React from "react";
import { useState } from "react";
import {
  Accordion,
} from "@/components/ui/accordion";

export default function Header() {
  const [showFAQ, setShowFAQ] = useState(false);

  const faqs = [
    { q: "whatIsRefinancing", a: "whatIsRefinancingA" },
    { q: "whatIsCFT", a: "whatIsCFTA" },
    {
      q: "doesItAlwaysConvinceToRefinance",
      a: "doesItAlwaysConvinceToRefinanceA",
    },
    { q: "whatCostsDoesRefinancingHave", a: "whatCostsDoesRefinancingHaveA" },
    { q: "whatIsTNA", a: "whatIsTNAA" },
    { q: "whatIsTEA", a: "whatIsTEAA" },
    { q: "whatIsIVA", a: "whatIsIVAA" },
    { q: "whatIsStampTax", a: "whatIsStampTaxA" },
    { q: "whatIsAmortization", a: "whatIsAmortizationA" },
  ];

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/">
            <Logo />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFAQ(!showFAQ)}
            className="flex cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            <HelpCircle className="h-4 w-4" />
            FAQ
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex cursor-pointer items-center gap-2 bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-300"
            onClick={() =>
              window.open("https://cafecito.app/leanmoren", "_blank")
            }
          >
            <Coffee className="h-4 w-4" />
            Donar ❤️
          </Button>
        </div>
      </div>
      {showFAQ && (
        <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
              Preguntas Frecuentes
            </h2>
            <Accordion
              items={faqs.map((faq) => ({
                q: TTextsFAQ[faq.q],
                a: TTextsFAQ[faq.a],
              }))}
            />
          </div>
        </section>
      )}
    </header>
  );
}
