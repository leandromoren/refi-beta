"use client";

import React, { useState } from "react";
import {
  DollarSign,
  BarChart2,
  Loader2,
  AlertTriangle,
  Info,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Header from "./header";
import Breadcrumb from "./ui/breadcrumb";

const TNA_OPTIONS = [
  { days: 28, label: "28 días" },
  { days: 14, label: "14 días" },
  { days: 7, label: "7 días" },
];

export default function FrascosCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [selectedDays, setSelectedDays] = useState(TNA_OPTIONS[0].days);
  const [tna28Days, setTna28Days] = useState(50);
  const [tna14Days, setTna14Days] = useState(46);
  const [tna7Days, setTna7Days] = useState(43);

  const [simulationResult, setSimulationResult] = useState<{
    finalAmount: number;
    earnings: number;
    dailyEarnings: number;
    tna: number;
    days: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const getTnaValue = (days: number) => {
    switch (days) {
      case 28:
        return tna28Days;
      case 14:
        return tna14Days;
      case 7:
        return tna7Days;
      default:
        return 0;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSimulate = () => {
    if (!investmentAmount || investmentAmount <= 0) return;

    setLoading(true);
    setSimulationResult(null);
    setShowDetails(true);

    const tnaValue = getTnaValue(selectedDays);

    setTimeout(() => {
      const dailyRate = tnaValue / 36500;
      const earnings = investmentAmount * dailyRate * selectedDays;
      const finalAmount = investmentAmount + earnings;
      const dailyEarnings = earnings / selectedDays;

      setSimulationResult({
        finalAmount: finalAmount,
        earnings: earnings,
        dailyEarnings: dailyEarnings,
        tna: tnaValue,
        days: selectedDays,
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen  flex flex-col items-center p-8">
        <div className="max-w-6xl w-full space-y-8">
          <Breadcrumb pathname="frascos" />
          <h1 className="text-3xl font-bold text-start text-gray-800">
            Simulá tus Frascos
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Monto a invertir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) =>
                          setInvestmentAmount(parseFloat(e.target.value) || 0)
                        }
                        className="pl-10"
                        placeholder="Ej: 10.000"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {TNA_OPTIONS.map((option) => (
                        <div
                          key={option.days}
                          className={`relative p-4 text-center rounded-lg border-2 cursor-pointer transition-all ${
                            selectedDays === option.days
                              ? "border-purple-600 bg-purple-50 shadow-md"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedDays(option.days)}
                        >
                          <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            TNA
                          </div>
                          <div className="mt-2 space-y-2">
                            <Input
                              type="number"
                              value={getTnaValue(option.days)}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                if (option.days === 28) setTna28Days(value);
                                if (option.days === 14) setTna14Days(value);
                                if (option.days === 7) setTna7Days(value);
                              }}
                              className="text-center font-bold text-lg p-1"
                            />
                            <p className="font-medium text-sm text-gray-700">
                              {option.label}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <div className="w-full flex justify-center">
                    <Button
                      className="w-full justify-center align-middle py-6 text-lg font-bold cursor-pointer bg-orange-400 hover:bg-orange-500 text-white"
                      onClick={handleSimulate}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Calculando...
                        </>
                      ) : (
                        "Simular"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Card de Resultados (siempre visible) */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <BarChart2 className="mr-2 h-6 w-6 text-green-600" />
                    Resultados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-700">
                  {simulationResult ? (
                    <>
                      <div className="flex justify-between items-center text-lg">
                        <span>Rendimiento Estimado:</span>
                        <span className="font-bold text-green-600">
                          + {formatCurrency(simulationResult.earnings)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg">
                        <span>Total a recibir:</span>
                        <span className="font-bold text-purple-600">
                          {formatCurrency(simulationResult.finalAmount)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                      <Info className="h-8 w-8 mb-2" />
                      <p className="text-sm text-center">
                        Simula tu inversión para ver los resultados aquí.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Columna derecha: Detalles (siempre visible) */}
            <div className="space-y-8 h-full">
              <Card className="shadow-lg h-full">
                <CardContent className="p-6 flex flex-col justify-center">
                  {simulationResult && showDetails ? (
                    <div className="space-y-4">
                      <Alert className="bg-yellow-100 border-yellow-300 text-yellow-800">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="text-sm font-semibold">
                          ¡Atención!
                        </AlertTitle>
                        <AlertDescription className="text-sm">
                          Si se cancela el frasco antes de su vencimiento, el
                          rendimiento generado se cancela y solo se devuelve el
                          capital inicial.
                        </AlertDescription>
                      </Alert>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className=" text-sm">
                            TNA Seleccionada
                          </p>
                          <p className="text-xl font-bold text-gray-800">
                            {simulationResult.tna}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className=" text-sm">Plazo Elegido</p>
                          <p className="text-xl font-bold text-gray-800">
                            {simulationResult.days} días
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1 mt-4">
                        <p className="text-sm">
                          Rendimiento por Día
                        </p>
                        <p className="text-xl font-bold text-gray-800">
                          {formatCurrency(simulationResult.dailyEarnings)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                      <TrendingUp className="h-8 w-8 mb-2" />
                      <p className="text-sm text-center">
                        El detalle de tu rendimiento aparecerá aquí.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
