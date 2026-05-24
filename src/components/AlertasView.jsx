import React, { useState, useMemo } from 'react';
import { cropsData } from '../data/mockData';
import './AlertasView.css';

// Severity order for sorting
const SEVERITY_ORDER = { critica: 0, warning: 1, info: 2 };

// Severity config: icon, label, color class
const SEVERITY_CONFIG = {
  critica: { icon: '🚨', label: 'CRÍTICA',  colorClass: 'alerta-critica' },
  warning: { icon: '⚠️',  label: 'ADVERTENCIA', colorClass: 'alerta-warning' },
  info:    { icon: 'ℹ️',  label: 'INFO',     colorClass: 'alerta-info' },
};

export default function AlertasView({ selectedCropId, setSelectedCropId }) {
  const [filtroTipo, setFiltroTipo] = useState('todas');

  // Combine alerts from ALL crops, adding cropName + cropEmoji + unique key
  const todasLasAlertas = useMemo(() => {
    return Object.values(cropsData).flatMap((crop) =>
      (crop.alertas || []).map((alerta) => ({
        ...alerta,
        // Create a unique key per alerta across crops
        uid: `${crop.id}-${alerta.id}`,
        cropId:    crop.id,
        cropName:  crop.name,
        cropEmoji: crop.emoji,
        resuelta:  false,
      }))
    );
  }, []);

  // Local state: each alerta can be marked resolved (keyed by uid)
  const [resueltasMap, setResueltasMap] = useState({});

  const marcarResuelta = (uid) => {
    setResueltasMap((prev) => ({ ...prev, [uid]: true }));
  };

  // Filter + sort
  const alertasFiltradas = useMemo(() => {
    return todasLasAlertas
      .filter((a) => filtroTipo === 'todas' || a.tipo === filtroTipo)
      .sort((a, b) => (SEVERITY_ORDER[a.tipo] ?? 99) - (SEVERITY_ORDER[b.tipo] ?? 99));
  }, [todasLasAlertas, filtroTipo]);

  const activasCount = todasLasAlertas.filter((a) => !resueltasMap[a.uid]).length;

  const FILTROS = [
    { key: 'todas',   label: 'Todas',        icon: '🔔' },
    { key: 'critica', label: 'Críticas',      icon: '🚨' },
    { key: 'warning', label: 'Advertencias',  icon: '⚠️' },
    { key: 'info',    label: 'Info',          icon: 'ℹ️' },
  ];

  return (
    <main className="alertas-view content-bg animate-fade">

      {/* ── HEADER ── */}
      <div className="alertas-header">
        <div className="alertas-header-left">
          <h2 className="alertas-title">Centro de Alertas</h2>
          <p className="alertas-subtitle">
            <span className="alertas-count-badge">
              {activasCount} {activasCount === 1 ? 'alerta activa' : 'alertas activas'}
            </span>
            <span className="alertas-subtitle-text">en todos los cultivos</span>
          </p>
        </div>

        <div className="alertas-header-right">
          {/* Crop selector */}
          <div className="bento-selector-wrapper">
            <select
              className="bento-selector"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
            >
              {Object.values(cropsData).map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.emoji} {crop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter pills */}
          <div className="alertas-filtros">
            {FILTROS.map((f) => (
              <button
                key={f.key}
                className={`filtro-pill ${filtroTipo === f.key ? 'filtro-pill--active' : ''}`}
                onClick={() => setFiltroTipo(f.key)}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── ALERT LIST ── */}
      {alertasFiltradas.length === 0 ? (
        <div className="alertas-empty">
          <span className="alertas-empty-icon">✅</span>
          <h3 className="alertas-empty-title">Todo en orden</h3>
          <p className="alertas-empty-desc">
            No hay alertas {filtroTipo !== 'todas' ? `de tipo "${filtroTipo}"` : ''} en este momento.
          </p>
        </div>
      ) : (
        <div className="alertas-list">
          {alertasFiltradas.map((alerta) => {
            const resuelta = !!resueltasMap[alerta.uid];
            const config = SEVERITY_CONFIG[alerta.tipo] || SEVERITY_CONFIG.info;

            return (
              <div
                key={alerta.uid}
                className={`glass-card alerta-card ${config.colorClass} ${resuelta ? 'alerta-card--resuelta' : ''}`}
              >
                {/* Left: severity icon */}
                <div className={`alerta-icon-col ${config.colorClass}__icon`}>
                  <span className="alerta-sev-icon">{config.icon}</span>
                </div>

                {/* Center: content */}
                <div className="alerta-content">
                  <div className="alerta-content-top">
                    <span className={`alerta-tipo-badge ${config.colorClass}__badge`}>
                      {config.label}
                    </span>
                    {resuelta && (
                      <span className="alerta-resuelta-badge">RESUELTA</span>
                    )}
                  </div>

                  <h4 className={`alerta-titulo ${resuelta ? 'alerta-titulo--tachado' : ''}`}>
                    {alerta.titulo}
                  </h4>
                  <p className={`alerta-descripcion ${resuelta ? 'alerta-descripcion--tachado' : ''}`}>
                    {alerta.descripcion}
                  </p>

                  <div className="alerta-meta">
                    <span className="alerta-crop">
                      {alerta.cropEmoji} {alerta.cropName}
                    </span>
                    <span className="alerta-sep">·</span>
                    <span className="alerta-hora">🕐 {alerta.hora}</span>
                    {!alerta.leida && !resuelta && (
                      <>
                        <span className="alerta-sep">·</span>
                        <span className="alerta-nueva-dot">Nueva</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: action */}
                <div className="alerta-actions">
                  {!resuelta ? (
                    <button
                      className="btn btn-outline alerta-resolver-btn"
                      onClick={() => marcarResuelta(alerta.uid)}
                    >
                      ✓ Resolver
                    </button>
                  ) : (
                    <div className="alerta-resuelta-check">✓</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
