import { Home, ChevronRight } from "lucide-react";
import React from "react";

export default function Breadcrumb(location: { pathname: string }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
      <Home className="h-4 w-4" />
      <a href="/">Inicio</a>
      <ChevronRight className="h-4 w-4" />
      <span className="capitalize">{location.pathname}</span>
      
    </nav>
  );
}
