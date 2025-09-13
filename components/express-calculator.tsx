"use client";
import React from "react";
import Header from "./header";
import Breadcrumb from "./ui/breadcrumb";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import InvalidSim from "./ui/invalid-sim";

/* Préstamo express ofrece financiamiento en hasta 48 meses
Esta línea de créditos personales tiene montos hasta $1.000.000,
Devolvelo a los 45 días en una sola cuota.
impuestos: La amortización de capital, interés, IVA sobre intereses y sellado.
*/

export default function ExpressCalculator() {
  const [amount, setAmount] = useState<string>("0");
  const [calculatedAmount, setCalculatedAmount] = useState<string>("0");
  const [rate, setRate] = useState<string>("0"); // TNA
  const [calculatedRate, setCalculatedRate] = useState<string>("0");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const maxAmount = 1000000;
  const daysInTerm = 45;
  const daysInYear = 365;

  const calculations = useMemo(() => {
    const principal = Number.parseFloat(calculatedAmount) || 0;
    const annualTNA = Number.parseFloat(calculatedRate) / 100 || 0;
    const months = Number.parseInt(calculatedRate) || 0;
    const ivaRate = 0.21;
    const stampTaxRate = 0.012;

    if (principal <= 0 || principal > maxAmount || annualTNA <= 0) {
      return { isValid: false };
    }

    const dailyRate = annualTNA / daysInYear;
    const interest = principal * dailyRate * daysInTerm;
    const ivaOnInterest = interest * 0.21;
    const sellado = principal * 0.01;

    const totalToPay = principal + interest + ivaOnInterest + sellado;

    // The CFT calculation for a single payment is simplified
    const totalCostFactor = (totalToPay - principal) / principal;
    const annualCFT = totalCostFactor * (daysInYear / daysInTerm) * 100;

    const totalCostMonthlyRate =
      Math.pow(totalToPay / principal, 1 / months) - 1;
    const cfteaPlusIva = (Math.pow(1 + totalCostMonthlyRate, 12) - 1) * 100;

    return {
      principal,
      interest,
      ivaOnInterest,
      sellado,
      totalToPay,
      annualTNA: annualTNA * 100,
      annualCFT,
      cfteaPlusIva,
      isValid: true,
    };
  }, [calculatedAmount, calculatedRate]);

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleCalculate = async () => {
    setIsLoading(true);
    setShowResults(false);
    setError("");

    setCalculatedAmount(amount);
    setCalculatedRate(rate);

    if (Number.parseFloat(amount) > maxAmount) {
      setError(`El monto máximo es de $${maxAmount.toLocaleString()}`);
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setShowResults(true);
  };

  const formatCurrency = (value: number) => {
    if (!isFinite(value) || isNaN(value)) {
      return "$0";
    }
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <div className="space-y-16">
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb pathname="express" />
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                Simulá tu Préstamo Express
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Calculá el costo de tu préstamo a 45 días con una sola cuota
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="amount"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Monto
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        min="0"
                        max={maxAmount}
                        className="h-14 pl-8 text-lg border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Podés pedir hasta {formatCurrency(maxAmount)}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      TNA (%)
                    </Label>
                    <Input
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="100"
                      step="0.1"
                      min="0"
                      className="h-14 text-lg border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
                {error && (
                  <div className="mt-4 p-3 rounded-md bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
                <div className="flex pt-6">
                  <Button
                    onClick={handleCalculate}
                    className="flex-1 h-12 text-base cursor-pointer font-semibold bg-orange-400 hover:bg-orange-500 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Calculando..." : "Simular"}
                  </Button>
                </div>
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-600 dark:text-yellow-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <h3 className="font-semibold text-sm text-black dark:text-white">
                      ¿Qué incluye el cálculo?
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    La simulación del **Costo Financiero Total (CFT)** incluye
                    todos los conceptos que se suman al capital del préstamo: el
                    interés nominal, el **IVA** sobre los intereses (21%) y los
                    gastos de **Sellado** (1% del capital). Estos valores se
                    calculan para el período de devolución de 45 días.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full min-h-[400px]">
                  {isLoading ? (
                    <div className="text-center space-y-4 flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Calculando tu préstamo...
                      </p>
                    </div>
                  ) : error ? (
                    <InvalidSim />
                  ) : showResults && calculations.isValid ? (
                    <div className="space-y-6 h-full">
                      <h3 className="text-xl font-semibold text-black dark:text-white">
                        Resultados de la Simulación
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Pagás una cuota de
                          </p>
                          <p className="text-2xl font-bold text-black dark:text-white">
                            {formatCurrency(calculations.totalToPay || 0)}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Intereses
                            </p>
                            <p className="text-base font-semibold text-black dark:text-white">
                              {formatCurrency(calculations.interest || 0)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              IVA + Sellado
                            </p>
                            <p className="text-base font-semibold text-black dark:text-white">
                              {formatCurrency(
                                (calculations.ivaOnInterest ?? 0) +
                                  (calculations.sellado ?? 0)
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                              CFT anual (estimado)
                            </span>
                            <span className="text-lg font-bold text-black dark:text-white">
                              {(calculations.annualCFT ?? 0).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full bg-orange-50 cursor-pointer border-orange-300 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-300"
                        onClick={handleShowDetails}
                      >
                        {showDetails ? "Ocultar detalles" : "Ver detalles"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4 flex flex-col items-center justify-center h-full">
                      <Calculator className="h-16 w-16 text-gray-400 mx-auto" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Ingresa los datos para ver tu simulación
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {showDetails && calculations.isValid && (
                <div className="mt-8 animate-fadeIn">
                  <h4 className="text-lg font-semibold mb-4">
                    Detalles del Préstamo
                  </h4>
                  <p className="text-sm text-gray-500">
                    Desde que lo pedís, tenés entre 5 y 45 días para pagarlo.
                  </p>
                  <div className="flex flex-col lg:flex-row gap-8 justify-center">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex-1 w-full lg:w-1/2">
                      <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Concepto
                            </th>
                            <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Monto
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black">
                          <tr>
                            <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                              Capital Solicitado
                            </td>
                            <td className="px-2 py-2 text-xs text-right text-gray-900 dark:text-gray-100">
                              {formatCurrency(calculations.principal || 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                              Total de Intereses
                            </td>
                            <td className="px-2 py-2 text-xs text-right text-gray-900 dark:text-gray-100">
                              {formatCurrency(calculations.interest || 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                              IVA sobre Intereses
                            </td>
                            <td className="px-2 py-2 text-xs text-right text-gray-900 dark:text-gray-100">
                              {formatCurrency(calculations.ivaOnInterest || 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                              Sellado
                            </td>
                            <td className="px-2 py-2 text-xs text-right text-gray-900 dark:text-gray-100">
                              {formatCurrency(calculations.sellado || 0)}
                            </td>
                          </tr>
                          <tr className="bg-green-50 dark:bg-green-950">
                            <td className="px-2 py-2 text-xs font-bold text-green-900 dark:text-green-200">
                              TOTAL A PAGAR
                            </td>
                            <td className="px-2 py-2 text-xs font-bold text-right text-green-900 dark:text-green-200">
                              {formatCurrency(calculations.totalToPay || 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
