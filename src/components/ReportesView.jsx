import React, { useState } from 'react';
import { cropsData } from '../data/mockData';
import './ReportesView.css';

/* ── Static data ─────────────────────────────────────────────── */

const REPORT_TYPES = [
  {
    id: 'mensual',
    icon: '📅',
    title: 'Reporte Mensual',
    description: 'Resumen completo de riego, humedad y temperatura del mes en curso.',
    periodo: 'Mayo 2026',
    premium: false,
    color: 'green',
  },
  {
    id: 'semanal',
    icon: '📆',
    title: 'Reporte Semanal',
    description: 'Análisis de la semana: eventos, alertas y consumo de agua.',
    periodo: 'Semana 21 — 2026',
    premium: false,
    color: 'blue',
  },
  {
    id: 'cultivo',
    icon: '🌱',
    title: 'Por Cultivo',
    description: 'Informe detallado del cultivo seleccionado con recomendaciones agronómicas.',
    periodo: 'Período actual',
    premium: false,
    color: 'teal',
  },
  {
    id: 'agua',
    icon: '💧',
    title: 'Análisis de Agua',
    description: 'Eficiencia del sistema de riego, litros totales y proyecciones hídricas.',
    periodo: 'Últimos 30 días',
    premium: true,
    color: 'cyan',
  },
  {
    id: 'ica',
    icon: '🏛️',
    title: 'Reporte ICA',
    description: 'Documento oficial para el Instituto Colombiano Agropecuario con datos de campo.',
    periodo: 'Certificación 2026',
    premium: true,
    color: 'gold',
  },
];

const buildMockReports = (cropData) => [
  {
    id: 1,
    fecha: '20/05/2026',
    tipo: 'Mensual',
    cultivo: cropData?.name || 'Tomate',
    emoji: cropData?.emoji || '🍅',
    tamanio: '2.3 MB',
    estado: 'Generado',
  },
  {
    id: 2,
    fecha: '14/05/2026',
    tipo: 'Semanal',
    cultivo: 'Café',
    emoji: '☕',
    tamanio: '1.1 MB',
    estado: 'Generado',
  },
  {
    id: 3,
    fecha: '10/05/2026',
    tipo: 'Análisis de Agua',
    cultivo: 'Arroz',
    emoji: '🌾',
    tamanio: '3.7 MB',
    estado: 'Generado',
  },
  {
    id: 4,
    fecha: '05/05/2026',
    tipo: 'Por Cultivo',
    cultivo: 'Papa',
    emoji: '🥔',
    tamanio: '0.9 MB',
    estado: 'Generado',
  },
  {
    id: 5,
    fecha: '01/05/2026',
    tipo: 'Reporte ICA',
    cultivo: 'Todos',
    emoji: '🏛️',
    tamanio: '5.2 MB',
    estado: 'Generado',
  },
];

/* ── Component ───────────────────────────────────────────────── */

