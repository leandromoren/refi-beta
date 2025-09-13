"use client";

import React, { useState } from "react";
import { Info, Loader2, Calendar, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Breadcrumb from "./ui/breadcrumb";
import Header from "./header";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface SimulationData {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortizationTable: AmortizationRow[];
  propertyValue: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}

export default function SimuladorHipotecarioPage() {
  const [propertyValue, setPropertyValue] = useState(250000);
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRateUSD, setInterestRateUSD] = useState(5.0);
  const [interestRateARS, setInterestRateARS] = useState(80.0);
  const [loanTerm, setLoanTerm] = useState(30);
  const [currency, setCurrency] = useState("USD");
  const [simulationData, setSimulationData] = useState<SimulationData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number, locale: string, currency: string) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSimulate = () => {
    setLoading(true);
    setSimulationData(null);

    setTimeout(() => {
      let loanAmount: number;
      let monthlyRate: number;
      let interestRateToUse: number;

      if (currency === "USD") {
        loanAmount = propertyValue - downPayment;
        interestRateToUse = interestRateUSD;
        monthlyRate = interestRateToUse / 100 / 12;
      } else {
        loanAmount = propertyValue - downPayment;
        interestRateToUse = interestRateARS;
        monthlyRate = interestRateToUse / 100 / 12;
      }

      const numberOfPayments = loanTerm * 12;

      const monthlyPayment =
        (loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

      const amortizationTable: AmortizationRow[] = [];
      let currentBalance = loanAmount;
      let totalInterest = 0;

      for (let i = 1; i <= numberOfPayments; i++) {
        const interestPayment = currentBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        currentBalance -= principalPayment;
        totalInterest += interestPayment;

        amortizationTable.push({
          month: i,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: currentBalance > 0 ? currentBalance : 0,
        });
      }

      setSimulationData({
        monthlyPayment,
        totalInterest,
        totalPayment: loanAmount + totalInterest,
        amortizationTable,
        propertyValue,
        downPayment,
        loanAmount,
        interestRate: interestRateToUse,
        loanTerm,
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto space-y-8 p-8">
        <Breadcrumb pathname="hipotecario" />
        <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
          <Info className="h-4 w-4" />
          <AlertTitle>Antes de Simular, Ten en Cuenta</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              Para tomar un préstamo hipotecario, debes cumplir requisitos de
              edad, antigüedad laboral e ingresos estables.
            </p>
            <p>
              Considera los costos totales que incluyen la cuota, tasas, seguros
              y gastos de escrituración y tasación.
            </p>
            <p>
              Compara siempre las ofertas bancarias y entiende las condiciones
              del préstamo (tasa fija o UVA).
            </p>
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Tu propiedad y Préstamo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency-select">Moneda</Label>
                  <Select
                    value={currency}
                    onValueChange={(value) => setCurrency(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">Dólares (USD)</SelectItem>
                      <SelectItem value="ARS">Pesos (ARS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property-value">Monto de la propiedad</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {currency === "USD" ? "USD" : "ARS"}
                    </span>
                    <Input
                      id="property-value"
                      type="number"
                      value={propertyValue}
                      onChange={(e) =>
                        setPropertyValue(parseFloat(e.target.value))
                      }
                      className="pl-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="down-payment">Ahorro inicial</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {currency === "USD" ? "USD" : "ARS"}
                    </span>
                    <Input
                      id="down-payment"
                      type="number"
                      value={downPayment}
                      onChange={(e) =>
                        setDownPayment(parseFloat(e.target.value) || 0)
                      }
                      className="pl-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan-term">Plazo del préstamo</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="loan-term"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseFloat(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest-rate">Tasa de interés (%)</Label>
                  <div className="relative">
                    <Info className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="interest-rate"
                      type="number"
                      value={
                        currency === "USD" ? interestRateUSD : interestRateARS
                      }
                      onChange={(e) =>
                        currency === "USD"
                          ? setInterestRateUSD(parseFloat(e.target.value))
                          : setInterestRateARS(parseFloat(e.target.value))
                      }
                      step="0.1"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer"
                  onClick={handleSimulate}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculando...
                    </>
                  ) : (
                    "Simular"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card: Cuota mensual y resumen */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Tu Cuota Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  <p className="mt-4 text-sm text-gray-600">
                    Calculando tu cuota...
                  </p>
                </div>
              ) : simulationData ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatCurrency(
                        simulationData.monthlyPayment,
                        currency === "USD" ? "en-US" : "es-AR",
                        currency
                      )}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      Monto del préstamo:{" "}
                      <span className="font-semibold">
                        {formatCurrency(
                          simulationData.loanAmount,
                          currency === "USD" ? "en-US" : "es-AR",
                          currency
                        )}
                      </span>
                    </p>
                    <p>
                      Intereses totales:{" "}
                      <span className="font-semibold">
                        {formatCurrency(
                          simulationData.totalInterest,
                          currency === "USD" ? "en-US" : "es-AR",
                          currency
                        )}
                      </span>
                    </p>
                    <p>
                      Costo total del préstamo:{" "}
                      <span className="font-semibold">
                        {formatCurrency(
                          simulationData.totalPayment,
                          currency === "USD" ? "en-US" : "es-AR",
                          currency
                        )}
                      </span>
                    </p>
                  </div>
                  <Alert>
                    <AlertTitle>Gastos adicionales</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        <li>Tasación: 0.1% del valor del inmueble</li>
                        <li>Escrituración: 1% del valor de compra</li>
                        <li>Impuestos: 1.2% del valor de compra</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500 p-8">
                  <Home className="h-8 w-8 mb-2" />
                  <p>
                    Ingresa los datos de tu futura casa para simular el
                    préstamo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Card: Cuadro de Amortización */}
        {simulationData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Cuadro de Amortización
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mes</TableHead>
                      <TableHead>Pago Mensual</TableHead>
                      <TableHead>Capital</TableHead>
                      <TableHead>Intereses</TableHead>
                      <TableHead>Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulationData.amortizationTable.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>
                          {formatCurrency(
                            row.payment,
                            currency === "USD" ? "en-US" : "es-AR",
                            currency
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            row.principal,
                            currency === "USD" ? "en-US" : "es-AR",
                            currency
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            row.interest,
                            currency === "USD" ? "en-US" : "es-AR",
                            currency
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            row.balance,
                            currency === "USD" ? "en-US" : "es-AR",
                            currency
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="mt-8">
          <Alert className=" border-gray-200">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-orange-500" />
              <AlertTitle className="text-xl font-bold text-gray-800">
                ¿Cómo leer la tabla?
              </AlertTitle>
            </div>
            <AlertDescription className="mt-4 space-y-4 text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg flex items-center mb-1">
                    <span className="text-xl mr-2">📅</span> Mes
                  </h4>
                  <p>El número de cuota correspondiente al pago.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg flex items-center mb-1">
                    <span className="text-xl mr-2">💰</span> Pago Mensual
                  </h4>
                  <p>
                    El valor total de la cuota que se paga cada mes, que incluye
                    capital e intereses.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg flex items-center mb-1">
                    <span className="text-xl mr-2">🏛️</span> Capital
                  </h4>
                  <p>
                    La porción del pago que reduce el monto original del
                    préstamo. Este valor aumenta con el tiempo.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg flex items-center mb-1">
                    <span className="text-xl mr-2">📉</span> Intereses
                  </h4>
                  <p>
                    El costo del préstamo. Se calcula sobre el saldo pendiente y
                    disminuye a medida que se paga la deuda.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-lg flex items-center mb-1">
                    <span className="text-xl mr-2">⚖️</span> Saldo
                  </h4>
                  <p>
                    El monto de deuda pendiente después de realizar cada pago.
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
