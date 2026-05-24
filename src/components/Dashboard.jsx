import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { cropsData } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard({ selectedCropId, setSelectedCropId }) {
  const currentCrop = cropsData[selectedCropId] || cropsData.tomate;

  // ─── ESTADOS LOCALES DE SIMULACIÓN ───
  const [humedadLocal, setHumedadLocal] = useState(currentCrop.humedad);
  const [irrigatingState, setIrrigatingState] = useState('idle'); // 'idle' | 'connecting' | 'watering' | 'stopping'
  const [duracionManual, setDuracionManual] = useState(15); // 15 | 60 | 1800 (30m) | 3600 (60m)
  const [countdown, setCountdown] = useState(15);
  const [toasts, setToasts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Formulario de Programación
  const [progHora, setProgHora] = useState('06:00');
  const [progMinutos, setProgMinutos] = useState('10');
  const [progDias, setProgDias] = useState(['Lunes', 'Miércoles', 'Viernes']);
  const [infoProgramado, setInfoProgramado] = useState(null);

  const wateringIntervalRef = useRef(null);

  // Sincronizar humedad local cuando cambia de cultivo
  useEffect(() => {
    setHumedadLocal(currentCrop.humedad);
    // Si estaba regando, detener
    if (wateringIntervalRef.current) {
      clearInterval(wateringIntervalRef.current);
    }
    setIrrigatingState('idle');
  }, [selectedCropId, currentCrop]);

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (wateringIntervalRef.current) clearInterval(wateringIntervalRef.current);
    };
  }, []);

  // Agregar toast flotante
  const showToast = (text, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // ─── MANEJADORES DE RIEGO MANUAL ───
  const iniciarRiegoManual = () => {
    if (irrigatingState !== 'idle') return;

    setIrrigatingState('connecting');
    showToast('📡 Conectando con ESP32-SmartValve...', 'info');

    // Simula delay de red IoT
    setTimeout(() => {
      setIrrigatingState('watering');
      setCountdown(duracionManual);
      
      const duracionLabel = 
        duracionManual === 15 ? '15 segundos' :
        duracionManual === 60 ? '60 segundos' :
        duracionManual === 1800 ? '30 minutos' : '60 minutos';
        
      showToast(`💧 Electroválvula abierta. Iniciando riego por ${duracionLabel}.`, 'success');

      // Empezar a subir humedad periódicamente
      wateringIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          // Si el tiempo es corto (segundos), baja de 1 en 1
          if (duracionManual <= 60) {
            if (prev <= 1) {
              detenerRiegoManual(true);
              return 0;
            }
            return prev - 1;
          } else {
            // Si el tiempo es largo (minutos simulados), descontamos 60 segundos (1 minuto simulado) por segundo real
            if (prev <= 60) {
              detenerRiegoManual(true);
              return 0;
            }
            return prev - 60;
          }
        });

        setHumedadLocal(h => {
          // Incrementa humedad gradualmente. A mayor duración, el paso es más pequeño por tick
          const incremento = duracionManual <= 60 ? 1 : 0.5;
          const nueva = Math.min(h + incremento, currentCrop.humedadOptima + 5);
          return Math.round(nueva * 10) / 10;
        });
      }, 1000);
    }, 1500);
  };

  const detenerRiegoManual = (completado = false) => {
    if (wateringIntervalRef.current) {
      clearInterval(wateringIntervalRef.current);
    }

    setIrrigatingState('stopping');
    showToast('📡 Enviando comando de cierre a ESP32...', 'info');

    setTimeout(() => {
      setIrrigatingState('idle');
      
      const duracionLabel = 
        duracionManual === 15 ? '15s' :
        duracionManual === 60 ? '60s' :
        duracionManual === 1800 ? '30m' : '60m';

      if (completado) {
        showToast(`✅ Ciclo de riego de ${duracionLabel} completado correctamente.`, 'success');
      } else {
        showToast('🛑 Riego detenido manualmente por el usuario.', 'warning');
      }

      // Registrar evento en la sesión de forma ficticia
      try {
        const eventoHistorial = {
          id: Date.now(),
          fecha: new Date().toLocaleDateString('es-CO'),
          hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          tipo: 'riego',
          evento: `Riego manual ejecutado — Duración: ${duracionLabel} (${completado ? 'Completado' : 'Interrumpido'})`,
          cultivo: currentCrop.name,
          cropEmoji: currentCrop.emoji,
          valor: `${humedadLocal}% Humedad`,
          icono: '💧'
        };
        // Opcional: Agregar dinámicamente al mockData
        if (!window.mockEventosAdicionales) {
          window.mockEventosAdicionales = [];
        }
        window.mockEventosAdicionales.unshift(eventoHistorial);
      } catch (e) {
        console.error('Error guardando evento de riego:', e);
      }

    }, 1200);
  };

  // ─── PROGRAMACIÓN DE RIEGO ───
  const handleToggleDia = (dia) => {
    setProgDias(prev => 
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const guardarProgramacion = (e) => {
    e.preventDefault();
    if (progDias.length === 0) {
      showToast('⚠️ Selecciona al menos un día para programar el riego.', 'warning');
      return;
    }

    const info = `Lunes a las ${progHora}`; // Resumen simple
    setInfoProgramado({
      hora: progHora,
      duracion: progMinutos,
      dias: progDias
    });

    setShowModal(false);
    showToast(`📅 Riego programado: ${progHora} | ${progMinutos} min | ${progDias.join(', ')}`, 'success');
  };

  // Datos del gráfico (reflejan la humedad dinámica local)
  const chartData = currentCrop.humedadEvolucion.map((d, index, arr) => {
    // Reemplazar el último valor con la humedad local dinámica para que se vea reflejado en la gráfica
    const esUltimo = index === arr.length - 1;
    return {
      time: d.fecha,
      humedad: esUltimo ? humedadLocal : d.valor,
      temp: 24 + (index * 0.5) % 3
    };
  });

  const getHumedadEstado = () => {
    const min = currentCrop.humedadOptima - 5;
    const max = currentCrop.humedadOptima + 8;
    if (humedadLocal < min) return { label: 'CRÍTICA / BAJA', class: 'pill-danger' };
    if (humedadLocal > max) return { label: 'SATURADO', class: 'pill-info' };
    return { label: 'ÓPTIMO', class: 'pill-success' };
  };

  const estadoHumedad = getHumedadEstado();

  return (
    <main className="bento-dashboard content-bg animate-fade">
      
      {/* ─── FLOTANTES TOASTS ─── */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast-card toast-${t.type} animate-slide-right`}>
            <div className="toast-icon">
              {t.type === 'success' && '✅'}
              {t.type === 'info' && '🔄'}
              {t.type === 'warning' && '⚠️'}
            </div>
            <div className="toast-body">
              <span className="toast-text">{t.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Zone Selector & Header */}
      <div className="bento-header">
        <div>
          <h2 className="bento-title">Monitoreo Detallado</h2>
          <div className="bento-subtitle">
            <span className="material-icons-outlined">📍</span>
            <span>{currentCrop.finca} - {currentCrop.municipio}</span>
          </div>
        </div>
        <div className="bento-selector-wrapper">
          <select 
            className="bento-selector" 
            value={selectedCropId} 
            onChange={(e) => setSelectedCropId(e.target.value)}
          >
            {Object.values(cropsData).map((crop) => (
              <option key={crop.id} value={crop.id}>{crop.emoji} {crop.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Status Cards (Bento Style) */}
      <div className="bento-grid-4">
        {/* Humidity */}
        <div className={`glass-card bento-card ${irrigatingState === 'watering' ? 'bento-card--watering' : ''}`}>
          <div className="bento-card-header">
            <div className="bento-icon-bg bg-green">
              <span className={irrigatingState === 'watering' ? 'water-drop-anim' : ''}>💧</span>
            </div>
            <span className={`bento-pill ${estadoHumedad.class}`}>
              {estadoHumedad.label}
            </span>
          </div>
          <div className="bento-card-body">
            <p className="bento-label">Humedad Suelo</p>
            <h3 className="bento-value text-primary">{humedadLocal}<span>%</span></h3>
          </div>
        </div>

        {/* Temperature */}
        <div className="glass-card bento-card">
          <div className="bento-card-header">
            <div className="bento-icon-bg bg-orange">
              <span>🌡️</span>
            </div>
            <span className="bento-pill pill-warning">
              {currentCrop.temperaturaSuelo > 28 ? 'ALTA' : 'NORMAL'}
            </span>
          </div>
          <div className="bento-card-body">
            <p className="bento-label">Temperatura</p>
            <h3 className="bento-value text-primary">{currentCrop.temperaturaSuelo}<span>°C</span></h3>
          </div>
        </div>

        {/* Weather/Rain */}
        <div className="glass-card bento-card">
          <div className="bento-card-header">
            <div className="bento-icon-bg bg-blue">
              <span>🌧️</span>
            </div>
            <span className="bento-pill pill-info">ESTABLE</span>
          </div>
          <div className="bento-card-body">
            <p className="bento-label">Prob. Lluvia</p>
            <h3 className="bento-value text-primary">{currentCrop.clima.lluvia}</h3>
          </div>
        </div>

        {/* Battery */}
        <div className="glass-card bento-card">
          <div className="bento-card-header">
            <div className="bento-icon-bg bg-purple">
              <span>🔋</span>
            </div>
            <span className="bento-pill pill-success">CARGANDO</span>
          </div>
          <div className="bento-card-body">
            <p className="bento-label">Batería ESP32</p>
            <h3 className="bento-value text-primary">{currentCrop.dispositivo.bateria}<span>%</span></h3>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="glass-card bento-chart-section">
        <div className="bento-chart-header">
          <div>
            <h3 className="bento-chart-title">Evolución Histórica (7 días)</h3>
            <p className="bento-chart-desc">Seguimiento de humedad vs temperatura ambiente</p>
          </div>
          <div className="bento-chart-legends">
            <div className="legend-item"><span className="dot dot-green"></span>Humedad</div>
            <div className="legend-item"><span className="dot dot-orange"></span>Temperatura</div>
          </div>
        </div>
        <div className="bento-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#46b464" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#46b464" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
              <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="humedad" stroke="#46b464" strokeWidth={3} fillOpacity={1} fill="url(#colorHum)" />
              <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bento-grid-2">
        {/* Sensor Health Card */}
        <div className="glass-card bento-health">
          <h3 className="bento-health-title">📡 Estado del Dispositivo</h3>
          <div className="bento-health-grid">
            <div className="health-item">
              <p className="health-label">BATERÍA</p>
              <div className="health-val-row">
                <span className="health-icon text-primary">🔋</span>
                <div>
                  <p className="health-val">{currentCrop.dispositivo.bateria}%</p>
                  <p className="health-sub">Carga solar activa</p>
                </div>
              </div>
            </div>
            <div className="health-item">
              <p className="health-label">SEÑAL IoT</p>
              <div className="health-val-row">
                <span className="health-icon text-primary">📶</span>
                <div>
                  <p className="health-val">{currentCrop.dispositivo.senales} dBm</p>
                  <p className="health-sub">Excelente</p>
                </div>
              </div>
            </div>
            <div className="health-item">
              <p className="health-label">SINCRONIZACIÓN</p>
              <div className="health-val-row">
                <span className="health-icon text-primary">🔄</span>
                <div>
                  <p className="health-val">Hace 2m</p>
                  <p className="health-sub">Intervalo: 5 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Card (Bento Action) */}
        <div className={`glass-card bento-action ${irrigatingState === 'watering' ? 'bento-action--watering' : ''}`}>
          <div>
            <h3 className="bento-action-title">Acción de Riego</h3>
            <p className="bento-action-desc">
              {irrigatingState === 'watering' && (
                duracionManual <= 60 
                  ? `💦 REGANDO AHORA — Deteniendo automáticamente en ${countdown}s`
                  : `💦 REGANDO AHORA — Deteniendo automáticamente en ${countdown / 60}m`
              )}
              {irrigatingState === 'connecting' && `📡 Conectando y validando flujo de electroválvula...`}
              {irrigatingState === 'stopping' && `🛑 Apagando y cerrando electroválvulas...`}
              {irrigatingState === 'idle' && (
                humedadLocal < currentCrop.humedadOptima 
                  ? 'El sistema sugiere riego preventivo debido a la humedad actual.'
                  : 'Humedad óptima. No se requiere riego en este momento.'
              )}
            </p>

            {/* Selector de duración para riego manual */}
            {irrigatingState === 'idle' && (
              <div className="manual-duration-wrapper">
                <label className="manual-duration-label">⏳ Seleccionar Duración:</label>
                <select 
                  value={duracionManual}
                  onChange={(e) => setDuracionManual(Number(e.target.value))}
                  className="manual-duration-select"
                >
                  <option value={15}>⚡ 15 segundos</option>
                  <option value={60}>⏱️ 60 segundos</option>
                  <option value={1800}>💧 30 minutos (Acelerado)</option>
                  <option value={3600}>🌧️ 60 minutos (Acelerado)</option>
                </select>
              </div>
            )}

            {infoProgramado && (
              <div className="action-program-badge">
                📅 Riego programado: <strong>{infoProgramado.hora}</strong> ({infoProgramado.duracion} min) los <strong>{infoProgramado.dias.join(', ')}</strong>
              </div>
            )}
          </div>
          
          <div className="bento-action-buttons">
            {/* Activar Riego Manual */}
            {irrigatingState === 'idle' && (
              <button onClick={iniciarRiegoManual} className="btn btn-primary w-full justify-center py-3">
                💧 Activar Riego Manual
              </button>
            )}

            {irrigatingState === 'connecting' && (
              <button disabled className="btn btn-primary w-full justify-center py-3" style={{ cursor: 'wait', opacity: 0.8 }}>
                <span className="btn-spinner"></span> Iniciando Riego...
              </button>
            )}

            {irrigatingState === 'watering' && (
              <button onClick={() => detenerRiegoManual(false)} className="btn btn-danger w-full justify-center py-3 pulse-danger-btn">
                🛑 Detener Riego ({duracionManual <= 60 ? `${countdown}s` : `${countdown / 60}m`})
              </button>
            )}

            {irrigatingState === 'stopping' && (
              <button disabled className="btn btn-secondary w-full justify-center py-3" style={{ cursor: 'wait', opacity: 0.8 }}>
                <span className="btn-spinner"></span> Cerrando Válvula...
              </button>
            )}

            {/* Programar Riego */}
            <button onClick={() => setShowModal(true)} className="btn btn-outline w-full justify-center py-3">
              ⏰ Programar Riego
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODAL DE PROGRAMACIÓN DE RIEGO ─── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-container animate-scale-up">
            <div className="modal-header">
              <h3 className="modal-title">⏰ Programar Riego Inteligente</h3>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">✕</button>
            </div>
            
            <form onSubmit={guardarProgramacion} className="modal-form">
              <p className="modal-desc">
                Programa riegos recurrentes y el sensor activará automáticamente la válvula según los niveles de humedad óptimos.
              </p>

              {/* Días de la semana */}
              <div className="modal-field">
                <label className="modal-label">Seleccione los días de riego</label>
                <div className="days-picker">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => {
                    const selected = progDias.includes(dia);
                    return (
                      <button
                        type="button"
                        key={dia}
                        onClick={() => handleToggleDia(dia)}
                        className={`day-btn ${selected ? 'day-btn--selected' : ''}`}
                      >
                        {dia.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="modal-row">
                {/* Hora de Inicio */}
                <div className="modal-field">
                  <label className="modal-label">Hora de inicio</label>
                  <input 
                    type="time" 
                    value={progHora} 
                    onChange={e => setProgHora(e.target.value)} 
                    className="modal-input" 
                    required 
                  />
                </div>

                {/* Duración */}
                <div className="modal-field">
                  <label className="modal-label">Duración del Riego</label>
                  <select 
                    value={progMinutos} 
                    onChange={e => setProgMinutos(e.target.value)} 
                    className="modal-select"
                  >
                    <option value="5">5 Minutos (~50 Litros)</option>
                    <option value="10">10 Minutos (~100 Litros)</option>
                    <option value="15">15 Minutos (~150 Litros)</option>
                    <option value="20">20 Minutos (~200 Litros)</option>
                    <option value="30">30 Minutos (~300 Litros)</option>
                  </select>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  ✓ Confirmar Programación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}

