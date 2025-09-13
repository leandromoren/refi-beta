import { CheckCircle, DollarSign, Info, TrendingDown } from "lucide-react";
import React from "react";

export default function ExplainRefinanciacion() {
  return (
    <>
      <section className="space-y-8 px-6 py-12">
        <h1 className="text-center text-xl font-semibold">
          ¿Cómo funciona el refinanciamiento de deuda?
        </h1>
        <div className="bg-green-50 dark:bg-green-950 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white dark:bg-black border-2 border-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Menor Costo
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Tasa más baja = menos intereses. Con impuestos argentinos, la
                diferencia es enorme.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white dark:bg-black border-2 border-green-600 rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Cuotas Menores
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Menor tasa = cuota más baja. Libera dinero para otros gastos o
                inversiones.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white dark:bg-black border-2 border-green-600 rounded-full flex items-center justify-center mx-auto">
                <TrendingDown className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Ahorro Extra
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Invertí la diferencia mensual y generá rendimientos adicionales.
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
                  <p className="font-semibold text-black dark:text-white">
                    Préstamo Personal
                  </p>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      $100K • 5 años
                    </p>
                    <p className="text-red-600">25% → $176K total</p>
                    <p className="text-green-600">10% → $127K total</p>
                    <p className="font-semibold text-green-600">Ahorro: $49K</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-black dark:text-white">
                    Préstamo Hipotecario
                  </p>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      $5M • 20 años
                    </p>
                    <p className="text-red-600">18% → $19M total</p>
                    <p className="text-green-600">8% → $12M total</p>
                    <p className="font-semibold text-green-600">Ahorro: $7M</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-black dark:text-white">
                    Préstamo Prendario
                  </p>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      $2M • 7 años
                    </p>
                    <p className="text-red-600">22% → $4.2M total</p>
                    <p className="text-green-600">12% → $3.1M total</p>
                    <p className="font-semibold text-green-600">
                      Ahorro: $1.1M
                    </p>
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
                    <h4 className="font-semibold text-red-600 text-lg">
                      ❌ Deuda Actual (20% TNA)
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Capital prestado:
                        </span>
                        <span className="font-medium">$500.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Plazo:
                        </span>
                        <span className="font-medium">10 años</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Cuota mensual:
                        </span>
                        <span className="font-medium text-red-600">$9.650</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total intereses:
                        </span>
                        <span className="font-medium text-red-600">
                          $658.000
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Impuestos argentinos:
                        </span>
                        <span className="font-medium text-red-600">
                          $168.280
                        </span>
                      </div>
                      <hr className="border-gray-300 dark:border-gray-600" />
                      <div className="flex justify-between font-bold">
                        <span>TOTAL A PAGAR:</span>
                        <span className="text-red-600">$1.326.280</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-600 text-lg">
                      ✅ Nueva Deuda (12% TNA)
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Capital prestado:
                        </span>
                        <span className="font-medium">$500.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Plazo:
                        </span>
                        <span className="font-medium">10 años</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Cuota mensual:
                        </span>
                        <span className="font-medium text-green-600">
                          $7.170
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total intereses:
                        </span>
                        <span className="font-medium text-green-600">
                          $360.400
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Impuestos argentinos:
                        </span>
                        <span className="font-medium text-green-600">
                          $92.184
                        </span>
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
                  <h4 className="font-bold text-green-600 text-lg mb-3">
                    💰 Tu ahorro total
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        $373.696
                      </div>
                      <div className="text-green-600 font-medium">
                        Ahorro total
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        28% menos costo
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        $2.480
                      </div>
                      <div className="text-green-600 font-medium">
                        Ahorro mensual
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Cada mes por 10 años
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        $297.600
                      </div>
                      <div className="text-green-600 font-medium">
                        Solo en intereses
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Sin contar impuestos
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4 border border-yellow-300 dark:border-yellow-700">
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                    🎯 ¿Qué podés hacer con $2.480 extra cada mes?
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
                💡 Regla simple: Si la nueva tasa es 5+ puntos menor,
                refinanciar casi siempre conviene
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white dark:bg-black rounded-xl p-6 border-l-4 border-red-600 border dark:border-gray-700 max-w-4xl mx-auto">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-2">
              Importante: Costo Financiero Total (CFT) en Argentina
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              En Argentina, el costo real de un préstamo incluye múltiples
              impuestos que pueden representar entre
              <strong> 40% y 57% del costo total</strong>. Esta calculadora
              incluye: IVA (21%), Impuesto al Cheque (0.6%), Ingresos Brutos,
              Sellos (1%) y tasas municipales para mostrar el CFT real.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
