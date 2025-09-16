"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, LineChart } from "lucide-react";
import { DebtComparison } from "./debt-comparison";
import { PaymentSchedule } from "./payment-schedule";
import { SavingsBreakdown } from "./savings-breakdown";
import { ArgentineTaxBreakdown } from "./argentine-tax-breakdown";
import Header from "./header";
import Breadcrumb from "./ui/breadcrumb";
import { Card } from "./ui/card";

export function RefiCalculator() {
  const [amount, setAmount] = useState<string>("1000");
  const [currentRate, setCurrentRate] = useState<string>("1000");
  const [newRate, setNewRate] = useState<string>("100");
  const [years, setYears] = useState<string>("5");
  const [province] = useState<string>("6");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [calculatedData, setCalculatedData] = useState<any>(null);
  const [selectedTaxes, setSelectedTaxes] = useState({
    iva: true,
    impuestoCheque: true,
    iibb: true,
    sellos: true,
    municipal: true,
  });

  const calculateSimulation = () => {
    const principal = Number.parseFloat(amount) || 0;
    const currentTNA = Number.parseFloat(currentRate) / 100 || 0;
    const newTNA = Number.parseFloat(newRate) / 100 || 0;
    const termYears = Number.parseFloat(years) || 1;
    const monthsTotal = termYears * 12;
    const iibbRate = Number.parseFloat(province) / 100 || 0.06;

    if (principal <= 0 || currentTNA < 0 || newTNA < 0 || termYears <= 0) {
      return { isValid: false };
    }

    const calculateArgentineTaxes = (
      interestAmount: number,
      principal: number
    ) => {
      const iva = selectedTaxes.iva ? interestAmount * 0.21 : 0;
      const impuestoCheque = selectedTaxes.impuestoCheque
        ? principal * 0.006
        : 0;
      const iibb = selectedTaxes.iibb ? interestAmount * iibbRate : 0;
      const sellos = selectedTaxes.sellos ? principal * 0.01 : 0;
      const municipal = selectedTaxes.municipal ? principal * 0.02 : 0;

      return {
        iva,
        impuestoCheque,
        iibb,
        sellos,
        municipal,
        total: iva + impuestoCheque + iibb + sellos + municipal,
      };
    };

    const calculateMonthlyPayment = (
      principal: number,
      annualRate: number,
      months: number
    ) => {
      if (annualRate === 0) return principal / months;
      const monthlyRate = annualRate / 12;
      return (
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        (Math.pow(1 + monthlyRate, months) - 1)
      );
    };

    const currentMonthlyPayment = calculateMonthlyPayment(
      principal,
      currentTNA,
      monthsTotal
    );
    const newMonthlyPayment = calculateMonthlyPayment(
      principal,
      newTNA,
      monthsTotal
    );

    const currentTotalPayment = currentMonthlyPayment * monthsTotal;
    const newTotalPayment = newMonthlyPayment * monthsTotal;

    const currentTotalInterest = currentTotalPayment - principal;
    const newTotalInterest = newTotalPayment - principal;

    const currentTaxes = calculateArgentineTaxes(
      currentTotalInterest,
      principal
    );
    const newTaxes = calculateArgentineTaxes(newTotalInterest, principal);

    const currentCFTTotal = currentTotalPayment + currentTaxes.total;
    const newCFTTotal = newTotalPayment + newTaxes.total;

    const currentCFT =
      ((currentCFTTotal / principal) ** (1 / termYears) - 1) * 100;
    const newCFT = ((newCFTTotal / principal) ** (1 / termYears) - 1) * 100;

    const totalSavings = currentCFTTotal - newCFTTotal;
    const monthlySavings = (currentCFTTotal - newCFTTotal) / monthsTotal;
    const interestSavings = currentTotalInterest - newTotalInterest;

    return {
      principal,
      currentMonthlyPayment,
      newMonthlyPayment,
      currentTotalPayment: currentCFTTotal,
      newTotalPayment: newCFTTotal,
      currentTotalInterest,
      newTotalInterest,
      totalSavings,
      monthlySavings,
      interestSavings,
      monthsTotal,
      currentTNA,
      newTNA,
      currentCFT,
      newCFT,
      currentTaxes,
      newTaxes,
      isValid: true,
    };
  };

  const handleCalculate = async () => {
    setIsLoading(true);
    setShowResults(false);

    // Simula el calculo
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results = calculateSimulation();
    setCalculatedData(results);

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

  const handleTaxChange = (
    taxType: keyof typeof selectedTaxes,
    checked: boolean
  ) => {
    setSelectedTaxes((prev) => ({
      ...prev,
      [taxType]: checked,
    }));
    setShowResults(false);
  };

  const maxAmount = 100000000;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <div className="space-y-16">
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb pathname={"refinanciación "} />
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                Simulá tu Refinanciamiento
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Compará tu deuda actual con una nueva a menor tasa y descubrí
                cuánto podés ahorrar
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
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = Number(value);

                          if (numValue <= maxAmount) {
                            setAmount(value);
                          }
                        }}
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
                      Plazo{" "}
                      <Info className="h-4 w-4 inline ml-1 text-gray-400" />
                    </Label>
                    <Select value={years} onValueChange={setYears}>
                      <SelectTrigger className="h-14 text-lg border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Seleccioná uno" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 año (12 meses)</SelectItem>
                        <SelectItem value="2">2 años (24 meses)</SelectItem>
                        <SelectItem value="3">3 años (36 meses)</SelectItem>
                        <SelectItem value="5">5 años (60 meses)</SelectItem>
                        <SelectItem value="7">7 años (84 meses)</SelectItem>
                        <SelectItem value="10">10 años (120 meses)</SelectItem>
                        <SelectItem value="15">15 años (180 meses)</SelectItem>
                        <SelectItem value="20">20 años (240 meses)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      El monto determina las opciones
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      TNA Actual (%)
                    </Label>
                    <Input
                      type="number"
                      value={currentRate}
                      onChange={(e) => setCurrentRate(e.target.value)}
                      placeholder="25"
                      step="0.1"
                      min="0"
                      className="h-14 text-lg border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nueva TNA (%)
                    </Label>
                    <Input
                      type="number"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      placeholder="10"
                      step="0.1"
                      min="0"
                      className="h-14 text-lg border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                    Impuestos a incluir en el CFT
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="iva"
                        checked={selectedTaxes.iva}
                        onCheckedChange={(checked) =>
                          handleTaxChange("iva", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="iva"
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        IVA (21%)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="impuesto-cheque"
                        checked={selectedTaxes.impuestoCheque}
                        onCheckedChange={(checked) =>
                          handleTaxChange("impuestoCheque", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="impuesto-cheque"
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        Imp. Cheque (0.6%)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="sellos"
                        checked={selectedTaxes.sellos}
                        onCheckedChange={(checked) =>
                          handleTaxChange("sellos", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="sellos"
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        Sellos (1%)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="municipal"
                        checked={selectedTaxes.municipal}
                        onCheckedChange={(checked) =>
                          handleTaxChange("municipal", checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="municipal"
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        Tasas Municipales
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    onClick={handleCalculate}
                    className="flex-1 h-12 text-base font-semibold bg-orange-400 hover:bg-orange-500 text-white cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Calculando..." : "Simular"}
                  </Button>
                  <a href="/">
                    <Button
                      variant="ghost"
                      className="h-12 text-base text-gray-600 hover:text-gray-800 cursor-pointer"
                    >
                      Regresar
                    </Button>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full min-h-[400px]">
                  {isLoading ? (
                    <div className="text-center space-y-4 flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Calculando tu simulación...
                      </p>
                    </div>
                  ) : showResults && calculatedData.isValid ? (
                    <div className="space-y-6 h-full">
                      <h3 className="text-xl font-semibold text-black dark:text-white">
                        Simulación
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Cuota promedio
                          </p>
                          <p className="text-2xl font-bold text-black dark:text-white">
                            {formatCurrency(calculatedData.newMonthlyPayment)}
                          </p>
                        </div>

                        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                            Ahorro con refinanciamiento
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Cuota anterior:
                              </span>
                              <span className="text-sm font-medium text-red-600">
                                {formatCurrency(
                                  calculatedData.currentMonthlyPayment
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Cuota nueva:
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                {formatCurrency(
                                  calculatedData.newMonthlyPayment
                                )}
                              </span>
                            </div>
                            <div className="border-t border-green-200 dark:border-green-700 pt-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                                  Ahorras por mes:
                                </span>
                                <span className="text-sm font-bold text-green-600">
                                  {formatCurrency(
                                    calculatedData.monthlySavings
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                TNA
                              </span>
                              <Info className="h-3 w-3 text-gray-400" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400 line-through">
                                {calculatedData.currentTNA > 0
                                  ? `${(
                                      calculatedData.currentTNA * 100
                                    ).toFixed(0)}%`
                                  : ""}
                              </span>
                              <span className="text-lg font-semibold text-black dark:text-white">
                                {(calculatedData.newTNA * 100).toFixed(2)}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                CFTEA + IVA
                              </span>
                              <Info className="h-3 w-3 text-gray-400" />
                            </div>
                            <p className="text-lg font-semibold text-black dark:text-white">
                              {calculatedData.newCFT.toFixed(2)}%
                            </p>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            variant="outline"
                            className="w-full bg-orange-50 cursor-pointer border-orange-300 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-300"
                            onClick={() => setShowAdvancedDetails(true)}
                          >
                            Detalle de cuotas
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-gray-700">
                      <Card className="shadow-none border-dashed bg-gray-50 flex flex-col items-center p-6 text-center">
                        <LineChart className="h-16 w-16 mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold text-gray-800">
                          Resultados de la simulación
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Simula una inversión para ver los resultados
                          reflejados aquí.
                        </p>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {showResults && calculatedData.isValid && (
          <div className="space-y-8 px-6">
            <div className="max-w-4xl mx-auto">
              {showAdvancedDetails && (
                <div className="space-y-16">
                  <ArgentineTaxBreakdown
                    calculations={calculatedData}
                    formatCurrency={formatCurrency}
                  />
                  <DebtComparison
                    calculations={calculatedData}
                    formatCurrency={formatCurrency}
                  />
                  <SavingsBreakdown
                    calculations={calculatedData}
                    formatCurrency={formatCurrency}
                  />
                  <PaymentSchedule
                    calculations={calculatedData}
                    formatCurrency={formatCurrency}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
