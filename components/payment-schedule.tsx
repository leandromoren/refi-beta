import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PaymentScheduleProps {
  calculations: {
    principal: number
    currentMonthlyPayment: number
    newMonthlyPayment: number
    currentTNA: number
    newTNA: number
    monthsTotal: number
    isValid: boolean
  }
  formatCurrency: (value: number) => string
}

export function PaymentSchedule({ calculations, formatCurrency }: PaymentScheduleProps) {
  // Generar cronograma de pagos para los primeros 12 meses
  const generateSchedule = (principal: number, monthlyRate: number, monthlyPayment: number, months: number) => {
    const schedule = []
    let remainingBalance = principal

    // Simplificando validaciones usando isValid del padre
    if (!calculations.isValid || principal <= 0 || monthlyPayment <= 0) {
      return []
    }

    for (let month = 1; month <= Math.min(months, 12); month++) {
      const interestPayment = remainingBalance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      remainingBalance = Math.max(0, remainingBalance - principalPayment)

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingBalance,
      })

      if (remainingBalance <= 0) break
    }

    return schedule
  }

  // Usando currentTNA y newTNA en lugar de currentRate y newRate
  const currentSchedule = generateSchedule(
    calculations.principal,
    calculations.currentTNA / 12,
    calculations.currentMonthlyPayment,
    calculations.monthsTotal,
  )

  const newSchedule = generateSchedule(
    calculations.principal,
    calculations.newTNA / 12,
    calculations.newMonthlyPayment,
    calculations.monthsTotal,
  )

  if (currentSchedule.length === 0 || newSchedule.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cronograma de pagos (primeros 12 meses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>No se puede generar el cronograma con los datos actuales.</p>
            <p className="text-sm mt-1">Verifica que todos los campos tengan valores válidos.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Cronograma de pagos (primeros 12 meses)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cronograma actual */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="destructive">Deuda actual ({(calculations.currentTNA * 100).toFixed(1)}%)</Badge>
            </div>
            <div className="space-y-2">
              <TooltipProvider>
                <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-muted-foreground border-b pb-2">
                  <span>Mes</span>
                  <div className="flex items-center gap-1">
                    <span>Pago</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cuota mensual total que pagas</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Interés</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Parte de tu pago que va a intereses</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Saldo</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Deuda restante después del pago</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </TooltipProvider>
              {currentSchedule.map((payment) => (
                <div key={payment.month} className="grid grid-cols-4 gap-2 text-xs">
                  <span>{payment.month}</span>
                  <span>{formatCurrency(payment.payment)}</span>
                  <span className="text-red-600">{formatCurrency(payment.interest)}</span>
                  <span>{formatCurrency(payment.balance)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nuevo cronograma */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default" className="bg-green-600">
                Nueva deuda ({(calculations.newTNA * 100).toFixed(1)}%)
              </Badge>
            </div>
            <div className="space-y-2">
              <TooltipProvider>
                <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-muted-foreground border-b pb-2">
                  <span>Mes</span>
                  <div className="flex items-center gap-1">
                    <span>Pago</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cuota mensual total que pagas</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Interés</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Parte de tu pago que va a intereses</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Saldo</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Deuda restante después del pago</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </TooltipProvider>
              {newSchedule.map((payment) => (
                <div key={payment.month} className="grid grid-cols-4 gap-2 text-xs">
                  <span>{payment.month}</span>
                  <span>{formatCurrency(payment.payment)}</span>
                  <span className="text-green-600">{formatCurrency(payment.interest)}</span>
                  <span>{formatCurrency(payment.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">
            <strong>¿Cómo leer el cronograma?</strong>
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <strong>Pago:</strong> Es tu cuota mensual total (capital + intereses)
            </li>
            <li>
              <strong>Interés:</strong> Parte de tu pago que se va en intereses (dinero "perdido")
            </li>
            <li>
              <strong>Saldo:</strong> Cuánto te queda por pagar después de cada cuota
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-3">
            <strong>Nota:</strong> Con la tasa más baja pagas menos intereses cada mes, lo que significa que más dinero
            va hacia el pago del capital principal y reduces tu deuda más rápido.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
