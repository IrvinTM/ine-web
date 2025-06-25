export function lineaRecta(costoInicial: number, valorResidual: number, vidaUtil: number): number[] {
    const depreciacionAnual = (costoInicial - valorResidual) / vidaUtil;
    const depreciacionAnualRedondeada = parseFloat(depreciacionAnual.toFixed(2));
    return Array(Math.trunc(vidaUtil)).fill(depreciacionAnualRedondeada);
}

 export function saldoDecreciente(costoInicial: number, valorResidual: number, vidaUtil: number): number[] {

    const tasaDepreciacion = 2.0 / vidaUtil;
    const depreciaciones: number[] = [];
    let valorContable = costoInicial;

    for (let año = 0; año < Math.trunc(vidaUtil); año++) {
        let depreciacion = parseFloat((valorContable * tasaDepreciacion).toFixed(2));
        if (valorContable - depreciacion < valorResidual) {
            depreciacion = parseFloat((valorContable - valorResidual).toFixed(2));
        }
        depreciaciones.push(depreciacion);
        valorContable -= depreciacion;
        if (valorContable <= valorResidual + 0.01) {
            break;
        }
    }

    const añosRestantes = Math.trunc(vidaUtil) - depreciaciones.length;
    if (añosRestantes > 0) {
        depreciaciones.push(...Array(añosRestantes).fill(0.00));
    }

    return depreciaciones;
}

 export function sumaDigitos(costoInicial: number, valorResidual: number, vidaUtil: number): number[] {
    const sumaDigitos = vidaUtil * (vidaUtil + 1) / 2;
    const baseDepreciable = costoInicial - valorResidual;
    const depreciaciones: number[] = [];

    for (let año = 1; año <= Math.trunc(vidaUtil); año++) {
        const fraccion = (vidaUtil - año + 1) / sumaDigitos;
        const depreciacion = parseFloat((fraccion * baseDepreciable).toFixed(2));
        depreciaciones.push(depreciacion);
    }

    return depreciaciones;
}

 export function unidadProduccion(costoInicial: number, valorResidual: number, unidadesAnuales: number[], unidadesTotales: number): number[] {
    if (unidadesTotales <= 0) {
        return unidadesAnuales.map(() => 0.00);
    }

    const tasaPorUnidad = (costoInicial - valorResidual) / unidadesTotales;
    const depreciaciones: number[] = [];

    for (const unidades of unidadesAnuales) {
        const depreciacion = parseFloat((unidades * tasaPorUnidad).toFixed(2));
        depreciaciones.push(depreciacion);
    }

    return depreciaciones;
}

 export function seleccionOptima(metodos: { [key: string]: number[] }, criterio: string): [string, number[]] {
    if (Object.keys(metodos).length === 0) {
        return ["No aplicable", []];
    }

    const estrategias: { [key: string]: (data: { [key: string]: number[] }) => [string, number[]] } = {
        'max_depreciacion_inicial': (data) => Object.entries(data).reduce(
            (max, [key, value]) => {
                const currentMax = max[1][0] === undefined ? -Infinity : max[1][0];
                return (value && value.length > 0 && value[0] > currentMax) ? [key, value] : max;
            },
            ["No aplicable", []]
        ),
        'min_varianza': (data) => Object.entries(data).reduce(
            (min, [key, value]) => {
                if (value && value.length > 1) {
                    const currentVariance = calculateVariance(value);
                    return currentVariance < calculateVariance(min[1]) ? [key, value] : min;
                }
                return min;
            },
            ["No aplicable", []]
        )
    };
    const selector = estrategias[criterio];
    return selector ? selector(metodos) : ["No aplicable", []];
}

 export function calculateVariance(arr: number[]): number {
    return arr.reduce((acc, val) => acc + Math.pow(val - (arr.reduce((sum, v) => sum + v, 0) / arr.length), 2), 0) / arr.length;
}