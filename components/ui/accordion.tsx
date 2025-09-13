// components/ui/Accordion.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  question: string;
  answer: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 dark:border-gray-600">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 px-2 font-semibold flex justify-between items-center focus:outline-none"
      >
        <span className="text-black cursor-pointer dark:text-white">{question}</span>
        <ChevronDown
          className={`h-5 w-5 cursor-pointer transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <p className="py-2 px-2 text-gray-700 dark:text-gray-300">
          {answer}
        </p>
      )}
    </div>
  );
};

interface AccordionProps {
  items: { q: string; a: string }[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <AccordionItem key={index} question={item.q} answer={item.a} />
      ))}
    </div>
  );
};