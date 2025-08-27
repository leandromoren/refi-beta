"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator, TrendingDown, Info, CheckCircle, DollarSign, Coffee, HelpCircle } from "lucide-react"
import { DebtComparison } from "./debt-comparison"
import { PaymentSchedule } from "./payment-schedule"
import { SavingsBreakdown } from "./savings-breakdown"
import { ArgentineTaxBreakdown } from "./argentine-tax-breakdown"

export function DebtCalculator() {
  const [amount, setAmount] = useState<string>("100000")
  const [currentRate, setCurrentRate] = useState<string>("25")
  const [newRate, setNewRate] = useState<string>("10")
  const [years, setYears] = useState<string>("5")
  const [province, setProvince] = useState<string>("6") // Default 6% IIBB
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)

  const [selectedTaxes, setSelectedTaxes] = useState({
    iva: true,
    impuestoCheque: true,
    iibb: true,
    sellos: true,
    municipal: true,
  })

  const calculations = useMemo(() => {
    const principal = Number.parseFloat(amount) || 0
    const currentTNA = Number.parseFloat(currentRate) / 100 || 0
    const newTNA = Number.parseFloat(newRate) / 100 || 0
    const termYears = Number.parseFloat(years) || 1
    const monthsTotal = termYears * 12
    const iibbRate = Number.parseFloat(province) / 100 || 0.06

    if (principal <= 0 || currentTNA < 0 || newTNA < 0 || termYears <= 0) {
      return {
        principal: 0,
        currentMonthlyPayment: 0,
        newMonthlyPayment: 0,
        currentTotalPayment: 0,
        newTotalPayment: 0,
        currentTotalInterest: 0,
        newTotalInterest: 0,
        totalSavings: 0,
        monthlySavings: 0,
        interestSavings: 0,
        monthsTotal: 0,
        currentTNA: 0,
        newTNA: 0,
        currentCFT: 0,
        newCFT: 0,
        currentTaxes: {
          iva: 0,
          impuestoCheque: 0,
          iibb: 0,
          sellos: 0,
          municipal: 0,
          total: 0,
        },
        newTaxes: {
          iva: 0,
          impuestoCheque: 0,
          iibb: 0,
          sellos: 0,
          municipal: 0,
          total: 0,
        },
        isValid: false,
      }
    }

    const calculateArgentineTaxes = (interestAmount: number, principal: number) => {
      const iva = selectedTaxes.iva ? interestAmount * 0.21 : 0
      const impuestoCheque = selectedTaxes.impuestoCheque ? principal * 0.006 : 0
      const iibb = selectedTaxes.iibb ? interestAmount * iibbRate : 0
      const sellos = selectedTaxes.sellos ? principal * 0.01 : 0
      const municipal = selectedTaxes.municipal ? principal * 0.02 : 0

      return {
        iva,
        impuestoCheque,
        iibb,
        sellos,
        municipal,
        total: iva + impuestoCheque + iibb + sellos + municipal,
      }
    }

    const calculateMonthlyPayment = (principal: number, annualRate: number, months: number) => {
      try {
        if (annualRate === 0) return principal / months
        const monthlyRate = annualRate / 12
        return (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1)
      } catch (error) {
        console.error("Error calculating monthly payment:", error)
        return 0
      }
    }

    const currentMonthlyPayment = calculateMonthlyPayment(principal, currentTNA, monthsTotal)
    const newMonthlyPayment = calculateMonthlyPayment(principal, newTNA, monthsTotal)

    const currentTotalPayment = currentMonthlyPayment * monthsTotal
    const newTotalPayment = newMonthlyPayment * monthsTotal

    const currentTotalInterest = currentTotalPayment - principal
    const newTotalInterest = newTotalPayment - principal

    const currentTaxes = calculateArgentineTaxes(currentTotalInterest, principal)
    const newTaxes = calculateArgentineTaxes(newTotalInterest, principal)

    const currentCFTTotal = currentTotalPayment + currentTaxes.total
    const newCFTTotal = newTotalPayment + newTaxes.total

    const currentCFT = ((currentCFTTotal / principal) ** (1 / termYears) - 1) * 100
    const newCFT = ((newCFTTotal / principal) ** (1 / termYears) - 1) * 100

    const totalSavings = currentCFTTotal - newCFTTotal
    const monthlySavings = (currentCFTTotal - newCFTTotal) / monthsTotal
    const interestSavings = currentTotalInterest - newTotalInterest

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
    }
  }, [amount, currentRate, newRate, years, province, selectedTaxes])

  const handleCalculate = async () => {
    setIsLoading(true)
    setShowResults(false)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setShowResults(true)
  }

  const formatCurrency = (value: number) => {
    if (!isFinite(value) || isNaN(value)) {
      return "$0"
    }
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const isFormValid =
    amount &&
    currentRate &&
    newRate &&
    years &&
    Number.parseFloat(amount) > 0 &&
    Number.parseFloat(currentRate) >= 0 &&
    Number.parseFloat(newRate) >= 0 &&
    Number.parseFloat(years) > 0

  const practicalExamples = [
    {
      name: "Préstamo Personal en pesos",
      amount: "100000",
      currentRate: "25",
      newRate: "10",
      years: "5",
      description: "Ejemplo: $100K a 5 años",
    },
    {
      name: "Préstamo Hipotecario",
      amount: "5000000",
      currentRate: "18",
      newRate: "8",
      years: "20",
      description: "Ejemplo: $5M a 20 años",
    },
    {
      name: "Préstamo Prendario",
      amount: "2000000",
      currentRate: "22",
      newRate: "12",
      years: "7",
      description: "Ejemplo: $2M a 7 años",
    },
  ]

  const loadExample = (example: (typeof practicalExamples)[0]) => {
    setAmount(example.amount)
    setCurrentRate(example.currentRate)
    setNewRate(example.newRate)
    setYears(example.years)
    setShowResults(false)
  }

  const handleTaxChange = (taxType: keyof typeof selectedTaxes, checked: boolean) => {
    setSelectedTaxes((prev) => ({
      ...prev,
      [taxType]: checked,
    }))
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black dark:text-white font-[family-name:var(--font-poppins)]">
              REFI
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFAQ(!showFAQ)}
              className="flex cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <HelpCircle className="h-4 w-4" />
              FAQ
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:border-orange-700 dark:text-orange-300"
              onClick={() => window.open("https://cafecito.app/leanmoren", "_blank")}
            >
              <Coffee className="h-4 w-4" />
              Invitame un cafecito
            </Button>
          </div>
        </div>
      </header>

      {showFAQ && (
        <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Preguntas Frecuentes</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-black dark:text-white">¿Qué es el refinanciamiento?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Es tomar un nuevo préstamo con mejores condiciones (menor tasa) para cancelar una deuda existente más
                  cara.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-black dark:text-white">¿Qué es el CFT?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  El Costo Financiero Total incluye la tasa de interés más todos los impuestos argentinos: IVA, Impuesto
                  al Cheque, IIBB, Sellos y tasas municipales.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-black dark:text-white">¿Siempre conviene refinanciar?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Conviene cuando la nueva tasa es significativamente menor y el ahorro supera los costos de
                  refinanciamiento (gastos administrativos, seguros, etc.).
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-black dark:text-white">¿Qué gastos tiene refinanciar?</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Pueden incluir gastos administrativos, seguros, tasaciones y comisiones. Estos costos varían según la
                  entidad financiera.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="space-y-16">
        <section className="space-y-8 px-6 py-12">
          <div className="bg-green-50 dark:bg-green-950 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white dark:bg-black border-2 border-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white">Menor Costo</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Tasa más baja = menos intereses. Con impuestos argentinos, la diferencia es enorme.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white dark:bg-black border-2 border-green-600 rounded-full flex items-center justify-center mx-auto">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white">Cuotas Menores</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Menor tasa = cuota más baja. Libera dinero para otros gastos o inversiones.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white dark:bg-black border-2 border-green-600 rounded-full flex items-center justify-center mx-auto">
                  <TrendingDown className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white">Ahorro Extra</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Invierte la diferencia mensual y genera rendimientos adicionales.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="bg-white dark:bg-black rounded-xl p-6 border-2 border-green-300 dark:border-green-700">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-6 flex items-center gap-2">
                  📊 Ejemplos reales de ahorro
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <p className="font-semibold text-black dark:text-white">Préstamo Personal</p>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600 dark:text-gray-400">$100K • 5 años</p>
                      <p className="text-red-600">25% → $176K total</p>
                      <p className="text-green-600">10% → $127K total</p>
                      <p className="font-semibold text-green-600">Ahorro: $49K</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="font-semibold text-black dark:text-white">Préstamo Hipotecario</p>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600 dark:text-gray-400">$5M • 20 años</p>
                      <p className="text-red-600">18% → $19M total</p>
                      <p className="text-green-600">8% → $12M total</p>
                      <p className="font-semibold text-green-600">Ahorro: $7M</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="font-semibold text-black dark:text-white">Préstamo Prendario</p>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600 dark:text-gray-400">$2M • 7 años</p>
                      <p className="text-red-600">22% → $4.2M total</p>
                      <p className="text-green-600">12% → $3.1M total</p>
                      <p className="font-semibold text-green-600">Ahorro: $1.1M</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-6 border-2 border-blue-300 dark:border-blue-700">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-6 flex items-center gap-2">
                  🔍 Ejemplo paso a paso: Préstamo de $500K
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-red-600 text-lg">❌ Deuda Actual (20% TNA)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Capital prestado:</span>
                          <span className="font-medium">$500.000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Plazo:</span>
                          <span className="font-medium">10 años</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Cuota mensual:</span>
                          <span className="font-medium text-red-600">$9.650</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total intereses:</span>
                          <span className="font-medium text-red-600">$658.000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Impuestos argentinos:</span>
                          <span className="font-medium text-red-600">$168.280</span>
                        </div>
                        <hr className="border-gray-300 dark:border-gray-600" />
                        <div className="flex justify-between font-bold">
                          <span>TOTAL A PAGAR:</span>
                          <span className="text-red-600">$1.326.280</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-600 text-lg">✅ Nueva Deuda (12% TNA)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Capital prestado:</span>
                          <span className="font-medium">$500.000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Plazo:</span>
                          <span className="font-medium">10 años</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Cuota mensual:</span>
                          <span className="font-medium text-green-600">$7.170</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total intereses:</span>
                          <span className="font-medium text-green-600">$360.400</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Impuestos argentinos:</span>
                          <span className="font-medium text-green-600">$92.184</span>
                        </div>
                        <hr className="border-gray-300 dark:border-gray-600" />
                        <div className="flex justify-between font-bold">
                          <span>TOTAL A PAGAR:</span>
                          <span className="text-green-600">$952.584</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-black rounded-lg p-4 border-2 border-green-400 dark:border-green-600">
                    <h4 className="font-bold text-green-600 text-lg mb-3">💰 Tu ahorro total</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">$373.696</div>
                        <div className="text-green-600 font-medium">Ahorro total</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">28% menos costo</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">$2.480</div>
                        <div className="text-green-600 font-medium">Ahorro mensual</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Cada mes por 10 años</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">$297.600</div>
                        <div className="text-green-600 font-medium">Solo en intereses</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Sin contar impuestos</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4 border border-yellow-300 dark:border-yellow-700">
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                      🎯 ¿Qué puedes hacer con $2.480 extra cada mes?
                    </h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Invertir en plazo fijo: +$29.760 anuales</li>
                      <li>• Fondo común de inversión: potencial +15% anual</li>
                      <li>• Pagar otras deudas más caras</li>
                      <li>• Crear un fondo de emergencia</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 border-2 border-green-300 dark:border-green-700">
                <p className="text-green-700 dark:text-green-300 font-semibold text-center">
                  💡 Regla simple: Si la nueva tasa es 5+ puntos menor, refinanciar casi siempre conviene
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-white dark:bg-black rounded-xl p-6 border-l-4 border-red-600 border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-2">
                Importante: Costo Financiero Total (CFT) en Argentina
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                En Argentina, el costo real de un préstamo incluye múltiples impuestos que pueden representar entre
                <strong> 40% y 57% del costo total</strong>. Esta calculadora incluye: IVA (21%), Impuesto al Cheque
                (0.6%), Ingresos Brutos, Sellos (1%) y tasas municipales para mostrar el CFT real.
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-8 px-6">
          <div className="text-center space-y-2 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-black dark:text-white">Datos de tu deuda</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Ingresa los datos de tu deuda actual y la nueva tasa que puedes obtener
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monto de la deuda (ARS)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100,000"
                  min="0"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-rate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  TNA actual (%)
                </Label>
                <Input
                  id="current-rate"
                  type="number"
                  value={currentRate}
                  onChange={(e) => setCurrentRate(e.target.value)}
                  placeholder="25"
                  step="0.1"
                  min="0"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-rate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nueva TNA (%)
                </Label>
                <Input
                  id="new-rate"
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="10"
                  step="0.1"
                  min="0"
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="space-y-2">
                <Label htmlFor="years" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Plazo (años)
                </Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="5"
                  step="0.5"
                  min="0.5"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  IIBB Provincial (%)
                </Label>
                <Input
                  id="province"
                  type="number"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="6"
                  step="0.1"
                  min="3"
                  max="9"
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Selecciona los impuestos a incluir en el CFT
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="iva"
                    checked={selectedTaxes.iva}
                    onCheckedChange={(checked) => handleTaxChange("iva", checked as boolean)}
                  />
                  <Label htmlFor="iva" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    IVA (21% sobre intereses)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="impuesto-cheque"
                    checked={selectedTaxes.impuestoCheque}
                    onCheckedChange={(checked) => handleTaxChange("impuestoCheque", checked as boolean)}
                  />
                  <Label
                    htmlFor="impuesto-cheque"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Imp. al Cheque (0.6%)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="sellos"
                    checked={selectedTaxes.sellos}
                    onCheckedChange={(checked) => handleTaxChange("sellos", checked as boolean)}
                  />
                  <Label
                    htmlFor="sellos"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Imp. de Sellos (1%)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="municipal"
                    checked={selectedTaxes.municipal}
                    onCheckedChange={(checked) => handleTaxChange("municipal", checked as boolean)}
                  />
                  <Label
                    htmlFor="municipal"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Tasas Municipales (~2%)
                  </Label>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                Selecciona solo los impuestos que aplican a tu situación específica para obtener un CFT más preciso.
              </p>
            </div>

            <div className="text-center pt-4 max-w-4xl mx-auto">
              <Button
                onClick={handleCalculate}
                className="h-12 px-8 text-base font-semibold bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                disabled={!isFormValid || isLoading}
              >
                <Calculator className="h-5 w-5 mr-2" />
                {isLoading ? "Calculando..." : "Simular préstamo"}
              </Button>
            </div>
          </div>
        </section>

        {isLoading && (
          <section className="px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-black rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
                <div className="space-y-6">
                  <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-black dark:text-white">Calculando tu refinanciamiento</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Analizando tasas, impuestos argentinos y calculando tu ahorro total...
                    </p>
                  </div>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {showResults && calculations.isValid && (
          <div className="space-y-16 px-6">
            <section className="space-y-8">
              <div className="text-center space-y-2 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-green-600">Tu ahorro total</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Comparación del costo total: {formatCurrency(calculations.currentTotalPayment)} vs{" "}
                  {formatCurrency(calculations.newTotalPayment)}
                </p>
              </div>

              <div className="bg-white dark:bg-black rounded-xl p-6 border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-xl font-bold text-green-600">{formatCurrency(calculations.totalSavings)}</div>
                    <div className="text-sm text-green-600 font-medium">Ahorro total</div>
                    <div className="text-xs text-green-600">
                      {((calculations.totalSavings / calculations.currentTotalPayment) * 100).toFixed(1)}% menos
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-xl font-bold text-black dark:text-white">
                      {formatCurrency(calculations.monthlySavings)}
                    </div>
                    <div className="text-sm text-black dark:text-white font-medium">Ahorro mensual</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Durante {calculations.monthsTotal} meses
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-xl font-bold text-red-600">
                      {calculations.currentCFT.toFixed(1)}% → {calculations.newCFT.toFixed(1)}%
                    </div>
                    <div className="text-sm text-red-600 font-medium">CFT actual → nuevo</div>
                    <div className="text-xs text-red-600">
                      -{(calculations.currentCFT - calculations.newCFT).toFixed(1)} puntos
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-xl font-bold text-gray-600">
                      {formatCurrency(calculations.currentTaxes.total - calculations.newTaxes.total)}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Ahorro en impuestos</div>
                    <div className="text-xs text-gray-600">Solo en impuestos argentinos</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-black rounded-xl p-6 border-l-4 border-gray-600 border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
                <h3 className="font-semibold text-black dark:text-white mb-4 text-lg">
                  💡 ¿Qué significa esto en la práctica?
                </h3>
                <div className="text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed">
                  <p>
                    <strong>Por cada peso prestado:</strong> Con la tasa actual pagas $
                    {(calculations.currentTotalPayment / calculations.principal).toFixed(2)}, con la nueva tasa pagarías
                    ${(calculations.newTotalPayment / calculations.principal).toFixed(2)}
                  </p>
                  <p>
                    <strong>Intereses totales:</strong> Pasarías de pagar{" "}
                    {formatCurrency(calculations.currentTotalInterest)} a{" "}
                    {formatCurrency(calculations.newTotalInterest)} en intereses puros
                  </p>
                  <p>
                    <strong>Tiempo de recuperación:</strong> El ahorro mensual de{" "}
                    {formatCurrency(calculations.monthlySavings)}
                    te permite recuperar gastos de refinanciamiento rápidamente
                  </p>
                </div>
              </div>
            </section>

            <div className="max-w-4xl mx-auto space-y-16">
              <ArgentineTaxBreakdown calculations={calculations} formatCurrency={formatCurrency} />
              <DebtComparison calculations={calculations} formatCurrency={formatCurrency} />
              <SavingsBreakdown calculations={calculations} formatCurrency={formatCurrency} />
              <PaymentSchedule calculations={calculations} formatCurrency={formatCurrency} />
            </div>
          </div>
        )}

        {showResults && !calculations.isValid && (
          <div className="text-center p-8 bg-white dark:bg-black rounded-xl border-l-4 border-red-600 border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
            <p className="font-semibold text-lg text-red-600">Datos incompletos o inválidos</p>
            <p className="mt-2 text-red-600">
              Por favor, verifica que todos los campos tengan valores válidos mayores a cero.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
