import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Info, TrendingDown } from "lucide-react"

interface SavingsBreakdownProps {
  calculations: {
    principal: number
    totalSavings: number
    monthlySavings: number
    interestSavings: number
    currentTotalInterest: number
    newTotalInterest: number
    monthsTotal: number
  }
  formatCurrency: (value: number) => string
}

export function SavingsBreakdown({ calculations, formatCurrency }: SavingsBreakdownProps) {
  const savingsPercentage = (calculations.interestSavings / calculations.currentTotalInterest) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          ¿Por qué te conviene refinanciar?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              Beneficios del refinanciamiento
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>
                  Reduces tu pago mensual en <strong>{formatCurrency(calculations.monthlySavings)}</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>
                  Ahorras <strong>{formatCurrency(calculations.interestSavings)}</strong> en intereses
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Mejoras tu flujo de efectivo mensual</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Reduces el costo total de tu deuda en {savingsPercentage.toFixed(1)}%</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Reducción de intereses</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Intereses actuales:</span>
                <span className="text-red-600">{formatCurrency(calculations.currentTotalInterest)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Nuevos intereses:</span>
                <span className="text-green-600">{formatCurrency(calculations.newTotalInterest)}</span>
              </div>
              <Progress value={savingsPercentage} className="h-2" />
              <div className="text-center text-sm text-muted-foreground">
                Reduces tus intereses en {savingsPercentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Consejo financiero</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Con el dinero que ahorras mensualmente ({formatCurrency(calculations.monthlySavings)}), podrías crear un
            fondo de emergencia o invertir para hacer crecer tu patrimonio. En {calculations.monthsTotal / 12} años,
            habrás ahorrado {formatCurrency(calculations.totalSavings)}
            que puedes destinar a otros objetivos financieros.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
