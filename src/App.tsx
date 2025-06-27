import { useState } from 'react';
import * as XLSX from 'xlsx';

function calcularTIR(flujos: number[]): number | null {
  const maxIteraciones = 1000;
  const tolerancia = 0.00001;
  let tir = 0.1; // Valor inicial
  let iteracion = 0;

  while (iteracion < maxIteraciones) {
    let npv = flujos.reduce((acc, flujo, i) => acc + flujo / Math.pow(1 + tir, i), 0);
    let derivadaNpv = flujos.reduce(
      (acc, flujo, i) => acc - (i * flujo) / Math.pow(1 + tir, i + 1),
      0
    );

    const nuevoTir = tir - npv / derivadaNpv;
    if (Math.abs(nuevoTir - tir) < tolerancia) {
      return nuevoTir;
    }

    tir = nuevoTir;
    iteracion++;
  }

  return null; // Si no converge
}

function App() {
  const [inversionInicial1, setInversionInicial1] = useState<number>(0);
  const [flujosAnuales1, setFlujosAnuales1] = useState<number[]>([]);
  const [inversionInicial2, setInversionInicial2] = useState<number>(0);
  const [flujosAnuales2, setFlujosAnuales2] = useState<number[]>([]);
  const [resultadoComparacion, setResultadoComparacion] = useState<string | null>(null);
  const [resultadosTIR, setResultadosTIR] = useState<{ alternativa1: number | null; alternativa2: number | null } | null>(null);

  const agregarFlujo1 = () => setFlujosAnuales1([...flujosAnuales1, 0]);
  const actualizarFlujo1 = (index: number, valor: number) => {
    const nuevosFlujos = [...flujosAnuales1];
    nuevosFlujos[index] = valor;
    setFlujosAnuales1(nuevosFlujos);
  };

  const agregarFlujo2 = () => setFlujosAnuales2([...flujosAnuales2, 0]);
  const actualizarFlujo2 = (index: number, valor: number) => {
    const nuevosFlujos = [...flujosAnuales2];
    nuevosFlujos[index] = valor;
    setFlujosAnuales2(nuevosFlujos);
  };

  const calcularComparacion = () => {
    const alternativa1 = [-inversionInicial1, ...flujosAnuales1];
    const alternativa2 = [-inversionInicial2, ...flujosAnuales2];

    const tir1 = calcularTIR(alternativa1);
    const tir2 = calcularTIR(alternativa2);

    if (tir1 === null || tir2 === null) {
      alert('No se pudo calcular el TIR para una o ambas alternativas. Verifique los valores.');
      return;
    }

    setResultadosTIR({ alternativa1: tir1, alternativa2: tir2 });

    if (tir1 > tir2) {
      setResultadoComparacion('Alternativa 1 es mejor.');
    } else if (tir1 < tir2) {
      setResultadoComparacion('Alternativa 2 es mejor.');
    } else {
      setResultadoComparacion('Ambas alternativas son equivalentes.');
    }
  };

  const descargarDatos = () => {
    const datos: (string | number)[][] = [];

    datos.push(["Año", "Alternativa 1", "Alternativa 2"]);
    datos.push([0, -inversionInicial1, -inversionInicial2]);

    const maxYears = Math.max(flujosAnuales1.length, flujosAnuales2.length);
    for (let i = 0; i < maxYears; i++) {
      const flujo1 = flujosAnuales1[i] || 0;
      const flujo2 = flujosAnuales2[i] || 0;
      datos.push([i + 1, flujo1, flujo2]);
    }

    datos.push([]);

    if (resultadosTIR) {
      datos.push([
        "TIR",
        resultadosTIR.alternativa1 !== null ? (resultadosTIR.alternativa1 * 100).toFixed(2) + '%' : 'N/A',
        resultadosTIR.alternativa2 !== null ? (resultadosTIR.alternativa2 * 100).toFixed(2) + '%' : 'N/A'
      ]);
    }

    const ws = XLSX.utils.aoa_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comparación");

    XLSX.writeFile(wb, "comparacion_alternativas.xlsx");
  };


  return (
    <div className="container mx-auto p-6 max-w-4xl bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Comparador de Alternativas de Inversión</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Alternativa 1 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Alternativa 1</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Inversión Inicial:</label>
            <input
              type="number"
              value={inversionInicial1}
              onChange={(e) => setInversionInicial1(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese la inversión inicial"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2 text-gray-700">Flujos Anuales:</h3>
            {flujosAnuales1.map((flujo, index) => (
              <div key={index} className="flex items-center mb-2">
                <label className="w-16 text-sm text-gray-600">{`Año ${index + 1}:`}</label>
                <input
                  type="number"
                  value={flujo}
                  onChange={(e) => actualizarFlujo1(index, Number(e.target.value))}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`Flujo año ${index + 1}`}
                />
              </div>
            ))}
            <button
              onClick={agregarFlujo1}
              className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-200"
            >
              + Agregar Año
            </button>
          </div>
        </div>

        {/* Alternativa 2 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Alternativa 2</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Inversión Inicial:</label>
            <input
              type="number"
              value={inversionInicial2}
              onChange={(e) => setInversionInicial2(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese la inversión inicial"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2 text-gray-700">Flujos Anuales:</h3>
            {flujosAnuales2.map((flujo, index) => (
              <div key={index} className="flex items-center mb-2">
                <label className="w-16 text-sm text-gray-600">{`Año ${index + 1}:`}</label>
                <input
                  type="number"
                  value={flujo}
                  onChange={(e) => actualizarFlujo2(index, Number(e.target.value))}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`Flujo año ${index + 1}`}
                />
              </div>
            ))}
            <button
              onClick={agregarFlujo2}
              className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-200"
            >
              + Agregar Año
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={calcularComparacion}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-200"
        >
          Comparar Alternativas
        </button>
        <button
          onClick={descargarDatos}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-200"
        >
          Descargar Datos (CSV)
        </button>
      </div>

      {(resultadoComparacion || resultadosTIR) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Resultados</h2>
          
          {resultadoComparacion && (
            <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Comparación:</h3>
              <p className="text-blue-700">{resultadoComparacion}</p>
            </div>
          )}

          {resultadosTIR && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-md border border-green-100">
                <h3 className="text-lg font-medium text-green-800 mb-2">TIR Alternativa 1:</h3>
                <p className="text-2xl font-bold text-green-700">
                  {resultadosTIR.alternativa1 ? (resultadosTIR.alternativa1 * 100).toFixed(2) + '%' : 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-md border border-green-100">
                <h3 className="text-lg font-medium text-green-800 mb-2">TIR Alternativa 2:</h3>
                <p className="text-2xl font-bold text-green-700">
                  {resultadosTIR.alternativa2 ? (resultadosTIR.alternativa2 * 100).toFixed(2) + '%' : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;