export default function ReportesView({ selectedCropId }) {
  const currentCrop = cropsData[selectedCropId] || cropsData.tomate;
  const mockReports = buildMockReports(currentCrop);

  // Map: reportId → 'idle' | 'generating' | 'done'
  const [btnStates, setBtnStates] = useState(() =>
    Object.fromEntries(REPORT_TYPES.map((r) => [r.id, 'idle']))
  );

  const [downloadStates, setDownloadStates] = useState(() =>
    Object.fromEntries(mockReports.map((r) => [r.id, 'idle']))
  );

  const handleGenerar = (reportId) => {
    if (btnStates[reportId] !== 'idle') return;
    setBtnStates((prev) => ({ ...prev, [reportId]: 'generating' }));
    setTimeout(() => {
      setBtnStates((prev) => ({ ...prev, [reportId]: 'done' }));
    }, 2000);
  };

  const handleDownload = (rowId) => {
    if (downloadStates[rowId] !== 'idle') return;
    setDownloadStates((prev) => ({ ...prev, [rowId]: 'downloading' }));
    setTimeout(() => {
      setDownloadStates((prev) => ({ ...prev, [rowId]: 'done' }));
    }, 1200);
  };

  const getButtonContent = (state) => {
    if (state === 'generating') return <><span className="rpt-spinner" /> Generando…</>;
    if (state === 'done') return <>✓ Descargado</>;
    return <>⬇ Generar</>;
  };

  const getButtonClass = (state) => {
    if (state === 'generating') return 'btn rpt-btn rpt-btn--generating';
    if (state === 'done') return 'btn rpt-btn rpt-btn--done';
    return 'btn rpt-btn rpt-btn--idle';
  };

  return (
    <main className="reportes-view content-bg animate-fade">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="rpt-page-header">
        <div>
          <h2 className="rpt-page-title">📊 Centro de Reportes</h2>
          <p className="rpt-page-sub">
            {currentCrop.emoji} {currentCrop.name} · {currentCrop.finca}
          </p>
        </div>
        <div className="rpt-header-badge">
          <span className="rpt-badge rpt-badge--premium">⭐ Plan Premium</span>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────── */}
      <div className="rpt-stats-row">
        {[
          { icon: '📋', label: 'Reportes este mes', value: '8', color: 'green' },
          { icon: '🕐', label: 'Último reporte', value: '20/05/2026', color: 'blue' },
          { icon: '⏰', label: 'Próximo programado', value: '27/05/2026', color: 'purple' },
        ].map((s, i) => (
          <div key={i} className={`glass-card rpt-stat-card rpt-stat--${s.color}`}>
            <span className="rpt-stat-icon">{s.icon}</span>
            <div>
              <p className="rpt-stat-value">{s.value}</p>
              <p className="rpt-stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 1: Tipos de Reporte ──────────────────────── */}
      <div className="rpt-section">
        <div className="rpt-section-header">
          <h3 className="rpt-section-title">📄 Tipos de Reporte Disponibles</h3>
          <span className="rpt-section-sub">Haz clic en Generar para descargar el PDF</span>
        </div>
        <div className="rpt-cards-grid">
          {REPORT_TYPES.map((report) => (
            <div
              key={report.id}
              className={`glass-card rpt-type-card rpt-type--${report.color} ${report.premium ? 'rpt-type--premium' : ''}`}
            >
              {report.premium && (
                <span className="rpt-premium-badge">⭐ Premium</span>
              )}
              <div className="rpt-type-icon-wrap">
                <span className="rpt-type-icon">{report.icon}</span>
              </div>
              <h4 className="rpt-type-title">{report.title}</h4>
              <p className="rpt-type-desc">{report.description}</p>
              <div className="rpt-type-footer">
                <span className="rpt-type-period">🗓 {report.periodo}</span>
                <button
                  className={getButtonClass(btnStates[report.id])}
                  onClick={() => handleGenerar(report.id)}
                  disabled={btnStates[report.id] === 'generating'}
                >
                  {getButtonContent(btnStates[report.id])}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: Reportes Generados Recientemente ─────── */}
      <div className="rpt-section">
        <div className="rpt-section-header">
          <h3 className="rpt-section-title">📁 Reportes Generados Recientemente</h3>
          <span className="rpt-section-sub">Historial de los últimos documentos</span>
        </div>
        <div className="glass-card rpt-table-card">
          <table className="rpt-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cultivo</th>
                <th>Tamaño</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {mockReports.map((row) => (
                <tr key={row.id} className="rpt-table-row">
                  <td className="rpt-td-date">{row.fecha}</td>
                  <td>
                    <span className="rpt-type-tag">{row.tipo}</span>
                  </td>
                  <td className="rpt-td-crop">
                    <span className="rpt-crop-emoji">{row.emoji}</span>
                    {row.cultivo}
                  </td>
                  <td className="rpt-td-size">{row.tamanio}</td>
                  <td>
                    <span className="rpt-status rpt-status--ok">✓ {row.estado}</span>
                  </td>
                  <td>
                    <button
                      className={`rpt-dl-btn ${downloadStates[row.id] === 'done' ? 'rpt-dl-btn--done' : ''}`}
                      onClick={() => handleDownload(row.id)}
                      disabled={downloadStates[row.id] !== 'idle'}
                      title="Descargar PDF"
                    >
                      {downloadStates[row.id] === 'downloading' && <span className="rpt-spinner rpt-spinner--sm" />}
                      {downloadStates[row.id] === 'done' ? '✓' : downloadStates[row.id] === 'downloading' ? '' : '⬇'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
