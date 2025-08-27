import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

interface DebtComparisonProps {
  calculations: {
    principal: number
    currentMonthlyPayment: number
    newMonthlyPayment: number
    currentTotalPayment: number
    newTotalPayment: number
    currentTotalInterest: number
    newTotalInterest: number
    currentTNA: number
    newTNA: number
    monthsTotal: number
  }
  formatCurrency: (value: number) => string
}

export function DebtComparison({ calculations, formatCurrency }: DebtComparisonProps) {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-black dark:text-white flex items-center justify-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Comparación detallada
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Análisis completo de ambas opciones de financiamiento
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deuda actual */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="destructive" className="text-xs bg-red-600 hover:bg-red-700">
                Deuda actual
              </Badge>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {isFinite(calculations.currentTNA) && !isNaN(calculations.currentTNA)
                  ? (calculations.currentTNA * 100).toFixed(1)
                  : "0.0"}
                % anual
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Pago mensual:</span>
                <span className="font-semibold text-sm text-black dark:text-white">
                  {formatCurrency(calculations.currentMonthlyPayment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Total a pagar:</span>
                <span className="font-semibold text-sm text-black dark:text-white">
                  {formatCurrency(calculations.currentTotalPayment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Total en intereses:</span>
                <span className="font-semibold text-sm text-red-600">
                  {formatCurrency(calculations.currentTotalInterest)}
                </span>
              </div>
            </div>
          </div>

          {/* Nueva deuda */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-green-600 hover:bg-green-700 text-xs text-white">Nueva deuda</Badge>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {isFinite(calculations.newTNA) && !isNaN(calculations.newTNA)
                  ? (calculations.newTNA * 100).toFixed(1)
                  : "0.0"}
                % anual
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Pago mensual:</span>
                <span className="font-semibold text-sm text-black dark:text-white">
                  {formatCurrency(calculations.newMonthlyPayment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Total a pagar:</span>
                <span className="font-semibold text-sm text-black dark:text-white">
                  {formatCurrency(calculations.newTotalPayment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Total en intereses:</span>
                <span className="font-semibold text-sm text-green-600">
                  {formatCurrency(calculations.newTotalInterest)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
