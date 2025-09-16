"use client";

import React, { useState } from "react";
import {
  Info,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
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
  const uvaValue = 1578.79;
  const tna = 0.24;
  const cftea = 0.3153;
  const maxLoanAmount = 1999995;

  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTerm, setLoanTerm] = useState(24);
  const [firstPaymentDate, setFirstPaymentDate] = useState("2025-09-24");
  const [showDetails, setShowDetails] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
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
    setLoanAmount(500000);
    setLoanTerm(24);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto space-y-8 p-8">
        <Breadcrumb pathname="Personal en UVAs" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Parámetros del Préstamo
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-evenly h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="loan-amount">Monto</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) =>
                      setLoanAmount(parseFloat(e.target.value))
                    }
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
                    onValueChange={(value) =>
                      setLoanTerm(parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar plazo" />
                    </SelectTrigger>
                    <SelectContent>
                      {[12, 24, 36, 48, 60, 72, 84, 96, 108, 120].map(
                        (term) => (
                          <SelectItem key={term} value={term.toString()}>
                            {term} cuotas
                          </SelectItem>
                        )
                      )}
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
                <div className="space-y-2">
                  <Label htmlFor="first-payment-date">
                    Fecha de la primera cuota
                  </Label>
                  <Input
                    id="first-payment-date"
                    type="date"
                    value={firstPaymentDate}
                    onChange={(e) => setFirstPaymentDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button
                  className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600"
                  onClick={handleSimulate}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Simulando...
                    </>
                  ) : (
                    "Simular"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card: Simulación (el sidebar) */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-xl text-gray-900">
                  Simulación
                </CardTitle>
              </CardHeader>

              <p className="text-sm text-gray-500">
                *Los valores pueden variar según la UVA del día.
                <br />
                **Valor UVA hoy:**{" "}
                <span className="font-semibold text-gray-900">
                  {formatCurrency(uvaValue)}
                </span>
              </p>

              {loading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
                  <p className="mt-4 text-sm text-gray-600">
                    Calculando tu préstamo...
                  </p>
                </div>
              ) : simulationData ? (
                <>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Valor del préstamo en UVAs:
                    </p>
                    <p className="font-semibold text-xl">
                      {simulationData.loanInUVA.toFixed(2)} UVAs
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-gray-600">Cuota en UVAs</p>
                      <p className="font-semibold text-xl">
                        {simulationData.monthlyPaymentUVA.toFixed(2)} UVAs
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600">Cuota promedio*</p>
                      <p className="font-semibold text-xl">
                        {formatCurrency(simulationData.monthlyPaymentARS)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-4">
                    <div className="space-y-1">
                      <p className="text-gray-600">TNA</p>
                      <p className="font-medium text-gray-900">
                        {formatPercentage(simulationData.tna)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600">CFTEA + IVA</p>
                      <p className="font-medium text-gray-900">
                        {formatPercentage(simulationData.cftea)}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <Info className="mr-2 h-4 w-4" />
                  Los resultados de tu simulación aparecerán aquí.
                </div>
              )}
            </CardContent>
            <div className="flex justify-between p-6 pt-0">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>

        {/* Card: Cuadro de Amortización (debajo de los dos elementos de arriba) */}
        {simulationData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Cuadro de Amortización
                <Button variant="ghost" onClick={() => setShowDetails(!showDetails)}>
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
            <CardContent className="overflow-x-auto">
              <Alert className="mb-4">
                <AlertTitle>
                  ¿Qué incluye el cálculo?
                </AlertTitle>
                <AlertDescription>
                  La **Cuota promedio** se calcula con el sistema de amortización **Francés**, que mantiene el valor de la cuota constante.
                  El **CFTEA + IVA** (Costo Financiero Total Efectivo Anual) incluye la tasa nominal anual (**TNA**) más todos los costos adicionales como el **IVA sobre intereses** y el **sellado**.
                </AlertDescription>
              </Alert>
              {showDetails && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuota
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capital
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Intereses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IVA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saldo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {simulationData.amortizationTable.map((row) => (
                      <tr key={row.month}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(row.principal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(row.interest)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(row.iva)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(row.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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