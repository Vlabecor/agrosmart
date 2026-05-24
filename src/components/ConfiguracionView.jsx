import React, { useState } from 'react';
import { cropsData } from '../data/mockData';
import './ConfiguracionView.css';

// Tabs: 'sensores' | 'umbrales' | 'notificaciones'
const TABS = [
  { key: 'sensores', label: '📡 Sensores' },
  { key: 'umbrales', label: '📊 Umbrales' },
  { key: 'notificaciones', label: '🔔 Notificaciones' },
];

export default function ConfiguracionView({ selectedCropId }) {
  const [activeTab, setActiveTab] = useState('sensores');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSensor, setNewSensor] = useState({ nombre: '', tipo: 'ESP32-S3', finca: '', cultivo: 'tomate' });
  const [umbrales, setUmbrales] = useState(
    Object.fromEntries(Object.entries(cropsData).map(([id, c]) => [
      id, { humedadMin: c.humedadOptima - 10, humedadMax: c.humedadOptima + 10, tempCritica: 35 }
    ]))
  );
  const [notif, setNotif] = useState({
    sms: true, email: true, push: false, whatsapp: false,
    telefono: '+57 300 123 4567', correo: 'agricultor@agrosmart.co',
    silencioDesde: '22:00', silencioHasta: '06:00'
  });
  const [guardado, setGuardado] = useState(false);

  const sensores = Object.values(cropsData).map(c => ({
    id: c.id, nombre: c.dispositivo.nombre, cultivo: c.name, emoji: c.emoji,
    finca: c.finca, bateria: c.dispositivo.bateria, senales: c.dispositivo.senales,
    estado: c.dispositivo.estado, firmware: c.dispositivo.firmware,
  }));

  const handleGuardar = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const getBatteryColor = (pct) => pct >= 60 ? '#46b464' : pct >= 30 ? '#f97316' : '#ef4444';
  const getSignalLabel = (dbm) => dbm > -70 ? 'Excelente' : dbm > -80 ? 'Buena' : 'Débil';
  const getSignalColor = (dbm) => dbm > -70 ? '#46b464' : dbm > -80 ? '#f97316' : '#ef4444';

  const cropActual = cropsData[selectedCropId] || cropsData.tomate;
  const umbralCropActual = umbrales[selectedCropId] || umbrales.tomate;

  return (
    <main className="config-view content-bg animate-fade">
      {/* Header */}
      <div className="config-header">
        <div>
          <h2 className="config-title">⚙️ Configuración del Sistema</h2>
          <p className="config-subtitle">Gestión de sensores, umbrales y notificaciones</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="config-tabs">
        <div className="config-tab-list">
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              className={`config-tab-btn ${activeTab === tab.key ? 'config-tab-btn--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          <div
            className="config-tab-indicator"
            style={{ transform: `translateX(${TABS.findIndex(t => t.key === activeTab) * 100}%)`, width: `${100 / TABS.length}%` }}
          />
        </div>
      </div>

      {/* ── Tab: SENSORES ── */}
      {activeTab === 'sensores' && (
        <div className="config-section">
          <div className="config-section-top">
            <h3 className="config-section-title">Dispositivos Registrados ({sensores.length})</h3>
            <button className="btn btn-primary config-add-btn" onClick={() => setShowAddForm(v => !v)}>
              {showAddForm ? '✕ Cancelar' : '+ Agregar Sensor'}
            </button>
          </div>

          {/* Add form */}
          {showAddForm && (
            <div className="glass-card config-add-form">
              <h4 className="config-form-title">Nuevo Dispositivo ESP32</h4>
              <div className="config-form-grid">
                <div className="config-field">
                  <label className="config-label">Nombre del sensor</label>
                  <input className="config-input" value={newSensor.nombre} onChange={e => setNewSensor(p => ({...p, nombre: e.target.value}))} placeholder="ESP32-MiCultivo-01" />
                </div>
                <div className="config-field">
                  <label className="config-label">Tipo de dispositivo</label>
                  <select className="config-select" value={newSensor.tipo} onChange={e => setNewSensor(p => ({...p, tipo: e.target.value}))}>
                    <option>ESP32-S3</option>
                    <option>ESP32-C3</option>
                    <option>ESP32</option>
                  </select>
                </div>
                <div className="config-field">
                  <label className="config-label">Nombre de la finca</label>
                  <input className="config-input" value={newSensor.finca} onChange={e => setNewSensor(p => ({...p, finca: e.target.value}))} placeholder="Finca El Progreso" />
                </div>
                <div className="config-field">
                  <label className="config-label">Cultivo asignado</label>
                  <select className="config-select" value={newSensor.cultivo} onChange={e => setNewSensor(p => ({...p, cultivo: e.target.value}))}>
                    {Object.values(cropsData).map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" style={{marginTop:'0.75rem'}} onClick={() => setShowAddForm(false)}>✓ Registrar Sensor</button>
            </div>
          )}

          {/* Sensor table */}
          <div className="glass-card config-table-card">
            <div className="config-table-scroll">
              <table className="config-table">
                <thead>
                  <tr>
                    <th>Dispositivo</th>
                    <th>Cultivo</th>
                    <th>Batería</th>
                    <th>Señal</th>
                    <th>Estado</th>
                    <th>Firmware</th>
                  </tr>
                </thead>
                <tbody>
                  {sensores.map(s => (
                    <tr key={s.id} className="config-table-row">
                      <td>
                        <div className="config-dev-name">{s.nombre}</div>
                        <div className="config-dev-finca">{s.finca}</div>
                      </td>
                      <td><span className="config-crop-cell">{s.emoji} {s.cultivo}</span></td>
                      <td>
                        <div className="config-battery-wrap">
                          <span style={{color: getBatteryColor(s.bateria), fontWeight:600, fontSize:'0.85rem'}}>{s.bateria}%</span>
                          <div className="config-battery-bar">
                            <div className="config-battery-fill" style={{width:`${s.bateria}%`, background: getBatteryColor(s.bateria)}} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{color: getSignalColor(s.senales), fontSize:'0.82rem', fontWeight:500}}>
                          {getSignalLabel(s.senales)} ({s.senales} dBm)
                        </span>
                      </td>
                      <td>
                        <span className="config-status-badge config-status--ok">● {s.estado}</span>
                      </td>
                      <td><span className="config-firmware">{s.firmware}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: UMBRALES ── */}
      {activeTab === 'umbrales' && (
        <div className="config-section">
          <div className="config-section-top">
            <h3 className="config-section-title">Umbrales para {cropActual.emoji} {cropActual.name}</h3>
          </div>
          <div className="glass-card config-umbrales-card">
            <div className="config-umbral-group">
              <label className="config-label">💧 Humedad Mínima: <strong style={{color:'var(--primary)'}}>{umbralCropActual.humedadMin}%</strong></label>
              <input
                type="range" min={10} max={60} step={1}
                value={umbralCropActual.humedadMin}
                className="config-range config-range--green"
                onChange={e => setUmbrales(p => ({...p, [selectedCropId||'tomate']: {...p[selectedCropId||'tomate'], humedadMin: Number(e.target.value)}}))}
              />
              <div className="config-range-labels"><span>10%</span><span>60%</span></div>
            </div>
            <div className="config-umbral-group">
              <label className="config-label">💧 Humedad Máxima: <strong style={{color:'var(--primary)'}}>{umbralCropActual.humedadMax}%</strong></label>
              <input
                type="range" min={20} max={95} step={1}
                value={umbralCropActual.humedadMax}
                className="config-range config-range--blue"
                onChange={e => setUmbrales(p => ({...p, [selectedCropId||'tomate']: {...p[selectedCropId||'tomate'], humedadMax: Number(e.target.value)}}))}
              />
              <div className="config-range-labels"><span>20%</span><span>95%</span></div>
            </div>
            <div className="config-umbral-group">
              <label className="config-label">🌡️ Temperatura Crítica del Suelo</label>
              <input
                type="number" min={20} max={50}
                value={umbralCropActual.tempCritica}
                className="config-input config-input--small"
                onChange={e => setUmbrales(p => ({...p, [selectedCropId||'tomate']: {...p[selectedCropId||'tomate'], tempCritica: Number(e.target.value)}}))}
              />
              <span className="config-unit">°C — Por encima se activa alerta crítica</span>
            </div>
            <button className={`btn btn-primary config-save-btn ${guardado ? 'config-save-btn--ok' : ''}`} onClick={handleGuardar}>
              {guardado ? '✓ Cambios Guardados' : '💾 Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: NOTIFICACIONES ── */}
      {activeTab === 'notificaciones' && (
        <div className="config-section">
          <h3 className="config-section-title">Canales de Notificación</h3>
          <div className="glass-card config-notif-card">
            <div className="config-notif-toggles">
              {[['sms','📱 SMS'],['email','📧 Email'],['push','🔔 Push App'],['whatsapp','💬 WhatsApp']].map(([key,label]) => (
                <div key={key} className="config-toggle-row">
                  <span className="config-toggle-label">{label}</span>
                  <label className="config-toggle">
                    <input type="checkbox" checked={notif[key]} onChange={e => setNotif(p => ({...p, [key]: e.target.checked}))} />
                    <span className="config-toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
            <hr className="config-divider" />
            <div className="config-form-grid">
              <div className="config-field">
                <label className="config-label">Teléfono (SMS/WhatsApp)</label>
                <input className="config-input" value={notif.telefono} onChange={e => setNotif(p => ({...p, telefono: e.target.value}))} />
              </div>
              <div className="config-field">
                <label className="config-label">Correo electrónico</label>
                <input className="config-input" type="email" value={notif.correo} onChange={e => setNotif(p => ({...p, correo: e.target.value}))} />
              </div>
              <div className="config-field">
                <label className="config-label">🌙 Silencio desde</label>
                <input className="config-input" type="time" value={notif.silencioDesde} onChange={e => setNotif(p => ({...p, silencioDesde: e.target.value}))} />
              </div>
              <div className="config-field">
                <label className="config-label">☀️ Silencio hasta</label>
                <input className="config-input" type="time" value={notif.silencioHasta} onChange={e => setNotif(p => ({...p, silencioHasta: e.target.value}))} />
              </div>
            </div>
            <button className={`btn btn-primary config-save-btn ${guardado ? 'config-save-btn--ok' : ''}`} onClick={handleGuardar}>
              {guardado ? '✓ Cambios Guardados' : '💾 Guardar Configuración'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
