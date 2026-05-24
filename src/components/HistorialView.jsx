import React, { useState, useMemo } from 'react';
import { cropsData } from '../data/mockData';
import './HistorialView.css';

/* ─── Datos de eventos ficticios ──────────────────────────────── */
function generarEventos() {
  const hoy = new Date(2026, 4, 24); // 24 mayo 2026
  const cultivos = Object.values(cropsData);

  const plantillas = [
    // riego
    (c, d) => ({ tipo: 'riego',   icono: '💧', evento: `Riego automático completado en ${c.name}`,         cultivo: c.name, cropEmoji: c.emoji, valor: `${c.riegosPorDia[d % c.riegosPorDia.length].valor} L`, cropId: c.id }),
    (c, d) => ({ tipo: 'riego',   icono: '💧', evento: `Riego manual activado por operario`,               cultivo: c.name, cropEmoji: c.emoji, valor: `${Math.round(c.riegosPorDia[d % c.riegosPorDia.length].valor * 0.6)} L`, cropId: c.id }),
    // alerta
    (c)    => ({ tipo: 'alerta',  icono: '⚠️', evento: `Humedad crítica detectada en ${c.name}`,           cultivo: c.name, cropEmoji: c.emoji, valor: `${c.humedad}%`, cropId: c.id }),
    (c)    => ({ tipo: 'alerta',  icono: '⚠️', evento: `Temperatura del suelo fuera de rango`,             cultivo: c.name, cropEmoji: c.emoji, valor: `${c.temperaturaSuelo}°C`, cropId: c.id }),
    (c)    => ({ tipo: 'alerta',  icono: '⚠️', evento: `Batería del dispositivo baja`,                     cultivo: c.name, cropEmoji: c.emoji, valor: `${c.dispositivo.bateria}%`, cropId: c.id }),
    // clima
    (c)    => ({ tipo: 'clima',   icono: '🌧️', evento: `Lluvia detectada: riego suspendido en ${c.name}`, cultivo: c.name, cropEmoji: c.emoji, valor: c.clima.lluvia, cropId: c.id }),
    (c)    => ({ tipo: 'clima',   icono: '🌧️', evento: `Viento fuerte registrado — sensor recalibrado`,    cultivo: c.name, cropEmoji: c.emoji, valor: c.clima.viento, cropId: c.id }),
    (c)    => ({ tipo: 'clima',   icono: '🌧️', evento: `Condición climática: ${c.clima.estado}`,           cultivo: c.name, cropEmoji: c.emoji, valor: `${c.clima.temp}°C`, cropId: c.id }),
    // sync
    (c)    => ({ tipo: 'sync',    icono: '🔄', evento: `Sincronización exitosa con ${c.dispositivo.nombre}`, cultivo: c.name, cropEmoji: c.emoji, valor: c.dispositivo.firmware, cropId: c.id }),
    (c)    => ({ tipo: 'sync',    icono: '🔄', evento: `Actualización de firmware completada`,              cultivo: c.name, cropEmoji: c.emoji, valor: c.dispositivo.firmware, cropId: c.id }),
    // reporte
    (c)    => ({ tipo: 'reporte', icono: '📄', evento: `Reporte semanal generado para ${c.name}`,          cultivo: c.name, cropEmoji: c.emoji, valor: '—', cropId: c.id }),
    (c)    => ({ tipo: 'reporte', icono: '📄', evento: `Exportación CSV de humedad completada`,             cultivo: c.name, cropEmoji: c.emoji, valor: '—', cropId: c.id }),
  ];

  const horas = ['04:30','05:15','06:00','06:35','07:00','07:45','08:00','08:30','09:00','10:05','10:30','11:00','12:00','13:15','14:30','15:00','16:45','17:30','18:00','19:20'];

  const eventos = [];
  let id = 1;

  for (let diaOffset = 0; diaOffset < 14 && eventos.length < 28; diaOffset++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - diaOffset);
    const fechaStr = `${String(fecha.getDate()).padStart(2,'0')}/${String(fecha.getMonth()+1).padStart(2,'0')}/${fecha.getFullYear()}`;

    const cantidadHoy = diaOffset === 0 ? 4 : diaOffset < 3 ? 3 : 2;

    for (let i = 0; i < cantidadHoy && eventos.length < 28; i++) {
      const cultivo = cultivos[(id + diaOffset + i) % cultivos.length];
      const plantilla = plantillas[(id + i) % plantillas.length];
      const datosEvento = plantilla(cultivo, diaOffset);

      eventos.push({
        id: id++,
        fecha: fechaStr,
        hora: horas[(diaOffset * 2 + i) % horas.length],
        ...datosEvento,
      });
    }
  }

  return eventos;
}

const EVENTOS_BASE = generarEventos();


