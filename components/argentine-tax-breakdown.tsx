import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, AlertTriangle } from "lucide-react"

interface ArgentineTaxBreakdownProps {
  calculations: {
    currentTNA: number
    newTNA: number
    currentCFT: number
    newCFT: number
    currentTaxes: {
      iva: number
      impuestoCheque: number
      iibb: number
      sellos: number
      municipal: number
      total: number
    }
    newTaxes: {
      iva: number
      impuestoCheque: number
      iibb: number
      sellos: number
      municipal: number
      total: number
    }
    principal: number
  }
  formatCurrency: (value: number) => string
}

export function ArgentineTaxBreakdown({ calculations, formatCurrency }: ArgentineTaxBreakdownProps) {
  const taxSavings = calculations.currentTaxes.total - calculations.newTaxes.total
  const taxImpactCurrent = ((calculations.currentCFT - calculations.currentTNA) / calculations.currentCFT) * 100
  const taxImpactNew = ((calculations.newCFT - calculations.newTNA) / calculations.newCFT) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Desglose de Impuestos Argentinos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deuda actual */}
          <div>
            <h3 className="font-semibold mb-3 text-red-700 dark:text-red-400">
              Deuda Actual (TNA {calculations.currentTNA.toFixed(1)}% → CFT {calculations.currentCFT.toFixed(1)}%)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>IVA sobre intereses (21%)</span>
                <span className="font-medium">{formatCurrency(calculations.currentTaxes.iva)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuesto al Cheque (0.6%)</span>
                <span className="font-medium">{formatCurrency(calculations.currentTaxes.impuestoCheque)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ingresos Brutos (provincial)</span>
                <span className="font-medium">{formatCurrency(calculations.currentTaxes.iibb)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuesto de Sellos (1%)</span>
                <span className="font-medium">{formatCurrency(calculations.currentTaxes.sellos)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tasas Municipales (~2%)</span>
                <span className="font-medium">{formatCurrency(calculations.currentTaxes.municipal)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-red-600 dark:text-red-400">
                <span>Total Impuestos</span>
                <span>{formatCurrency(calculations.currentTaxes.total)}</span>
              </div>
            </div>
          </div>

          {/* Nueva deuda */}
          <div>
            <h3 className="font-semibold mb-3 text-green-700 dark:text-green-400">
              Nueva Deuda (TNA {calculations.newTNA.toFixed(1)}% → CFT {calculations.newCFT.toFixed(1)}%)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>IVA sobre intereses (21%)</span>
                <span className="font-medium">{formatCurrency(calculations.newTaxes.iva)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuesto al Cheque (0.6%)</span>
                <span className="font-medium">{formatCurrency(calculations.newTaxes.impuestoCheque)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ingresos Brutos (provincial)</span>
                <span className="font-medium">{formatCurrency(calculations.newTaxes.iibb)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuesto de Sellos (1%)</span>
                <span className="font-medium">{formatCurrency(calculations.newTaxes.sellos)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tasas Municipales (~2%)</span>
                <span className="font-medium">{formatCurrency(calculations.newTaxes.municipal)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-green-600 dark:text-green-400">
                <span>Total Impuestos</span>
                <span>{formatCurrency(calculations.newTaxes.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen del impacto */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Impacto de los Impuestos en Argentina
              </h4>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <p>
                  • Los impuestos representan <strong>{taxImpactCurrent.toFixed(1)}%</strong> del costo de tu deuda
                  actual
                </p>
                <p>
                  • Con la nueva tasa, los impuestos serían <strong>{taxImpactNew.toFixed(1)}%</strong> del costo total
                </p>
                <p>
                  • <strong>Ahorro solo en impuestos: {formatCurrency(taxSavings)}</strong>
                </p>
                <p>
                  • El refinanciamiento te permite ahorrar tanto en intereses como en la base imponible de los impuestos
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
