import { useState } from 'react'
import {
  lineaRecta,
  saldoDecreciente,
  sumaDigitos,
  unidadProduccion,
  seleccionOptima
} from './logica'

function App() {
  const [costoInicial, setCostoInicial] = useState<number | null>(null)
  const [valorResidual, setValorResidual] = useState<number | null>(null)
  const [vidaUtil, setVidaUtil] = useState<number | null>(null)
  const [unidadesAnuales, setUnidadesAnuales] = useState<number[]>([])
  const [resultados, setResultados] = useState<any>(null)

  const calcularDepreciacion = () => {
    if (
      costoInicial === null ||
      valorResidual === null ||
      vidaUtil === null ||
      unidadesAnuales.length === 0
    ) {
      alert('Por favor, complete todos los campos.')
      return
    }

    const unidadesTotales = unidadesAnuales.reduce((a, b) => a + b, 0)

    const metodos = {
      'Línea Recta': lineaRecta(costoInicial, valorResidual, vidaUtil),
      'Saldo Decreciente': saldoDecreciente(costoInicial, valorResidual, vidaUtil),
      'Suma Dígitos': sumaDigitos(costoInicial, valorResidual, vidaUtil),
      'Unidad Producción': unidadProduccion(
        costoInicial,
        valorResidual,
        unidadesAnuales,
        unidadesTotales
      )
    }

    const [metodoOptimo, valoresOptimos] = seleccionOptima(metodos, 'max_depreciacion_inicial') // Criterio fijo

    setResultados({
      metodos,
      metodoOptimo,
      valoresOptimos
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calculadora de Depreciación</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Costo Inicial:
          <input
            type="number"
            value={costoInicial || ''}
            onChange={(e) => setCostoInicial(parseFloat(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Valor Residual:
          <input
            type="number"
            value={valorResidual || ''}
            onChange={(e) => setValorResidual(parseFloat(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Vida Útil (años):
          <input
            type="number"
            value={vidaUtil || ''}
            onChange={(e) => setVidaUtil(parseInt(e.target.value, 10))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Unidades Anuales de Producción (separadas por comas):
          <input
            type="text"
            value={unidadesAnuales.join(',')}
            onChange={(e) =>
              setUnidadesAnuales(e.target.value.split(',').map(Number))
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <button
        onClick={calcularDepreciacion}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Calcular Depreciación
      </button>

      {resultados && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Resultados:</h2>
          <pre>{JSON.stringify(resultados, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App