const TIPOS_FILTRO = [
  { key: 'todos',   label: 'Todos',    icono: '📋' },
  { key: 'riego',   label: 'Riego',    icono: '💧' },
  { key: 'alerta',  label: 'Alertas',  icono: '⚠️' },
  { key: 'clima',   label: 'Clima',    icono: '🌧️' },
  { key: 'sync',    label: 'Sync',     icono: '🔄' },
  { key: 'reporte', label: 'Reportes', icono: '📄' },
];

/* ─── Mini gráfico SVG de barras ─────────────────────────────── */
function BarChart({ datos, titulo }) {
  const [tooltip, setTooltip] = useState(null);
  const maxVal = Math.max(...datos.map(d => d.valor), 1);

  const W = 280, H = 80, BARW = 26, GAP = 8, PAD = 10;

  return (
    <div className="hv-barchart-wrap">
      <p className="hv-barchart-title">{titulo}</p>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H + 20}`}
        className="hv-barchart-svg"
        aria-label={titulo}
      >
        {datos.map((d, i) => {
          const barH = Math.round((d.valor / maxVal) * H);
          const x = PAD + i * (BARW + GAP);
          const y = H - barH;
          const isHovered = tooltip?.i === i;

          return (
            <g key={i}>
              {/* Barra de fondo (track) */}
              <rect
                x={x} y={0} width={BARW} height={H}
                rx={4} fill="rgba(255,255,255,0.04)"
              />
              {/* Barra de valor */}
              <rect
                x={x} y={y} width={BARW} height={barH}
                rx={4}
                fill={isHovered ? '#6fd48a' : '#46b464'}
                className="hv-bar"
                onMouseEnter={() => setTooltip({ i, x, y, valor: d.valor, fecha: d.fecha })}
                onMouseLeave={() => setTooltip(null)}
              />
              {/* Etiqueta de fecha */}
              <text
                x={x + BARW / 2} y={H + 14}
                textAnchor="middle"
                fontSize={9}
                fill="var(--text-muted)"
              >
                {d.fecha.slice(0, 5)}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={Math.min(tooltip.x - 8, W - 70)}
              y={Math.max(tooltip.y - 30, 0)}
              width={66} height={22}
              rx={5}
              fill="rgba(20,50,30,0.92)"
              stroke="rgba(70,180,100,0.4)"
              strokeWidth={1}
            />
            <text
              x={Math.min(tooltip.x - 8, W - 70) + 33}
              y={Math.max(tooltip.y - 30, 0) + 14}
              textAnchor="middle"
              fontSize={10}
              fill="#fff"
              fontWeight="600"
            >
              {tooltip.valor.toLocaleString()} L
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

/* ─── Componente principal ────────────────────────────────────── */
export default function HistorialView({ selectedCropId, setSelectedCropId }) {
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroCultivo, setFiltroCultivo] = useState(selectedCropId || 'todos');

  const cropActual = cropsData[filtroCultivo] || null;

  // Combinar eventos base estáticos con los generados dinámicamente en la sesión
  const todosLosEventos = useMemo(() => {
    const dinamicos = window.mockEventosAdicionales || [];
    return [...dinamicos, ...EVENTOS_BASE];
  }, [window.mockEventosAdicionales, window.mockEventosAdicionales?.length]);

  /* Cálculo de stats */
  const stats = useMemo(() => {
    const eventosHoy = todosLosEventos.filter(e => {
      const hoy = new Date(2026, 4, 24);
      const [d, m, y] = e.fecha.split('/').map(Number);
      const fechaEvento = new Date(y, m - 1, d);
      const diffDias = Math.floor((hoy - fechaEvento) / 86400000);
      return diffDias < 7;
    });

    const totalEventos = eventosHoy.length;
    const litros = eventosHoy
      .filter(e => e.tipo === 'riego')
      .reduce((acc, e) => {
        const match = e.valor?.match(/(\d+)/);
        return acc + (match ? parseInt(match[1]) : 0);
      }, 0);

    return { totalEventos, litros };
  }, [todosLosEventos]);

  /* Filtrado */
  const eventosFiltrados = useMemo(() => {
    return todosLosEventos.filter(e => {
      const coincideTipo = filtroTipo === 'todos' || e.tipo === filtroTipo;
      // Los dinámicos a veces tienen el campo `cultivo` de forma directa o cropId
      const coincideCultivo = filtroCultivo === 'todos' || 
                              e.cropId === filtroCultivo || 
                              (e.cultivo && e.cultivo.toLowerCase() === filtroCultivo.toLowerCase());
      return coincideTipo && coincideCultivo;
    });
  }, [todosLosEventos, filtroTipo, filtroCultivo]);

  /* Datos del gráfico */
  const datosGrafico = cropActual
    ? cropActual.riegosPorDia
    : Object.values(cropsData)[0].riegosPorDia;

  const handleCultivoChange = (e) => {
    const val = e.target.value;
    setFiltroCultivo(val);
    if (val !== 'todos') setSelectedCropId(val);
  };

  return (
    <main className="historial-view content-bg animate-fade">

      {/* ── Cabecera ─────────────────────────────────────── */}
      <div className="hv-header">
        <div className="hv-title-block">
          <h2 className="hv-title">📋 Historial de Eventos</h2>
          <p className="hv-subtitle">Registro completo de actividades de los últimos 14 días</p>
        </div>

        {/* Stats rápidas */}
        <div className="hv-stats-row">
          <div className="glass-card hv-stat-card">
            <span className="hv-stat-icon">📋</span>
            <div>
              <p className="hv-stat-val">{stats.totalEventos}</p>
              <p className="hv-stat-lbl">Eventos esta semana</p>
            </div>
          </div>
          <div className="glass-card hv-stat-card">
            <span className="hv-stat-icon">💧</span>
            <div>
              <p className="hv-stat-val">{stats.litros.toLocaleString()} L</p>
              <p className="hv-stat-lbl">Agua usada esta semana</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Controles + mini gráfico ─────────────────────── */}
      <div className="hv-controls-row">

        {/* Filtros izquierda */}
        <div className="hv-filters-block">
          {/* Pills de tipo */}
          <div className="hv-pills">
            {TIPOS_FILTRO.map(t => (
              <button
                key={t.key}
                className={`hv-pill ${filtroTipo === t.key ? 'hv-pill--active' : ''}`}
                onClick={() => setFiltroTipo(t.key)}
              >
                <span>{t.icono}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Selector de cultivo */}
          <div className="hv-selector-wrap">
            <span className="hv-selector-icon">🌱</span>
            <select
              className="hv-selector"
              value={filtroCultivo}
              onChange={handleCultivoChange}
            >
              <option value="todos">Todos los cultivos</option>
              {Object.values(cropsData).map(c => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mini gráfico SVG */}
        <div className="glass-card hv-chart-card">
          <BarChart
            datos={datosGrafico}
            titulo={`💧 Riegos por día — ${cropActual ? `${cropActual.emoji} ${cropActual.name}` : 'Todos los cultivos'}`}
          />
        </div>
      </div>

      {/* ── Tabla de eventos ─────────────────────────────── */}
      <div className="glass-card hv-table-wrap">
        <div className="hv-table-header">
          <span className="hv-table-count">
            {eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? 's' : ''} encontrado{eventosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tabla desktop */}
        <div className="hv-table-scroll">
          <table className="hv-table">
            <thead>
              <tr>
                <th>Fecha / Hora</th>
                <th>Tipo</th>
                <th>Evento</th>
                <th>Cultivo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="hv-empty">
                    <span>🔍</span>
                    <p>No hay eventos para los filtros seleccionados</p>
                  </td>
                </tr>
              ) : (
                eventosFiltrados.map((ev, idx) => (
                  <tr key={ev.id} className="hv-row animate-row" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td className="hv-td-fecha">
                      <span className="hv-fecha">{ev.fecha}</span>
                      <span className="hv-hora">{ev.hora}</span>
                    </td>
                    <td>
                      <span className={`hv-badge hv-badge--${ev.tipo}`}>
                        {ev.icono} {ev.tipo}
                      </span>
                    </td>
                    <td className="hv-td-evento">{ev.evento}</td>
                    <td className="hv-td-cultivo">
                      <span className="hv-crop-emoji">{ev.cropEmoji}</span>
                      <span>{ev.cultivo}</span>
                    </td>
                    <td className="hv-td-valor">{ev.valor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards mobile */}
        <div className="hv-mobile-cards">
          {eventosFiltrados.length === 0 ? (
            <div className="hv-empty">
              <span>🔍</span>
              <p>No hay eventos para los filtros seleccionados</p>
            </div>
          ) : (
            eventosFiltrados.map((ev, idx) => (
              <div key={ev.id} className="hv-mobile-card animate-row" style={{ animationDelay: `${idx * 30}ms` }}>
                <div className="hv-mc-top">
                  <span className={`hv-badge hv-badge--${ev.tipo}`}>
                    {ev.icono} {ev.tipo}
                  </span>
                  <span className="hv-mc-fecha">{ev.fecha} · {ev.hora}</span>
                </div>
                <p className="hv-mc-evento">{ev.evento}</p>
                <div className="hv-mc-bottom">
                  <span className="hv-mc-cultivo">{ev.cropEmoji} {ev.cultivo}</span>
                  <span className="hv-mc-valor">{ev.valor}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
