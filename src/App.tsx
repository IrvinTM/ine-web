import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('CAE');
  const [initialCost, setInitialCost] = useState('');
  const [annualCost, setAnnualCost] = useState(''); // Nuevo estado para el costo anual
  const [cashFlows, setCashFlows] = useState<string[]>(['']); // Array para los flujos de efectivo
  const [rate, setRate] = useState('');
  const [years, setYears] = useState(''); // Nuevo estado para el número de años
  const [result, setResult] = useState<number | null>(null);

  const calculateCAE = () => {
    const initial = parseFloat(initialCost);
    const annual = parseFloat(annualCost);
    const nYears = parseInt(years, 10);
    const interestRate = parseFloat(rate) / 100;

    if (!isNaN(initial) && !isNaN(annual) && !isNaN(nYears) && !isNaN(interestRate) && nYears > 0 && interestRate > 0) {
      // Paso 1: Calcular el Valor Presente de los Costos Anuales
      const valorPresenteCostosAnuales = annual * ((Math.pow(1 + interestRate, nYears) - 1) / (interestRate * Math.pow(1 + interestRate, nYears)));

      // Paso 2: Calcular el Valor Presente Neto (VPN)
      const vpn = initial + valorPresenteCostosAnuales;

      // Paso 3: Calcular el Costo Anual Equivalente (CAE)
      const cae = vpn * ((interestRate * Math.pow(1 + interestRate, nYears)) / (Math.pow(1 + interestRate, nYears) - 1));

      setResult(cae);
    } else {
      setResult(null);
      alert('Por favor, ingresa valores válidos.');
    }
  };

  const calculateVP = () => {
    const annual = parseFloat(cashFlows[0]);
    const nYears = cashFlows.length;
    const interestRate = parseFloat(rate) / 100;

    if (!isNaN(annual) && !isNaN(nYears) && !isNaN(interestRate) && interestRate > 0) {
      const vp = annual * ((1 - Math.pow(1 + interestRate, -nYears)) / interestRate);
      setResult(vp);
    } else {
      setResult(null);
      alert('Por favor, ingresa valores válidos.');
    }
  };

  const calculateTR = () => {
    const initial = parseFloat(initialCost);
    const annual = parseFloat(cashFlows[0]);
    const nYears = cashFlows.length;

    if (!isNaN(initial) && !isNaN(annual) && !isNaN(nYears) && nYears > 0) {
      const tr = Math.pow(annual / initial, 1 / nYears) - 1;
      setResult(tr * 100); // Convertimos a porcentaje
    } else {
      setResult(null);
      alert('Por favor, ingresa valores válidos.');
    }
  };

  const calculateVPN = () => {
    const interestRate = parseFloat(rate) / 100;
    const initial = parseFloat(initialCost);
    const parsedCashFlows = cashFlows.map((flow) => parseFloat(flow));

    if (!isNaN(initial) && !isNaN(interestRate) && interestRate > 0 && parsedCashFlows.every((flow) => !isNaN(flow))) {
      let vpn = -initial; // El costo inicial es negativo
      parsedCashFlows.forEach((flow, index) => {
        vpn += flow / Math.pow(1 + interestRate, index + 1); // Descuento de cada flujo
      });
      setResult(vpn);
    } else {
      setResult(null);
      alert('Por favor, ingresa valores válidos.');
    }
  };

  const calculateTIR = () => {
    const initial = parseFloat(initialCost);
    const parsedCashFlows = cashFlows.map((flow) => parseFloat(flow));

    if (!isNaN(initial) && parsedCashFlows.every((flow) => !isNaN(flow))) {
      let guessRate = 0.1; // Tasa inicial de aproximación (10%)
      let maxIterations = 100; // Número máximo de iteraciones
      let tolerance = 0.00001; // Tolerancia para el resultado
      let iteration = 0;

      while (iteration < maxIterations) {
        let vpn = -initial; // VPN inicial
        let derivative = 0; // Derivada del VPN respecto a la tasa

        parsedCashFlows.forEach((flow, index) => {
          vpn += flow / Math.pow(1 + guessRate, index + 1);
          derivative -= (index + 1) * flow / Math.pow(1 + guessRate, index + 2);
        });

        const newGuessRate = guessRate - vpn / derivative;

        if (Math.abs(newGuessRate - guessRate) < tolerance) {
          setResult(newGuessRate * 100); // Convertimos a porcentaje
          return;
        }

        guessRate = newGuessRate;
        iteration++;
      }

      alert('No se pudo calcular la TIR con precisión. Intenta ajustar los valores.');
      setResult(null);
    } else {
      setResult(null);
      alert('Por favor, ingresa valores válidos.');
    }
  };

  const handleCashFlowChange = (index: number, value: string) => {
    const updatedCashFlows = [...cashFlows];
    updatedCashFlows[index] = value;
    setCashFlows(updatedCashFlows);
  };

  const addCashFlow = () => {
    setCashFlows([...cashFlows, '']);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'CAE':
        return (
          <div className="w-full max-w-md">
            <label className="block mb-2">Inversión inicial:</label>
            <input
              type="number"
              value={initialCost}
              onChange={(e) => setInitialCost(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Costo anual:</label>
            <input
              type="number"
              value={annualCost}
              onChange={(e) => setAnnualCost(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Tasa de interés (%):</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Número de años:</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <button
              onClick={calculateCAE}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Calcular CAE
            </button>
            {result !== null && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Resultado:</h2>
                <p className="text-green-600">{result.toFixed(2)}</p>
              </div>
            )}
          </div>
        );
      case 'VP':
        return (
          <div className="w-full max-w-md">
            <label className="block mb-2">Costo anual:</label>
            <input
              type="number"
              value={cashFlows[0]}
              onChange={(e) => handleCashFlowChange(0, e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Número de años:</label>
            <input
              type="number"
              value={cashFlows.length}
              onChange={(e) => setCashFlows(cashFlows.slice(0, parseInt(e.target.value, 10)))}
              className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Tasa de interés (%):</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <button
              onClick={calculateVP}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Calcular Valor Presente
            </button>
            {result !== null && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Resultado:</h2>
                <p className="text-green-600">{result.toFixed(2)}</p>
              </div>
            )}
          </div>
        );
      case 'TR':
        return (
          <div className="w-full max-w-md">
            <label className="block mb-2">Costo inicial:</label>
            <input
              type="number"
              value={initialCost}
              onChange={(e) => setInitialCost(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Costo anual:</label>
            <input
              type="number"
              value={cashFlows[0]}
              onChange={(e) => handleCashFlowChange(0, e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Número de años:</label>
            <input
              type="number"
              value={cashFlows.length}
              onChange={(e) => setCashFlows(cashFlows.slice(0, parseInt(e.target.value, 10)))}
              className="border rounded w-full p-2 mb-4"
            />
            <button
              onClick={calculateTR}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Calcular Tasa de Rendimiento
            </button>
            {result !== null && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Resultado:</h2>
                <p className="text-green-600">{result.toFixed(2)}%</p>
              </div>
            )}
          </div>
        );
      case 'VPN':
        return (
          <div className="w-full max-w-md">
            <label className="block mb-2">Costo inicial:</label>
            <input
              type="number"
              value={initialCost}
              onChange={(e) => setInitialCost(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Tasa de interés (%):</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Flujos de efectivo:</label>
            {cashFlows.map((flow, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="number"
                  value={flow}
                  onChange={(e) => handleCashFlowChange(index, e.target.value)}
                  className="border rounded w-full p-2"
                />
              </div>
            ))}
            <button
              onClick={addCashFlow}
              className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
            >
              Agregar flujo de efectivo
            </button>
            <button
              onClick={calculateVPN}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Calcular VPN
            </button>
            {result !== null && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Resultado:</h2>
                <p className="text-green-600">{result.toFixed(2)}</p>
              </div>
            )}
          </div>
        );
      case 'TIR':
        return (
          <div className="w-full max-w-md">
            <label className="block mb-2">Costo inicial:</label>
            <input
              type="number"
              value={initialCost}
              onChange={(e) => setInitialCost(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label className="block mb-2">Flujos de efectivo:</label>
            {cashFlows.map((flow, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="number"
                  value={flow}
                  onChange={(e) => handleCashFlowChange(index, e.target.value)}
                  className="border rounded w-full p-2"
                />
              </div>
            ))}
            <button
              onClick={addCashFlow}
              className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
            >
              Agregar flujo de efectivo
            </button>
            <button
              onClick={calculateTIR}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Calcular TIR
            </button>
            {result !== null && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Resultado:</h2>
                <p className="text-green-600">{result.toFixed(2)}%</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center content-center text-center p-4">
        <h1 className="text-xl font-bold mb-4">Calculadora Financiera</h1>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('CAE')}
            className={`px-4 py-2 rounded ${activeTab === 'CAE' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            CAE
          </button>
                    <button
            onClick={() => setActiveTab('VPN')}
            className={`px-4 py-2 rounded ${activeTab === 'VPN' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            VPN
          </button>
          <button
            onClick={() => setActiveTab('TIR')}
            className={`px-4 py-2 rounded ${activeTab === 'TIR' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            TIR
          </button>
        </div>
        {renderTabContent()}
      </div>
    </>
  );
}

export default App;
