import { useState } from 'react'

function calcularTIR(flujos: number[]): number | null {
  const maxIteraciones = 1000
  const tolerancia = 0.00001
  let tir = 0.1 // Valor inicial
  let iteracion = 0

  while (iteracion < maxIteraciones) {
    let npv = flujos.reduce((acc, flujo, i) => acc + flujo / Math.pow(1 + tir, i), 0)
    let derivadaNpv = flujos.reduce(
      (acc, flujo, i) => acc - (i * flujo) / Math.pow(1 + tir, i + 1),
      0
    )

    const nuevoTir = tir - npv / derivadaNpv
    if (Math.abs(nuevoTir - tir) < tolerancia) {
      return nuevoTir
    }

    tir = nuevoTir
    iteracion++
  }

  return null // Si no converge
}

function App() {
  const [inversionInicial1, setInversionInicial1] = useState<number>(0)
  const [flujosAnuales1, setFlujosAnuales1] = useState<number[]>([])
  const [inversionInicial2, setInversionInicial2] = useState<number>(0)
  const [flujosAnuales2, setFlujosAnuales2] = useState<number[]>([])
  const [resultadoComparacion, setResultadoComparacion] = useState<string | null>(null)
  const [resultadosTIR, setResultadosTIR] = useState<{ alternativa1: number | null; alternativa2: number | null } | null>(null)

  const agregarFlujo1 = () => setFlujosAnuales1([...flujosAnuales1, 0])
  const actualizarFlujo1 = (index: number, valor: number) => {
    const nuevosFlujos = [...flujosAnuales1]
    nuevosFlujos[index] = valor
    setFlujosAnuales1(nuevosFlujos)
  }

  const agregarFlujo2 = () => setFlujosAnuales2([...flujosAnuales2, 0])
  const actualizarFlujo2 = (index: number, valor: number) => {
    const nuevosFlujos = [...flujosAnuales2]
    nuevosFlujos[index] = valor
    setFlujosAnuales2(nuevosFlujos)
  }

  const calcularComparacion = () => {
    const alternativa1 = [-inversionInicial1, ...flujosAnuales1]
    const alternativa2 = [-inversionInicial2, ...flujosAnuales2]

    const tir1 = calcularTIR(alternativa1)
    const tir2 = calcularTIR(alternativa2)

    if (tir1 === null || tir2 === null) {
      alert('No se pudo calcular el TIR para una o ambas alternativas. Verifique los valores.')
      return
    }

    setResultadosTIR({ alternativa1: tir1, alternativa2: tir2 })

    if (tir1 > tir2) {
      setResultadoComparacion('Alternativa 1 es mejor.')
    } else if (tir1 < tir2) {
      setResultadoComparacion('Alternativa 2 es mejor.')
    } else {
      setResultadoComparacion('Ambas alternativas son equivalentes.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comparador de Alternativas (TIR)</h1>
      
      {/* Alternativa 1 */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">Alternativa 1</h2>
        <div className="mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">Inversión Inicial:</label>
          <input
            type="number"
            value={inversionInicial1}
            onChange={(e) => setInversionInicial1(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ingrese la inversión inicial"
          />
        </div>
        {flujosAnuales1.map((flujo, index) => (
          <div key={index} className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">{`Año ${index + 1}:`}</label>
            <input
              type="number"
              value={flujo}
              onChange={(e) => actualizarFlujo1(index, Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={`Ingrese el flujo del año ${index + 1}`}
            />
          </div>
        ))}
        <button
          onClick={agregarFlujo1}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Agregar Año
        </button>
      </div>

      {/* Alternativa 2 */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">Alternativa 2</h2>
        <div className="mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">Inversión Inicial:</label>
          <input
            type="number"
            value={inversionInicial2}
            onChange={(e) => setInversionInicial2(Number(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ingrese la inversión inicial"
          />
        </div>
        {flujosAnuales2.map((flujo, index) => (
          <div key={index} className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">{`Año ${index + 1}:`}</label>
            <input
              type="number"
              value={flujo}
              onChange={(e) => actualizarFlujo2(index, Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={`Ingrese el flujo del año ${index + 1}`}
            />
          </div>
        ))}
        <button
          onClick={agregarFlujo2}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Agregar Año
        </button>
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

      {resultadosTIR && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Resultados TIR:</h2>
          <p>Alternativa 1: {resultadosTIR.alternativa1?.toFixed(4)}</p>
          <p>Alternativa 2: {resultadosTIR.alternativa2?.toFixed(4)}</p>
        </div>
      )}
    </div>
  )
}

export default App
