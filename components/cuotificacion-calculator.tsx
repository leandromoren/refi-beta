"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Calculator,
  Info,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "./header";
import Breadcrumb from "./ui/breadcrumb";

interface Purchase {
  id: string;
  name: string;
  description: string;
  amount: number;
  selected: boolean;
}

interface TaxBreakdown {
  subtotal: number;
  impuestoPais: number;
  percepcionRG4815: number;
  iva: number;
  total: number;
}

interface SimulationData {
  selectedPurchases: Purchase[];
  installments: number;
  taxBreakdown: TaxBreakdown;
  monthlyPayment: number;
}

export default function CuotificacionPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInstallments, setSelectedInstallments] = useState(3);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(
    null
  );

  const [newPurchase, setNewPurchase] = useState({
    name: "",
    description: "",
    amount: "",
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(purchases.length / itemsPerPage);
  const maxAmount = 300000;

  // NUEVA LÓGICA DE ORDENAMIENTO DENTRO DE ESTA FUNCIÓN
  const getCurrentPagePurchases = () => {
    // 1. Hacemos una copia del array de compras para no mutar el estado original
    const sortedPurchases = [...purchases];

    // 2. Aplicamos la lógica de ordenamiento según el valor de 'sortBy'
    if (sortBy === "monto") {
      sortedPurchases.sort((a, b) => b.amount - a.amount); // Ordena de mayor a menor
    } else if (sortBy === "nombre") {
      sortedPurchases.sort((a, b) => a.name.localeCompare(b.name)); // Ordena alfabéticamente
    } else {
      sortedPurchases.sort((a, b) => parseInt(b.id) - parseInt(a.id)); // Ordena por fecha (el ID es un timestamp)
    }

    // 3. Devolvemos la lista paginada y ordenada
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedPurchases.slice(startIndex, endIndex);
  };

  const handlePurchaseToggle = (purchaseId: string) => {
    if (showSimulation) return;

    setPurchases((prev) =>
      prev.map((purchase) =>
        purchase.id === purchaseId
          ? { ...purchase, selected: !purchase.selected }
          : purchase
      )
    );
  };

  const handleAddPurchase = () => {
    if (!newPurchase.name || !newPurchase.amount) return;

    const purchase: Purchase = {
      id: Date.now().toString(),
      name: newPurchase.name,
      description: newPurchase.description,
      amount: parseFloat(newPurchase.amount),
      selected: false,
    };

    setPurchases((prev) => [...prev, purchase]);
    setNewPurchase({
      name: "",
      description: "",
      amount: "",
    });
    setShowAddForm(false);
  };

  const handleDeletePurchase = (purchaseId: string) => {
    setPurchases((prev) =>
      prev.filter((purchase) => purchase.id !== purchaseId)
    );

    const newTotalPages = Math.ceil((purchases.length - 1) / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }

    if (showSimulation) {
      const deletedPurchase = purchases.find((p) => p.id === purchaseId);
      if (deletedPurchase?.selected) {
        setShowSimulation(false);
        setSimulationData(null);
      }
    }
  };

  const selectedTotal = purchases
    .filter((purchase) => purchase.selected)
    .reduce((total, purchase) => total + purchase.amount, 0);

  const calculateTaxes = (amount: number): TaxBreakdown => {
    const subtotal = amount;
    const impuestoPais = amount * 0.3;
    const percepcionRG4815 = amount * 0.45;
    const taxableBase = impuestoPais + percepcionRG4815;
    const iva = taxableBase * 0.21;
    const total = subtotal + impuestoPais + percepcionRG4815 + iva;

    return {
      subtotal,
      impuestoPais,
      percepcionRG4815,
      iva,
      total,
    };
  };

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

  const getInstallmentOptions = () => {
    if (selectedTotal <= 150000) {
      return [1, 2, 3];
    } else {
      return [1, 2, 3, 4, 5, 6];
    }
  };

  const handleContinue = () => {
    if (selectedTotal > 0) {
      const currentSelectedPurchases = purchases.filter((p) => p.selected);
      const currentTaxBreakdown = calculateTaxes(selectedTotal);
      const currentMonthlyPayment =
        currentTaxBreakdown.total / selectedInstallments;

      setSimulationData({
        selectedPurchases: currentSelectedPurchases,
        installments: selectedInstallments,
        taxBreakdown: currentTaxBreakdown,
        monthlyPayment: currentMonthlyPayment,
      });
      setShowSimulation(true);
    }
  };

  const handleCancel = () => {
    setShowSimulation(false);
    setSimulationData(null);
    setPurchases((prev) =>
      prev.map((purchase) => ({ ...purchase, selected: false }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Breadcrumb pathname="cuotificación" />
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Elegí qué vas a pasar a cuotas
              </h1>
              <div className="mb-6">
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  Cuotificá hasta {formatCurrency(maxAmount)}
                </p>
                <p className="text-sm text-gray-600">
                  Tenés hasta 3 cuotas si elegís hasta $150.000 y hasta 6 si es
                  más.
                </p>
              </div>

              <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> Las cuotas incluyen Impuesto PAÍS
                  (30%), Percepción RG 4815 (45%) e IVA sobre impuestos (21%).
                </AlertDescription>
              </Alert>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monto">Ordenar por monto</SelectItem>
                    <SelectItem value="nombre">Ordenar por nombre</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar Compra
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nueva Compra</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre de la compra</Label>
                        <Input
                          id="name"
                          value={newPurchase.name}
                          onChange={(e) =>
                            setNewPurchase((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Ej: COMPRA GALICIA 24"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Input
                          id="description"
                          value={newPurchase.description}
                          onChange={(e) =>
                            setNewPurchase((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Ej: SUPERMERCADO CENTRAL"
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Monto</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newPurchase.amount}
                          onChange={(e) =>
                            setNewPurchase((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleAddPurchase}
                          className="flex-1 cursor-pointer"
                        >
                          Agregar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddForm(false)}
                          className="flex-1 cursor-pointer"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Purchases List */}
            <div className="space-y-4 mb-8">
              {getCurrentPagePurchases().map((purchase) => (
                <Card
                  key={purchase.id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    showSimulation
                      ? "cursor-not-allowed opacity-75"
                      : "cursor-pointer"
                  } ${
                    purchase.selected
                      ? "ring-2 ring-gray-400 bg-gray-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    !showSimulation && handlePurchaseToggle(purchase.id)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {purchase.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {purchase.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg text-red-700">
                            <span className="text-gray-950">Gastado:</span> {formatCurrency(purchase.amount)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePurchase(purchase.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Simulation Details - Only show when user clicks Continue */}
            {showSimulation && simulationData && (
              <Card className="mb-8 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-orange-800 flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Simulación de Cuotificación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Purchase Summary */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Resumen de Compras Seleccionadas
                      </h3>
                      <div className="space-y-2">
                        {simulationData.selectedPurchases.map((purchase) => (
                          <div
                            key={purchase.id}
                            className="flex justify-between items-center py-2 px-3 bg-white rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {purchase.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {purchase.description}
                              </p>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(purchase.amount)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between items-center font-semibold text-lg">
                          <span>Subtotal:</span>
                          <span>
                            {formatCurrency(
                              simulationData.taxBreakdown.subtotal
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tax Breakdown */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Detalle de Impuestos
                      </h3>
                      <div className="bg-white p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            Subtotal de compras:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(
                              simulationData.taxBreakdown.subtotal
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            Impuesto PAÍS (30%):
                          </span>
                          <span className="font-medium text-red-600">
                            +
                            {formatCurrency(
                              simulationData.taxBreakdown.impuestoPais
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            Percepción RG 4815 (45%):
                          </span>
                          <span className="font-medium text-red-600">
                            +
                            {formatCurrency(
                              simulationData.taxBreakdown.percepcionRG4815
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            IVA sobre impuestos (21%):
                          </span>
                          <span className="font-medium text-red-600">
                            +{formatCurrency(simulationData.taxBreakdown.iva)}
                          </span>
                        </div>
                        <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                          <span>Total con impuestos:</span>
                          <span className="text-orange-600">
                            {formatCurrency(simulationData.taxBreakdown.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Installment Plan */}
                  <div className="p-6 rounded-lg">
                    <h3 className="font-semibold mb-4 text-start">
                      Plan de Cuotas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div className="bg-white border-gray-200 p-4 rounded-lg shadow-sm">
                        <p className="text-3xl  text-orange-600 mb-1">
                          {simulationData.installments}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cuota{simulationData.installments > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-3xl  text-orange-600 mb-1">
                          {formatCurrency(simulationData.monthlyPayment)}
                        </p>
                        <p className="text-sm text-gray-600">Por mes</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-3xl text-orange-600 mb-1">
                          {formatCurrency(simulationData.taxBreakdown.total)}
                        </p>
                        <p className="text-sm text-gray-600">Total final</p>
                      </div>
                    </div>

                    {/* Monthly breakdown */}
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-800 mb-3">
                        Cronograma de Pagos
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {Array.from(
                          { length: simulationData.installments },
                          (_, index) => (
                            <div
                              key={index}
                              className="bg-white p-3 rounded text-center"
                            >
                              <p className="text-sm text-gray-600">
                                Cuota {index + 1}
                              </p>
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(simulationData.monthlyPayment)}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, purchases.length)} de{" "}
                {purchases.length} resultados
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === 1}
                  className="cursor-pointer"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {currentPage} de {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === totalPages}
                  className="cursor-pointer"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Estás cuotificando
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(selectedTotal)}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="mb-4">
                      <Label
                        htmlFor="installments"
                        className="text-sm font-medium"
                      >
                        Cantidad de cuotas
                      </Label>
                      <Select
                        value={selectedInstallments.toString()}
                        onValueChange={(value) =>
                          setSelectedInstallments(parseInt(value))
                        }
                        disabled={showSimulation}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getInstallmentOptions().map((option) => (
                            <SelectItem key={option} value={option.toString()}>
                              {option} cuota{option > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {simulationData && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Impuesto PAÍS (30%)</span>
                        <span>
                          {formatCurrency(
                            simulationData.taxBreakdown.impuestoPais
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Percepción RG 4815 (45%)</span>
                        <span>
                          {formatCurrency(
                            simulationData.taxBreakdown.percepcionRG4815
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>IVA sobre impuestos (21%)</span>
                        <span>
                          {formatCurrency(simulationData.taxBreakdown.iva)}
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total con impuestos</span>
                        <span>
                          {formatCurrency(simulationData.taxBreakdown.total)}
                        </span>
                      </div>
                    </div>
                  )}

                  {!simulationData && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Impuesto PAÍS (30%)</span>
                        <span className="text-gray-500">
                          {formatCurrency(
                            calculateTaxes(selectedTotal).impuestoPais
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Percepción RG 4815 (45%)</span>
                        <span className="text-gray-500">
                          {formatCurrency(
                            calculateTaxes(selectedTotal).percepcionRG4815
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>IVA sobre impuestos (21%)</span>
                        <span className="text-gray-500">
                          {formatCurrency(calculateTaxes(selectedTotal).iva)}
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total con impuestos</span>
                        <span className="text-orange-600">
                          {formatCurrency(calculateTaxes(selectedTotal).total)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Cuota mensual</span>
                    <span className="text-orange-600">
                      {simulationData
                        ? formatCurrency(simulationData.monthlyPayment)
                        : formatCurrency(
                            calculateTaxes(selectedTotal).total /
                              selectedInstallments
                          )}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                    disabled={selectedTotal === 0}
                    onClick={handleContinue}
                  >
                    Simular
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
