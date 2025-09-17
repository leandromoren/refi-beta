"use client";

import React, { useEffect, useState } from "react";
import { Info, ChevronDown, ChevronUp, Loader2, BarChart2, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Header from "./header";
import Breadcrumb from "./ui/breadcrumb";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  iva: number;
  total: number;
  balance: number;
}

interface SimulationData {
  loanAmount: number;
  loanTerm: number;
  monthlyPaymentUVA: number;
  monthlyPaymentARS: number;
  loanInUVA: number;
  amortizationTable: AmortizationRow[];
  tna: number;
  cftea: number;
}

export default function SimuladorPrestamosPage() {
  const tna = 0.24;
  const cftea = 0.3153;
  const maxLoanAmount = 10000000;
  
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTerm, setLoanTerm] = useState(24);
  const [showDetails, setShowDetails] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [uvaValue, setUvaValue] = useState<number | null>(null);
  const [isEditingUva, setIsEditingUva] = useState(false);

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("ARS", "$");
  };

  const formatPercentage = (rate: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate);
  };

  const handleSimulate = () => {
    if (uvaValue === null || loanAmount <= 0) {
      alert("Por favor, ingresa un monto válido o espera a que se cargue el valor del UVA.");
      return;
    }

    setLoading(true);
    setSimulationData(null);

    setTimeout(() => {
      const loanInUVA = loanAmount / uvaValue;
      const monthlyRate = tna / 12;

      const monthlyPaymentUVA =
        (loanInUVA * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm));

      const amortizationTable: AmortizationRow[] = [];
      let currentBalance = loanInUVA;

      for (let i = 1; i <= loanTerm; i++) {
        const interestUVA = currentBalance * monthlyRate;
        const principalUVA = monthlyPaymentUVA - interestUVA;
        const ivaUVA = interestUVA * 0.21;
        const totalUVA = principalUVA + interestUVA + ivaUVA;

        amortizationTable.push({
          month: i,
          payment: (principalUVA + interestUVA) * uvaValue,
          principal: principalUVA * uvaValue,
          interest: interestUVA * uvaValue,
          iva: ivaUVA * uvaValue,
          total: totalUVA * uvaValue,
          balance: (currentBalance - principalUVA) * uvaValue,
        });

        currentBalance -= principalUVA;
      }

      setSimulationData({
        loanAmount: loanAmount,
        loanTerm: loanTerm,
        monthlyPaymentUVA: monthlyPaymentUVA,
        monthlyPaymentARS: monthlyPaymentUVA * uvaValue,
        loanInUVA: loanInUVA,
        amortizationTable: amortizationTable,
        tna: tna,
        cftea: cftea,
      });
      setLoading(false);
    }, 1500);
  };

  const handleCancel = () => {
    setSimulationData(null);
    setShowDetails(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto space-y-8 p-8">
        <Breadcrumb pathname="Personal en UVAs" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Parámetros del Préstamo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="loan-amount">Monto</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                    placeholder="Monto del préstamo"
                  />
                  <p className="text-sm text-gray-500">
                    Podés pedir hasta {formatCurrency(maxLoanAmount)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan-term">Plazo</Label>
                  <Select
                    value={loanTerm.toString()}
                    onValueChange={(value) => setLoanTerm(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar plazo" />
                    </SelectTrigger>
                    <SelectContent>
                      {[12, 18, 24].map((term) => (
                        <SelectItem key={term} value={term.toString()}>
                          {term} cuotas
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    El monto determina las opciones
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amortization-system">
                    Sistema de amortización
                  </Label>
                  <Input
                    id="amortization-system"
                    value="Francés"
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
              <Button
                className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 font-semibold"
                onClick={handleSimulate}
                disabled={loading || uvaValue === null}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Simulando...
                  </>
                ) : (
                  "Simular Préstamo"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg h-full">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Resultados de tu simulación
                  </CardTitle>
                </CardHeader>

                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <span className="font-semibold text-gray-900">
                    Valor UVA hoy:
                  </span>
                  {isEditingUva ? (
                    <div className="flex items-center">
                      <Input
                        type="number"
                        value={uvaValue ?? ""}
                        onChange={(e) => setUvaValue(parseFloat(e.target.value))}
                        className="w-32 h-8 text-center"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditingUva(false)}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">
                        {formatCurrency(uvaValue)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditingUva(true)}
                        className="h-6 w-6"
                      >
                        <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-900" />
                      </Button>
                      <a
                        href="https://ikiwi.net.ar/valor-uva/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline transition-colors text-xs"
                      >
                        (Verificar)
                      </a>
                    </div>
                  )}
                  <Info className="h-4 w-4 text-gray-500" />
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                    <p className="mt-4 text-base text-gray-600">
                      Calculando tu préstamo...
                    </p>
                  </div>
                ) : simulationData ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">
                          Valor del préstamo en UVAs
                        </p>
                        <p className="font-bold text-2xl text-purple-600">
                          {simulationData.loanInUVA.toFixed(2)} UVAs
                        </p>
                      </div>
                      <div className="space-y-1 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">
                          Cuota mensual promedio
                        </p>
                        <p className="font-bold text-2xl text-green-600">
                          {formatCurrency(simulationData.monthlyPaymentARS)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-700">
                      <div className="flex justify-between items-center p-2 rounded-md border border-gray-200">
                        <span>TNA</span>
                        <span className="font-semibold">
                          {formatPercentage(simulationData.tna)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md border border-gray-200">
                        <span>CFTEA + IVA</span>
                        <span className="font-semibold">
                          {formatPercentage(simulationData.cftea)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                    <BarChart2 className="h-12 w-12 mb-4" />
                    <h4 className="text-lg font-semibold">
                      Resultados de tu simulación
                    </h4>
                    <p className="text-sm text-center mt-1">
                      Los datos de tu préstamo aparecerán aquí.
                    </p>
                  </div>
                )}
              </div>

              {simulationData && (
                <div className="pt-6 border-t mt-6">
                  <Button
                    variant="outline"
                    className="w-full text-base font-semibold border-gray-300 hover:bg-gray-100"
                    onClick={handleCancel}
                  >
                    Nueva Simulación
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {simulationData && (
          <Card className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="flex justify-between items-center text-2xl font-bold text-gray-800">
                Cuadro de Amortización
                <Button
                  variant="ghost"
                  onClick={() => setShowDetails(!showDetails)}
                  className="cursor-pointer text-gray-500 hover:text-gray-900"
                >
                  {showDetails ? (
                    <>
                      Ocultar detalles
                      <ChevronUp className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Mostrar detalles
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 overflow-x-auto">
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-700">
                  ¿Qué incluye el cálculo?
                </AlertTitle>
                <AlertDescription className="text-blue-600">
                  La **Cuota promedio** se calcula con el sistema de
                  amortización **Francés**, que mantiene el valor de la cuota
                  constante. El **CFTEA + IVA** (Costo Financiero Total Efectivo
                  Anual) incluye la tasa nominal anual (**TNA**) más todos los
                  costos adicionales como el **IVA sobre intereses**.
                </AlertDescription>
              </Alert>
              {showDetails && (
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Cuota
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Capital
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Intereses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        IVA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Saldo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {simulationData.amortizationTable.map((row) => (
                      <tr key={row.month} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(row.principal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(row.interest)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(row.iva)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(row.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}