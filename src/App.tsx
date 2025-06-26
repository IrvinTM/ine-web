import { useState } from 'react'
import {
  lineaRecta,
  saldoDecreciente,
  sumaDigitos,
  unidadProduccion,
  seleccionOptima
} from './logica'

function App() {
  const [alternativa1, setAlternativa1] = useState<any>({
    costoInicial: null,
    valorResidual: null,
    vidaUtil: null,
    unidadesAnuales: []
  })
  const [alternativa2, setAlternativa2] = useState<any>({
    costoInicial: null,
    valorResidual: null,
    vidaUtil: null,
    unidadesAnuales: []
  })
  const [resultadoComparacion, setResultadoComparacion] = useState<string | null>(null)
  const [resultadosTabla, setResultadosTabla] = useState<any>(null)

  const calcularComparacion = () => {
    const calcularResultados = (alternativa: any) => {
      const { costoInicial, valorResidual, vidaUtil, unidadesAnuales } = alternativa
      if (
        costoInicial === null ||
        valorResidual === null ||
        vidaUtil === null ||
        unidadesAnuales.length === 0
      ) {
        return null
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

      return {
        metodos,
        metodoOptimo,
        valoresOptimos
      }
    }

    const resultados1 = calcularResultados(alternativa1)
    const resultados2 = calcularResultados(alternativa2)

    if (!resultados1 || !resultados2) {
      alert('Por favor, complete todos los campos para ambas alternativas.')
      return
    }

    // Comparación basada en criterios
    const ingresoNeto1 = resultados1.valoresOptimos.reduce((a, b) => a + b, 0)
    const ingresoNeto2 = resultados2.valoresOptimos.reduce((a, b) => a + b, 0)

    setResultadosTabla({ alternativa1: resultados1, alternativa2: resultados2 })

    if (ingresoNeto1 > ingresoNeto2) {
      setResultadoComparacion('Alternativa 1 es mejor.')
    } else if (ingresoNeto1 < ingresoNeto2) {
      setResultadoComparacion('Alternativa 2 es mejor.')
    } else {
      setResultadoComparacion('Ambas alternativas son equivalentes.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comparador de Alternativas</h1>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Alternativa 1</h2>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Costo Inicial:
          <input
            type="number"
            value={alternativa1.costoInicial || ''}
            onChange={(e) =>
              setAlternativa1({ ...alternativa1, costoInicial: parseFloat(e.target.value) })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Valor Residual:
          <input
            type="number"
            value={alternativa1.valorResidual || ''}
            onChange={(e) =>
              setAlternativa1({ ...alternativa1, valorResidual: parseFloat(e.target.value) })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Vida Útil (años):
          <input
            type="number"
            value={alternativa1.vidaUtil || ''}
            onChange={(e) =>
              setAlternativa1({ ...alternativa1, vidaUtil: parseInt(e.target.value, 10) })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Unidades Anuales de Producción (separadas por comas):
          <input
            type="text"
            value={alternativa1.unidadesAnuales.join(',')}
            onChange={(e) =>
              setAlternativa1({
                ...alternativa1,
                unidadesAnuales: e.target.value.split(',').map(Number)
              })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Alternativa 2</h2>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Costo Inicial:
          <input
            type="number"
            value={alternativa2.costoInicial || ''}
            onChange={(e) =>
              setAlternativa2({ ...alternativa2, costoInicial: parseFloat(e.target.value) })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Valor Residual:
          <input
            type="number"
            value={alternativa2.valorResidual || ''}
            onChange={(e) =>
              setAlternativa2({ ...alternativa2, valorResidual: parseFloat(e.target.value) })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Vida Útil (años):
          <input
            type="number"
            value={alternativa2.vidaUtil || ''}
            onChange={(e) =>
              setAlternativa2({ ...alternativa2, vidaUtil: parseInt(e.target.value, 10) })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Unidades Anuales de Producción (separadas por comas):
          <input
            type="text"
            value={alternativa2.unidadesAnuales.join(',')}
            onChange={(e) =>
              setAlternativa2({
                ...alternativa2,
                unidadesAnuales: e.target.value.split(',').map(Number)
              })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <button
        onClick={calcularComparacion}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Comparar Alternativas
      </button>

      {resultadoComparacion && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Resultado de la Comparación:</h2>
          <p>{resultadoComparacion}</p>
        </div>
      )}

      {resultadosTabla && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Resultados Detallados:</h2>
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Alternativa</th>
                <th className="border border-gray-400 px-4 py-2">Método</th>
                <th className="border border-gray-400 px-4 py-2">Valores</th>
              </tr>
            </thead>
            <tbody>
              {['alternativa1', 'alternativa2'].map((altKey) =>
                Object.entries(resultadosTabla[altKey].metodos).map(([metodo, valores]) => (
                  <tr key={`${altKey}-${metodo}`}>
                    <td className="border border-gray-400 px-4 py-2">{altKey}</td>
                    <td className="border border-gray-400 px-4 py-2">{metodo}</td>
                    <td className="border border-gray-400 px-4 py-2">{valores.join(', ')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App
