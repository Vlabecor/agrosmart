import React, { useState } from 'react';
import useAgroStore from '../store/useAgroStore';
import { cropsData } from '../data/mockData';
import './ProfileView.css';

const PLAN_LABELS = {
  free: { label: 'Plan Gratuito', color: '#94a3b8' },
  pro: { label: 'Plan Pro', color: '#46b464' },
  premium: { label: 'Plan Premium ⭐', color: '#f59e0b' },
};

export default function ProfileView({ onNavigate }) {
  const { user, selectedCropId, logout } = useAgroStore();
  const [activeSection, setActiveSection] = useState('overview');
  const [irrigationEnabled, setIrrigationEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [tempUnit, setTempUnit] = useState('C');

  const planKey = 'premium';
  const plan = PLAN_LABELS[planKey];

  const userName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Agricultor');
  const userEmail = user?.email || 'agricultor@agrosmart.co';
  const currentCrop = cropsData[selectedCropId] || cropsData.tomate;

  const navItems = [
    { id: 'overview',   icon: '👤', label: 'Mi Perfil' },
    { id: 'fincas',     icon: '🏡', label: 'Mis Fincas' },
    { id: 'cultivos',   icon: '🌱', label: 'Mis Cultivos' },
    { id: 'config',     icon: '⚙️', label: 'Configuración' },
    { id: 'ayuda',      icon: '❓', label: 'Ayuda' },
  ];

  const stats = [
    { label: 'Fincas Registradas',  value: '2',  icon: '🏡' },
    { label: 'Cultivos Activos',     value: '4',  icon: '🌱' },
    { label: 'Sensores Conectados',  value: '3',  icon: '📡' },
    { label: 'Días Activo',          value: '47', icon: '📅' },
  ];

  const fincas = [
    { name: 'Finca El Progreso',   region: 'Cundinamarca', crops: 2, sensors: 2, status: 'active' },
    { name: 'Finca La Esperanza',  region: 'Boyacá',       crops: 2, sensors: 1, status: 'active' },
  ];

  const historyEvents = [
    { date: 'Hoy 08:12',      event: 'Riego automático activado',  crop: currentCrop.name,  icon: '💧', color: 'green' },
    { date: 'Ayer 16:30',     event: 'Alerta: Humedad baja',       crop: currentCrop.name,  icon: '⚠️', color: 'orange' },
    { date: 'Hace 2 días',    event: 'Lluvia registrada (14mm)',   crop: currentCrop.name,  icon: '🌧️', color: 'blue' },
    { date: 'Hace 3 días',    event: 'Sensor sincronizado',        crop: currentCrop.name,  icon: '🔄', color: 'green' },
    { date: 'Hace 5 días',    event: 'Reporte mensual generado',   crop: 'Todos',            icon: '📄', color: 'purple' },
  ];

  return (
    <main className="profile-view content-bg animate-fade">

      {/* ── Hero / Cabecera ─────────────────────────────────── */}
      <div className="profile-hero glass-card">
        <div className="profile-avatar-ring">
          <div className="profile-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="profile-avatar-badge">✓</span>
        </div>
        <div className="profile-hero-info">
          <h1 className="profile-name">{userName}</h1>
          <p className="profile-email">{userEmail}</p>
          <span className="profile-plan-badge" style={{ borderColor: plan.color, color: plan.color }}>
            {plan.label}
          </span>
        </div>
        <div className="profile-hero-actions">
          <button className="btn btn-primary profile-edit-btn">✏️ Editar Perfil</button>
          <button className="btn btn-outline profile-share-btn">📤 Compartir</button>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────── */}
      <div className="profile-stats-row">
        {stats.map((s, i) => (
          <div key={i} className="glass-card profile-stat-card">
            <span className="profile-stat-icon">{s.icon}</span>
            <div>
              <p className="profile-stat-value">{s.value}</p>
              <p className="profile-stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Body Grid ────────────────────────────────────────── */}
      <div className="profile-body-grid">

        {/* Left: Nav menu */}
        <div className="glass-card profile-nav-card">
          <h3 className="profile-nav-title">Secciones</h3>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`profile-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="profile-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              <span className="profile-nav-arrow">›</span>
            </button>
          ))}
          <div className="profile-nav-divider" />
          <button className="profile-nav-item profile-logout-btn" onClick={logout}>
            <span className="profile-nav-icon">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Right: Dynamic content panel */}
        <div className="profile-panel">

          {/* ── Overview ──────────────────────── */}
          {activeSection === 'overview' && (
            <div className="profile-overview animate-fade">
              <div className="glass-card profile-info-card">
                <h3 className="profile-section-title">📋 Información Personal</h3>
                <div className="profile-info-grid">
                  <div className="profile-info-row">
                    <span className="profile-info-label">Nombre</span>
                    <span className="profile-info-val">{userName}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Email</span>
                    <span className="profile-info-val">{userEmail}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Rol</span>
                    <span className="profile-info-val">Agricultor / Propietario</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Región</span>
                    <span className="profile-info-val">Cundinamarca, Colombia</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Plan</span>
                    <span className="profile-info-val" style={{ color: plan.color }}>{plan.label}</span>
                  </div>
                </div>
              </div>
              <div className="glass-card profile-history-card">
                <h3 className="profile-section-title">📜 Actividad Reciente</h3>
                <div className="profile-history-list">
                  {historyEvents.map((ev, i) => (
                    <div key={i} className="history-event">
                      <div className={`history-icon-wrap history-${ev.color}`}>
                        {ev.icon}
                      </div>
                      <div className="history-details">
                        <p className="history-event-name">{ev.event}</p>
                        <p className="history-meta">{ev.crop} · {ev.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Fincas ────────────────────────── */}
          {activeSection === 'fincas' && (
            <div className="animate-fade">
              <div className="glass-card profile-info-card">
                <div className="profile-section-header">
                  <h3 className="profile-section-title">🏡 Mis Fincas</h3>
                  <button className="btn btn-primary btn-sm">+ Agregar</button>
                </div>
                <div className="finca-list">
                  {fincas.map((f, i) => (
                    <div key={i} className="finca-item">
                      <div className="finca-icon-wrap">🏡</div>
                      <div className="finca-details">
                        <p className="finca-name">{f.name}</p>
                        <p className="finca-meta">{f.region} · {f.crops} cultivos · {f.sensors} sensores</p>
                      </div>
                      <span className="finca-status-dot" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Map placeholder */}
              <div className="glass-card profile-map-card">
                <h3 className="profile-section-title">📍 Ubicación de Fincas</h3>
                <div className="profile-map-placeholder">
                  <span className="profile-map-pin">📍</span>
                  <p>Cundinamarca</p>
                  <span className="profile-map-pin pin-2">📍</span>
                  <p style={{ bottom: '35%', left: '55%', position: 'absolute', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Boyacá</p>
                  <div className="radar-pulse-sm" />
                </div>
              </div>
            </div>
          )}

          {/* ── Cultivos ──────────────────────── */}
          {activeSection === 'cultivos' && (
            <div className="glass-card profile-info-card animate-fade">
              <div className="profile-section-header">
                <h3 className="profile-section-title">🌱 Mis Cultivos Activos</h3>
                <button className="btn btn-primary btn-sm">+ Nuevo</button>
              </div>
              <div className="cultivos-bento-grid">
                {Object.values(cropsData).map(crop => (
                  <div key={crop.id} className={`cultivo-bento-card ${selectedCropId === crop.id ? 'selected' : ''}`}>
                    <div className="cultivo-emoji">{crop.emoji}</div>
                    <div className="cultivo-info">
                      <p className="cultivo-name">{crop.name}</p>
                      <p className="cultivo-finca">{crop.finca}</p>
                    </div>
                    <div className="cultivo-metrics">
                      <span className="cultivo-metric">💧 {crop.humedad}%</span>
                      <span className="cultivo-metric">🌡️ {crop.temperaturaSuelo}°C</span>
                    </div>
                    {selectedCropId === crop.id && (
                      <span className="cultivo-active-badge">ACTIVO</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Config ────────────────────────── */}
          {activeSection === 'config' && (
            <div className="animate-fade">
              <div className="glass-card profile-info-card">
                <h3 className="profile-section-title">⚙️ Configuración del Sistema</h3>
                <div className="config-list">
                  <div className="config-item">
                    <div>
                      <p className="config-label">Riego Automático</p>
                      <p className="config-desc">Activar riego cuando la humedad baje del umbral</p>
                    </div>
                    <button
                      className={`config-toggle ${irrigationEnabled ? 'on' : ''}`}
                      onClick={() => setIrrigationEnabled(!irrigationEnabled)}
                    >
                      <span className="toggle-knob" />
                    </button>
                  </div>
                  <div className="config-item">
                    <div>
                      <p className="config-label">Alertas SMS</p>
                      <p className="config-desc">Notificaciones a tu celular para eventos críticos</p>
                    </div>
                    <button
                      className={`config-toggle ${alertsEnabled ? 'on' : ''}`}
                      onClick={() => setAlertsEnabled(!alertsEnabled)}
                    >
                      <span className="toggle-knob" />
                    </button>
                  </div>
                  <div className="config-item">
                    <div>
                      <p className="config-label">Unidad de Temperatura</p>
                      <p className="config-desc">Celsius o Fahrenheit</p>
                    </div>
                    <div className="config-unit-switch">
                      <button
                        className={tempUnit === 'C' ? 'active' : ''}
                        onClick={() => setTempUnit('C')}
                      >°C</button>
                      <button
                        className={tempUnit === 'F' ? 'active' : ''}
                        onClick={() => setTempUnit('F')}
                      >°F</button>
                    </div>
                  </div>
                  <div className="config-item">
                    <div>
                      <p className="config-label">Umbral Batería Crítica</p>
                      <p className="config-desc">Alerta cuando la batería baje de este porcentaje</p>
                    </div>
                    <div className="config-input-wrap">
                      <input type="number" defaultValue="20" min="5" max="50" className="config-input" />
                      <span>%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-card profile-info-card">
                <h3 className="profile-section-title">🔔 Notificaciones</h3>
                <div className="config-list">
                  {[
                    { label: 'Alertas de humedad',   desc: 'Cuando supere o baje umbrales' },
                    { label: 'Reportes semanales',   desc: 'Resumen los lunes a las 8am' },
                    { label: 'Eventos de clima',     desc: 'Lluvias o heladas esperadas' },
                  ].map((n, i) => (
                    <div key={i} className="config-item">
                      <div>
                        <p className="config-label">{n.label}</p>
                        <p className="config-desc">{n.desc}</p>
                      </div>
                      <button className="config-toggle on">
                        <span className="toggle-knob" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Ayuda ─────────────────────────── */}
          {activeSection === 'ayuda' && (
            <div className="glass-card profile-info-card animate-fade">
              <h3 className="profile-section-title">❓ Centro de Ayuda</h3>
              <div className="ayuda-list">
                {[
                  { q: '¿Cómo conectar mi sensor ESP32?',        icon: '📡' },
                  { q: '¿Cómo configurar el riego automático?',  icon: '💧' },
                  { q: '¿Cómo generar un reporte PDF?',          icon: '📄' },
                  { q: '¿Qué significa la alerta de batería?',   icon: '🔋' },
                  { q: 'Contactar soporte técnico',               icon: '💬' },
                ].map((item, i) => (
                  <div key={i} className="ayuda-item">
                    <span className="ayuda-icon">{item.icon}</span>
                    <span className="ayuda-q">{item.q}</span>
                    <span className="ayuda-arrow">›</span>
                  </div>
                ))}
              </div>
              <div className="ayuda-contact-card">
                <p className="ayuda-contact-title">📞 Soporte Directo</p>
                <p className="ayuda-contact-sub">Lunes a Viernes · 8am – 6pm</p>
                <a href="mailto:soporte@agrosmart.co" className="btn btn-primary ayuda-contact-btn">
                  Enviar Mensaje
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
