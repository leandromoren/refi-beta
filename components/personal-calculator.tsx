"use client";
import React, { useState, useMemo } from "react";
import Header from "./header";
import Breadcrumb from "./ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import InvalidSim from "./ui/invalid-sim";

export default function PersonalLoanCalculator() {
  const [amount, setAmount] = useState<string>("500000");
  const [calculatedAmount, setCalculatedAmount] = useState<string>("500000");
  const [rate, setRate] = useState<string>("120"); // TNA en %
  const [calculatedRate, setCalculatedRate] = useState<string>("120");
  const [term, setTerm] = useState<string>("36"); // Plazo en meses
  const [calculatedTerm, setCalculatedTerm] = useState<string>("36");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  // Constantes para el cálculo
  const ivaRate = 0.21;
  const stampTaxRate = 0.012; // Ejemplo de un 1.2% de sellado
  const montoMaximo = 100000000;

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const termsOptions = [];

  // Generar opciones de 6 a 72 meses en incrementos de 6
  for (let i = 6; i <= 72; i += 6) {
    termsOptions.push(i);
  }

  const calculations = useMemo(() => {
    const principal = Number.parseFloat(calculatedAmount) || 0;
    const annualTNA = Number.parseFloat(calculatedRate) / 100 || 0;
    const months = Number.parseInt(calculatedTerm) || 0;

    if (principal <= 0 || annualTNA <= 0 || months < 6 || months > 72) {
      return { isValid: false };
    }

    // Tasa de interés mensual
    const monthlyRate = annualTNA / 12;

    // Cuota mensual de capital e interés (Sistema Francés)
    const monthlyPayment =
      (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    // Costo del sellado (ej. 1.2% del capital)
    const sellado = principal * stampTaxRate;

    // -------------------------------------------
    // Lógica para CFTEA + IVA
    // -------------------------------------------

    // 1. Calcular el IVA sobre el interés acumulado de todo el préstamo
    //    (El interés va disminuyendo cada mes)
    let totalInterest = 0;
    let remainingPrincipal = principal;
    for (let i = 0; i < months; i++) {
      const interestPortion = remainingPrincipal * monthlyRate;
      totalInterest += interestPortion;
      remainingPrincipal -= monthlyPayment - interestPortion;
    }
    const totalIVA = totalInterest * ivaRate;

    // 2. Sumar todos los costos del préstamo
    const totalCost = monthlyPayment * months + sellado + totalIVA;

    // 3. Calcular la Tasa Efectiva Mensual (TEM) total
    const totalCostMonthlyRate =
      Math.pow(totalCost / principal, 1 / months) - 1;

    // 4. Proyectar la TEM a un año para obtener el CFTEA + IVA
    const cfteaPlusIva = (Math.pow(1 + totalCostMonthlyRate, 12) - 1) * 100;

    return {
      principal,
      annualTNA: annualTNA * 100,
      monthlyPayment,
      sellado,
      ivaOnInterest: totalIVA,
      cfteaPlusIva,
      isValid: true,
    };
  }, [calculatedAmount, calculatedRate, calculatedTerm]);

  const amortizationTable = useMemo(() => {
    if (!calculations.isValid) return [];

    const table = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let remainingPrincipal: any = calculations.principal;
    const monthlyRate = Number.parseFloat(rate) / 100 / 12;

    // Lógica para generar la tabla de amortización
    for (let i = 1; i <= Number.parseInt(term); i++) {
      const interest = (remainingPrincipal || 0) * monthlyRate;
      const amortization = (calculations.monthlyPayment || 0) - interest;
      const ivaOnInterest = interest * ivaRate;

      // El sellado solo se cobra en la primera cuota
      const sellado =
        i === 1 ? (calculations.principal || 0) * stampTaxRate : 0;

      remainingPrincipal -= amortization;

      table.push({
        cuota: i,
        interest,
        amortization,
        iva: ivaOnInterest,
        sellado,
        totalCuota:
          (calculations.monthlyPayment || 0) + ivaOnInterest + sellado,
        remainingPrincipal,
      });
    }

    return table;
  }, [calculations, rate, term]);

  const handleCalculate = async () => {
    setIsLoading(true);
    setShowResults(false);
    setError("");

    setCalculatedAmount(amount);
    setCalculatedRate(rate);
    setCalculatedTerm(term);

    // Validar inputs
    if (Number.parseFloat(amount) <= 0) {
      setError("El monto debe ser mayor a $0");
      setIsLoading(false);
      return;
    }

    if (Number.parseFloat(amount) > montoMaximo) {
      setError(`El monto máximo es de $${montoMaximo.toLocaleString()}`);
      setIsLoading(false);
      return;
    }

    if (!calculations.isValid) {
      setError("Por favor, ingresa valores válidos. Plazo de 6 a 72 meses.");
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setShowResults(true);
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || !isFinite(value) || isNaN(value)) {
      return "$0";
    }
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const isFormValid =
    Number.parseFloat(amount) > 0 &&
    Number.parseFloat(rate) > 0 &&
    Number.parseInt(term) >= 6 &&
    Number.parseInt(term) <= 72;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <div className="space-y-16">
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb pathname="personal" />
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                Simulador de Préstamo Personal
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Calcula la cuota de tu préstamo con un plazo de hasta 72 meses
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="amount" className="text-sm font-medium">
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
                        className="h-14 pl-8 text-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Plazo (cuotas)
                      </Label>
                      <select
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="cursor-pointer flex h-14 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {termsOptions.map((option) => (
                          <option key={option} value={String(option)}>
                            {option} cuotas
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">TNA (%)</Label>
                    <Input
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="100"
                      step="0.1"
                      min="0"
                      className="h-14 text-lg"
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
                    className="flex-1 h-12 cursor-pointer text-base font-semibold bg-orange-400 hover:bg-orange-500 text-white"
                    disabled={isLoading || !isFormValid}
                  >
                    {isLoading ? "Calculando..." : "Simular"}
                  </Button>
                </div>

                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-sm text-black dark:text-white">
                      ¿Qué incluye el cálculo?
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    La **cuota promedio** se calcula con el sistema de
                    amortización **Francés**, que mantiene el valor de la cuota
                    constante. El **CFTEA + IVA** (Costo Financiero Total
                    Efectivo Anual) incluye la tasa nominal anual (**TNA**) más
                    todos los costos adicionales como el **IVA sobre intereses**
                    y el **sellado**.
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
                            Cuota Promedio
                          </p>
                          <p className="text-2xl font-bold text-green-600 dark:text-white">
                            {formatCurrency(calculations.monthlyPayment)}
                          </p>
                        </div>
                        <div className="flex justify-between items-center text-center">
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              TNA
                            </p>
                            <p className="text-base font-semibold text-orange-600 dark:text-white">
                              {(calculations.annualTNA || 0).toFixed(2)}%
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              CFTEA + IVA
                            </p>
                            <p className="text-base font-semibold text-orange-600 dark:text-white">
                              {(calculations.cfteaPlusIva || 0).toFixed(2)}%
                            </p>
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
            </div>
          </div>
          {showDetails &&
            calculations.isValid &&
            amortizationTable.length > 0 && (
              <div className="mt-8 animate-fadeIn max-w-2xl mx-auto">
                <div className="flex items-center space-x-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h.01M7 11h.01M11 11h.01M15 11h.01M9 15h.01M7 15h.01M11 15h.01M15 15h.01M17 19H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h4 className="text-lg font-semibold text-black dark:text-white">
                    Cronograma de pagos ({term} cuotas)
                  </h4>
                </div>

                {/* AÑADE h-[500px] y overflow-y-auto AQUÍ */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-[500px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Mes
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Pago
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Interés
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Saldo restante a pagar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
                      {amortizationTable.map((item) => {
                        // Calcular el porcentaje de interés para cada cuota
                        const interestPercentage =
                          (item.interest / item.totalCuota) * 100;

                        return (
                          <tr key={item.cuota}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-center font-bold text-gray-900 dark:text-gray-100">
                              {item.cuota}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-green-600 dark:text-gray-100">
                              {formatCurrency(item.totalCuota)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400">
                              {formatCurrency(item.interest)}
                              {/* Nuevo: Muestra el porcentaje entre paréntesis */}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                &nbsp;({interestPercentage.toFixed(1)}%)
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                              {formatCurrency(
                                item.remainingPrincipal > 0
                                  ? item.remainingPrincipal
                                  : 0,
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-gray-700 max-w-2xl mx-auto">
                  <h5 className="font-semibold text-sm text-black dark:text-white mb-2">
                    ¿Cómo leer el cronograma?
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <strong>Pago:</strong> Es el valor total de tu cuota
                    mensual. Con el sistema francés, este monto se mantiene
                    constante.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <strong>Interés:</strong> La porción de tu cuota que cubre
                    los intereses. Este valor disminuye cada mes.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <strong>Saldo:</strong> El capital que te queda por pagar.
                    Este valor disminuye con cada cuota.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                    Nota: La parte de tu cuota destinada a pagar capital aumenta
                    mes a mes.
                  </p>
                </div>
              </div>
            )}
        </section>
      </div>
    </div>
  );
}
