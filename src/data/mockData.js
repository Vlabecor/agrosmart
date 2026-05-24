// AgroSmart - Base de datos de fincas y cultivos colombianos
// 10 tipos de fincas con sus ambientes, climas y cultivos

export const systemsDefault = {
  riego: { label: 'Sistema de Riego', icon: '💧', active: false },
  abono: { label: 'Sistema de Abonos', icon: '🌿', active: false },
  sensores: { label: 'Sensores ESP32', icon: '📡', active: true },
  alertas: { label: 'Alertas Automáticas', icon: '🔔', active: true },
  proteccion: { label: 'Protección Hídrica', icon: '🛡️', active: true },
};

/**
 * Lógica de decisión de riego
 * Retorna { regar: boolean, razon: string, urgencia: 'critica' | 'alta' | 'normal' | 'no_regar' }
 */
export function calcularDecisionRiego(crop) {
  const { humedad, humedadOptima, temperaturaSuelo, clima } = crop;
  const deficit = humedadOptima - humedad;
  const lluviaPct = parseInt(clima.lluvia);
  const tempSuelo = temperaturaSuelo;

  // Si lluvia probable > 60% → no regar
  if (lluviaPct >= 60) {
    return {
      regar: false,
      razon: `Lluvia probable ${lluviaPct}% — el suelo recibirá agua natural.`,
      urgencia: 'no_regar',
      recomendacion: 'Postponer riego. Monitorear nivel de lluvia.'
    };
  }

  // Si suelo saturado → no regar
  if (humedad > humedadOptima * 1.15) {
    return {
      regar: false,
      razon: `Suelo saturado (${humedad}% vs óptimo ${humedadOptima}%). Riesgo de anegación.`,
      urgencia: 'no_regar',
      recomendacion: 'Pausar riego. Revisar drenaje del suelo.'
    };
  }

  // Si temperatura suelo muy alta (> 30°C) y déficit moderado → regar urgente
  if (tempSuelo > 30 && deficit > 5) {
    return {
      regar: true,
      razon: `Alta temperatura del suelo (${tempSuelo}°C) acelera evaporación. Déficit: ${deficit}%.`,
      urgencia: 'critica',
      recomendacion: `Activar riego inmediatamente. Aplicar ${Math.round(deficit * 12)} L/m².`
    };
  }

  // Si déficit crítico (> 15%)
  if (deficit > 15) {
    return {
      regar: true,
      razon: `Déficit hídrico crítico: ${deficit}% bajo el nivel óptimo.`,
      urgencia: 'critica',
      recomendacion: `Riego urgente. Aplicar ${Math.round(deficit * 10)} L/m².`
    };
  }

  // Si déficit moderado (5-15%)
  if (deficit >= 5) {
    return {
      regar: true,
      razon: `Déficit moderado: ${deficit}% bajo el nivel óptimo (${humedadOptima}%).`,
      urgencia: 'alta',
      recomendacion: `Programar riego en las próximas 2-4 horas. ~${Math.round(deficit * 8)} L/m².`
    };
  }

  // Condiciones óptimas
  return {
    regar: false,
    razon: `Humedad del suelo óptima (${humedad}% / objetivo ${humedadOptima}%).`,
    urgencia: 'normal',
    recomendacion: 'No se requiere riego. Continuar monitoreo.'
  };
}

export const cropsData = {
  tomate: {
    id: 'tomate',
    name: 'Tomate',
    emoji: '🍅',
    finca: 'Finca El Progreso',
    municipio: 'Villa de Leyva (Boyacá)',
    climaTipo: 'Templado - Seco',
    altitud: '2.140 msnm',
    humedadOptima: 45,
    humedad: 42,
    humedadEstado: 'Aceptable',
    temperaturaSuelo: 23.5,
    temperatura: 24,
    riegoHoy: '450 L',
    estadoCultivo: 'Bueno',
    estadoCultivoDetalle: 'Crecimiento de frutos',
    clima: { temp: 24, estado: 'Parcialmente nublado', humedad: 55, viento: '12 km/h', lluvia: '15%' },
    ultimoRiego: '22/05/2026 - 6:30 a.m.',
    proximoRiego: 'Sugerido en 2 horas',
    dispositivo: { nombre: 'ESP32-Tomate-Node1', bateria: 85, estado: 'Conectado', firmware: 'v2.1.4', senales: -72 },
    distribucionHumedad: { bajo: 25, medio: 60, alto: 15 },
    humedadEvolucion: [
      { fecha: '15/05', valor: 55 }, { fecha: '16/05', valor: 52 }, { fecha: '17/05', valor: 48 },
      { fecha: '18/05', valor: 44 }, { fecha: '19/05', valor: 42 }, { fecha: '20/05', valor: 46 },
      { fecha: '21/05', valor: 45 }, { fecha: '22/05', valor: 42 }
    ],
    riegosPorDia: [
      { fecha: '15/05', valor: 300 }, { fecha: '16/05', valor: 250 }, { fecha: '17/05', valor: 350 },
      { fecha: '18/05', valor: 400 }, { fecha: '19/05', valor: 300 }, { fecha: '20/05', valor: 450 },
      { fecha: '21/05', valor: 500 }, { fecha: '22/05', valor: 450 }
    ],
    alertas: [
      { id: 1, tipo: 'warning', titulo: 'Humedad baja en zona Norte', descripcion: 'Sensor Z3 registra 38% — 7% bajo el óptimo. Considerar riego focalizado.', hora: '08:15', leida: false },
      { id: 2, tipo: 'info', titulo: 'Riego automático completado', descripcion: 'Se aplicaron 450 L a las 6:30 a.m. correctamente.', hora: '06:35', leida: true }
    ],
    abono: { ultimoAbono: '15/05/2026', proximoAbono: '29/05/2026', tipoAbono: 'Nitrogenado NPK 10-10-10', cantidadAbono: '2.5 kg/100m²' }
  },

  cafe: {
    id: 'cafe',
    name: 'Café',
    emoji: '☕',
    finca: 'Hacienda La Palma',
    municipio: 'Chinchiná (Caldas)',
    climaTipo: 'Templado - Húmedo',
    altitud: '1.680 msnm',
    humedadOptima: 55,
    humedad: 58,
    humedadEstado: 'Óptimo',
    temperaturaSuelo: 19.2,
    temperatura: 18,
    riegoHoy: '0 L',
    estadoCultivo: 'Excelente',
    estadoCultivoDetalle: 'Floración activa',
    clima: { temp: 18, estado: 'Llovizna suave', humedad: 82, viento: '8 km/h', lluvia: '75%' },
    ultimoRiego: '20/05/2026 - 5:00 a.m.',
    proximoRiego: 'No requerido (lluvia activa)',
    dispositivo: { nombre: 'ESP32-Café-Ladera', bateria: 92, estado: 'Conectado', firmware: 'v2.1.4', senales: -65 },
    distribucionHumedad: { bajo: 5, medio: 85, alto: 10 },
    humedadEvolucion: [
      { fecha: '15/05', valor: 58 }, { fecha: '16/05', valor: 56 }, { fecha: '17/05', valor: 54 },
      { fecha: '18/05', valor: 57 }, { fecha: '19/05', valor: 60 }, { fecha: '20/05', valor: 58 },
      { fecha: '21/05', valor: 59 }, { fecha: '22/05', valor: 58 }
    ],
    riegosPorDia: [
      { fecha: '15/05', valor: 200 }, { fecha: '16/05', valor: 200 }, { fecha: '17/05', valor: 0 },
      { fecha: '18/05', valor: 300 }, { fecha: '19/05', valor: 0 }, { fecha: '20/05', valor: 150 },
      { fecha: '21/05', valor: 0 }, { fecha: '22/05', valor: 0 }
    ],
    alertas: [
      { id: 1, tipo: 'info', titulo: 'Lluvia detectada', descripcion: 'Sensor pluviométrico registra lluvia activa. Riego automático suspendido.', hora: '07:00', leida: false }
    ],
    abono: { ultimoAbono: '10/05/2026', proximoAbono: '10/06/2026', tipoAbono: 'Orgánico - Compost de pulpa', cantidadAbono: '3 kg/árbol' }
  },

  papa: {
    id: 'papa',
    name: 'Papa',
    emoji: '🥔',
    finca: 'Alturas del Cocuy',
    municipio: 'Güicán (Boyacá)',
    climaTipo: 'Frío - Seco',
    altitud: '3.200 msnm',
    humedadOptima: 35,
    humedad: 18,
    humedadEstado: 'Crítico',
    temperaturaSuelo: 12.1,
    temperatura: 11,
    riegoHoy: '1.200 L',
    estadoCultivo: 'Riesgo',
    estadoCultivoDetalle: 'Estrés hídrico severo',
    clima: { temp: 11, estado: 'Despejado / Frío', humedad: 40, viento: '16 km/h', lluvia: '5%' },
    ultimoRiego: '19/05/2026 - 4:00 p.m.',
    proximoRiego: '⚠️ URGENTE — Activar ahora',
    dispositivo: { nombre: 'ESP32-Papa-Norte', bateria: 62, estado: 'Conectado', firmware: 'v2.0.9', senales: -80 },
    distribucionHumedad: { bajo: 75, medio: 22, alto: 3 },
    humedadEvolucion: [
      { fecha: '15/05', valor: 40 }, { fecha: '16/05', valor: 36 }, { fecha: '17/05', valor: 33 },
      { fecha: '18/05', valor: 28 }, { fecha: '19/05', valor: 25 }, { fecha: '20/05', valor: 22 },
      { fecha: '21/05', valor: 20 }, { fecha: '22/05', valor: 18 }
    ],
    riegosPorDia: [
      { fecha: '15/05', valor: 800 }, { fecha: '16/05', valor: 0 }, { fecha: '17/05', valor: 600 },
      { fecha: '18/05', valor: 0 }, { fecha: '19/05', valor: 500 }, { fecha: '20/05', valor: 0 },
      { fecha: '21/05', valor: 0 }, { fecha: '22/05', valor: 1200 }
    ],
    alertas: [
      { id: 1, tipo: 'critica', titulo: '🚨 ESTRÉS HÍDRICO SEVERO', descripcion: 'Humedad del suelo al 18% (óptimo 35%). Las raíces están en riesgo inmediato. Active el riego YA.', hora: '09:00', leida: false },
      { id: 2, tipo: 'warning', titulo: 'Temperatura suelo baja', descripcion: 'Suelo a 12.1°C puede reducir absorción de agua. Monitorear.', hora: '08:30', leida: false },
      { id: 3, tipo: 'info', titulo: 'Batería dispositivo baja', descripcion: 'ESP32-Papa-Norte al 62%. Recargar pronto.', hora: '07:45', leida: true }
    ],
    abono: { ultimoAbono: '01/05/2026', proximoAbono: '01/06/2026', tipoAbono: 'Potásico - KCl 60%', cantidadAbono: '1.5 kg/100m²' }
  },

  aguacate: {
    id: 'aguacate',
    name: 'Aguacate',
    emoji: '🥑',
    finca: 'Finca Villa Lorena',
    municipio: 'Fresno (Tolima)',
    climaTipo: 'Cálido - Templado',
    altitud: '1.350 msnm',
    humedadOptima: 60,
    humedad: 72,
    humedadEstado: 'Saturado',
    temperaturaSuelo: 25.8,
    temperatura: 27,
    riegoHoy: '0 L',
    estadoCultivo: 'Advertencia',
    estadoCultivoDetalle: 'Riesgo de pudrición radicular',
    clima: { temp: 27, estado: 'Soleado', humedad: 68, viento: '10 km/h', lluvia: '0%' },
    ultimoRiego: '21/05/2026 - 10:00 a.m.',
    proximoRiego: 'Pausar 48 horas — exceso de agua',
    dispositivo: { nombre: 'ESP32-Aguacate-Sur', bateria: 79, estado: 'Conectado', firmware: 'v2.1.4', senales: -70 },
    distribucionHumedad: { bajo: 0, medio: 25, alto: 75 },
    humedadEvolucion: [
      { fecha: '15/05', valor: 58 }, { fecha: '16/05', valor: 61 }, { fecha: '17/05', valor: 64 },
      { fecha: '18/05', valor: 68 }, { fecha: '19/05', valor: 70 }, { fecha: '20/05', valor: 73 },
      { fecha: '21/05', valor: 72 }, { fecha: '22/05', valor: 72 }
    ],
    riegosPorDia: [
      { fecha: '15/05', valor: 1000 }, { fecha: '16/05', valor: 1100 }, { fecha: '17/05', valor: 1500 },
      { fecha: '18/05', valor: 1800 }, { fecha: '19/05', valor: 2000 }, { fecha: '20/05', valor: 2100 },
      { fecha: '21/05', valor: 0 }, { fecha: '22/05', valor: 0 }
    ],
    alertas: [
      { id: 1, tipo: 'warning', titulo: 'Suelo saturado', descripcion: 'Humedad al 72% (óptimo 60%). Riesgo de pudrición radicular. No regar.', hora: '10:05', leida: false }
    ],
    abono: { ultimoAbono: '05/05/2026', proximoAbono: '05/06/2026', tipoAbono: 'Fosfórico - DAP', cantidadAbono: '2 kg/árbol' }
  },

  arroz: {
    id: 'arroz',
    name: 'Arroz',
    emoji: '🌾',
    finca: 'Llanos de Arauca',
    municipio: 'Arauca (Arauca)',
    climaTipo: 'Cálido - Muy Húmedo',
    altitud: '85 msnm',
    humedadOptima: 70,
    humedad: 75,
    humedadEstado: 'Óptimo',
    temperaturaSuelo: 29.4,
    temperatura: 31,
    riegoHoy: '3.500 L',
    estadoCultivo: 'Excelente',
    estadoCultivoDetalle: 'Fase de inundación controlada',
    clima: { temp: 31, estado: 'Nublado con tormentas', humedad: 85, viento: '22 km/h', lluvia: '90%' },
    ultimoRiego: '22/05/2026 - 4:00 a.m.',
    proximoRiego: 'No requerido — lluvia inminente',
    dispositivo: { nombre: 'ESP32-Arroz-LoteA', bateria: 88, estado: 'Conectado', firmware: 'v2.1.4', senales: -68 },
    distribucionHumedad: { bajo: 0, medio: 10, alto: 90 },
    humedadEvolucion: [
      { fecha: '15/05', valor: 72 }, { fecha: '16/05', valor: 74 }, { fecha: '17/05', valor: 75 },
      { fecha: '18/05', valor: 73 }, { fecha: '19/05', valor: 76 }, { fecha: '20/05', valor: 75 },
      { fecha: '21/05', valor: 74 }, { fecha: '22/05', valor: 75 }
    ],
    riegosPorDia: [
      { fecha: '15/05', valor: 3000 }, { fecha: '16/05', valor: 2800 }, { fecha: '17/05', valor: 3200 },
      { fecha: '18/05', valor: 3500 }, { fecha: '19/05', valor: 3100 }, { fecha: '20/05', valor: 3000 },
      { fecha: '21/05', valor: 3200 }, { fecha: '22/05', valor: 3500 }
    ],
    alertas: [
      { id: 1, tipo: 'info', titulo: 'Tormenta eléctrica prevista', descripcion: 'IDEAM reporta tormenta en 2 horas. Proteger dispositivos electrónicos en campo.', hora: '09:30', leida: false }
    ],
    abono: { ultimoAbono: '12/05/2026', proximoAbono: '26/05/2026', tipoAbono: 'Urea 46%', cantidadAbono: '4 kg/100m²' }
  },

  banano: {
    id: 'banano',
    name: 'Banano',
    emoji: '🍌',
    finca: 'Valle del Urabá',
    municipio: 'Carepa (Antioquia)',
    climaTipo: 'Cálido - Húmedo',
    altitud: '50 msnm',
    humedadOptima: 65,
    humedad: 62,
    humedadEstado: 'Aceptable',
    temperaturaSuelo: 27.6,
    temperatura: 29,
    riegoHoy: '1.800 L',
    estadoCultivo: 'Bueno',
    estadoCultivoDetalle: 'Desarrollo foliar activo',
    clima: { temp: 29, estado: 'Chubascos dispersos', humedad: 78, viento: '14 km/h', lluvia: '65%' },
    ultimoRiego: '21/05/2026 - 7:00 a.m.',
    proximoRiego: 'Monitorear tras lluvia',
    dispositivo: { nombre: 'ESP32-Banano-Canal', bateria: 95, estado: 'Conectado', firmware: 'v2.1.4', senales: -60 },
    distribucionHumedad: { bajo: 15, medio: 75, alto: 10 },
    humedadEvolucion: [
      { fecha: '15/05', valor: 66 }, { fecha: '16/05', valor: 65 }, { fecha: '17/05', valor: 63 },
      { fecha: '18/05', valor: 60 }, { fecha: '19/05', valor: 62 }, { fecha: '20/05', valor: 65 },
      { fecha: '21/05', valor: 64 }, { fecha: '22/05', valor: 62 }
    ],
    riegosPorDia: [
      { fecha: '15/05', valor: 1500 }, { fecha: '16/05', valor: 1500 }, { fecha: '17/05', valor: 1800 },
      { fecha: '18/05', valor: 2000 }, { fecha: '19/05', valor: 1600 }, { fecha: '20/05', valor: 1500 },
      { fecha: '21/05', valor: 1800 }, { fecha: '22/05', valor: 1800 }
    ],
    alertas: [],
    abono: { ultimoAbono: '08/05/2026', proximoAbono: '22/05/2026', tipoAbono: 'Completo 15-15-15', cantidadAbono: '3.5 kg/planta' }
  },

  maiz: {
    id: 'maiz',
    name: 'Maíz',
    emoji: '🌽',
    finca: 'Llanos de Casanare',
    municipio: 'Yopal (Casanare)',
    climaTipo: 'Cálido - Seco',
    altitud: '325 msnm',
    humedadOptima: 50,
    humedad: 34,
    humedadEstado: 'Bajo',
    temperaturaSuelo: 31.5,
    temperatura: 32,
    riegoHoy: '1.100 L',
    estadoCultivo: 'Advertencia',
    estadoCultivoDetalle: 'Estrés por calor y sequía',
    clima: { temp: 32, estado: 'Soleado intenso', humedad: 45, viento: '15 km/h', lluvia: '5%' },
    ultimoRiego: '22/05/2026 - 6:00 a.m.',
    proximoRiego: '⚠️ Riego urgente — temperatura alta',
    dispositivo: { nombre: 'ESP32-Maiz-Central', bateria: 70, estado: 'Conectado', firmware: 'v2.0.9', senales: -75 },
    distribucionHumedad: { bajo: 55, medio: 40, alto: 5 },
    humedadEvolucion: [
      { fecha: '15/05', valor: 52 }, { fecha: '16/05', valor: 50 }, { fecha: '17/05', valor: 46 },
      { fecha: '18/05', valor: 42 }, { fecha: '19/05', valor: 40 }, { fecha: '20/05', valor: 38 },
      { fecha: '21/05', valor: 36 }, { fecha: '22/05', valor: 34 }
    ],
    riegosPorDia: [
      { fecha: '15/05', valor: 800 }, { fecha: '16/05', valor: 800 }, { fecha: '17/05', valor: 1000 },
      { fecha: '18/05', valor: 1200 }, { fecha: '19/05', valor: 900 }, { fecha: '20/05', valor: 1000 },
      { fecha: '21/05', valor: 1100 }, { fecha: '22/05', valor: 1100 }
    ],
    alertas: [
      { id: 1, tipo: 'critica', titulo: '🌡️ Temperatura crítica del suelo', descripcion: 'Suelo a 31.5°C con humedad al 34%. La evaporación es muy alta. Riego urgente.', hora: '11:00', leida: false },
      { id: 2, tipo: 'warning', titulo: 'Humedad descendiendo', descripcion: 'Tendencia a la baja desde hace 7 días. Ajustar frecuencia de riego.', hora: '08:00', leida: true }
    ],
    abono: { ultimoAbono: '18/05/2026', proximoAbono: '01/06/2026', tipoAbono: 'Nitrogenado - Urea 46%', cantidadAbono: '3 kg/100m²' }
  },

  cacao: {
    id: 'cacao',
    name: 'Cacao',
    emoji: '🍫',
    finca: 'Finca Bellavista',
    municipio: 'Lebrija (Santander)',
    climaTipo: 'Cálido - Húmedo',
    altitud: '980 msnm',
    humedadOptima: 55,
    humedad: 53,
    humedadEstado: 'Aceptable',
    temperaturaSuelo: 24.8,
    temperatura: 26,
    riegoHoy: '900 L',
    estadoCultivo: 'Bueno',
    estadoCultivoDetalle: 'Formación de mazorcas',
    clima: { temp: 26, estado: 'Parcialmente soleado', humedad: 70, viento: '11 km/h', lluvia: '25%' },
    ultimoRiego: '21/05/2026 - 5:30 a.m.',
    proximoRiego: 'Programar mañana temprano',
    dispositivo: { nombre: 'ESP32-Cacao-Bosque', bateria: 83, estado: 'Conectado', firmware: 'v2.1.4', senales: -73 },
    distribucionHumedad: { bajo: 25, medio: 65, alto: 10 },
    humedadEvolucion: [
      { fecha: '15/05', valor: 56 }, { fecha: '16/05', valor: 54 }, { fecha: '17/05', valor: 52 },
      { fecha: '18/05', valor: 55 }, { fecha: '19/05', valor: 53 }, { fecha: '20/05', valor: 52 },
      { fecha: '21/05', valor: 54 }, { fecha: '22/05', valor: 53 }
    ],
    riegosPorDia: [
      { fecha: '15/05', valor: 600 }, { fecha: '16/05', valor: 600 }, { fecha: '17/05', valor: 800 },
      { fecha: '18/05', valor: 800 }, { fecha: '19/05', valor: 700 }, { fecha: '20/05', valor: 900 },
      { fecha: '21/05', valor: 900 }, { fecha: '22/05', valor: 900 }
    ],
    alertas: [],
    abono: { ultimoAbono: '02/05/2026', proximoAbono: '02/06/2026', tipoAbono: 'Orgánico - Bokashi', cantidadAbono: '4 kg/árbol' }
  },

  cana: {
    id: 'cana',
    name: 'Caña',
    emoji: '🎋',
    finca: 'Hacienda San Jerónimo',
    municipio: 'Palmira (Valle del Cauca)',
    climaTipo: 'Cálido - Templado',
    altitud: '1.050 msnm',
    humedadOptima: 50,
    humedad: 51,
    humedadEstado: 'Óptimo',
    temperaturaSuelo: 24.2,
    temperatura: 28,
    riegoHoy: '2.500 L',
    estadoCultivo: 'Excelente',
    estadoCultivoDetalle: 'Elongación de tallos',
    clima: { temp: 28, estado: 'Soleado', humedad: 58, viento: '14 km/h', lluvia: '5%' },
    ultimoRiego: '22/05/2026 - 5:00 a.m.',
    proximoRiego: 'Programar en 24 horas',
    dispositivo: { nombre: 'ESP32-Cana-Valle', bateria: 77, estado: 'Conectado', firmware: 'v2.1.4', senales: -69 },
    distribucionHumedad: { bajo: 10, medio: 80, alto: 10 },
    humedadEvolucion: [
      { fecha: '15/05', valor: 53 }, { fecha: '16/05', valor: 52 }, { fecha: '17/05', valor: 50 },
      { fecha: '18/05', valor: 49 }, { fecha: '19/05', valor: 52 }, { fecha: '20/05', valor: 50 },
      { fecha: '21/05', valor: 51 }, { fecha: '22/05', valor: 51 }
    ],
    riegosPorDia: [
      { fecha: '15/05', valor: 2000 }, { fecha: '16/05', valor: 2000 }, { fecha: '17/05', valor: 0 },
      { fecha: '18/05', valor: 2200 }, { fecha: '19/05', valor: 2400 }, { fecha: '20/05', valor: 0 },
      { fecha: '21/05', valor: 2500 }, { fecha: '22/05', valor: 2500 }
    ],
    alertas: [],
    abono: { ultimoAbono: '15/05/2026', proximoAbono: '15/06/2026', tipoAbono: 'Complejo - Azufre + Potasio', cantidadAbono: '5 kg/100m²' }
  },

  hortalizas: {
    id: 'hortalizas',
    name: 'Hortalizas',
    emoji: '🥦',
    finca: 'Finca Los Alerces',
    municipio: 'Sopó (Cundinamarca)',
    climaTipo: 'Frío - Húmedo',
    altitud: '2.650 msnm',
    humedadOptima: 45,
    humedad: 43,
    humedadEstado: 'Aceptable',
    temperaturaSuelo: 15.3,
    temperatura: 14,
    riegoHoy: '350 L',
    estadoCultivo: 'Bueno',
    estadoCultivoDetalle: 'Hortalizas de hoja listas para cosecha',
    clima: { temp: 14, estado: 'Llovizna / Templado', humedad: 75, viento: '10 km/h', lluvia: '60%' },
    ultimoRiego: '22/05/2026 - 7:00 a.m.',
    proximoRiego: 'Monitorear nivel de lluvias',
    dispositivo: { nombre: 'ESP32-Hortaliza-Sopo', bateria: 90, estado: 'Conectado', firmware: 'v2.1.4', senales: -67 },
    distribucionHumedad: { bajo: 20, medio: 70, alto: 10 },
    humedadEvolucion: [
      { fecha: '15/05', valor: 48 }, { fecha: '16/05', valor: 46 }, { fecha: '17/05', valor: 44 },
      { fecha: '18/05', valor: 42 }, { fecha: '19/05', valor: 45 }, { fecha: '20/05', valor: 43 },
      { fecha: '21/05', valor: 44 }, { fecha: '22/05', valor: 43 }
    ],
    riegosPorDia: [
      { fecha: '15/05', valor: 300 }, { fecha: '16/05', valor: 250 }, { fecha: '17/05', valor: 300 },
      { fecha: '18/05', valor: 300 }, { fecha: '19/05', valor: 350 }, { fecha: '20/05', valor: 350 },
      { fecha: '21/05', valor: 350 }, { fecha: '22/05', valor: 350 }
    ],
    alertas: [],
    abono: { ultimoAbono: '10/05/2026', proximoAbono: '24/05/2026', tipoAbono: 'Humus de Lombriz', cantidadAbono: '1.5 kg/m²' }
  }
};
