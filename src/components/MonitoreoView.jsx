import React, { useEffect, useRef, useState } from 'react';
import { cropsData } from '../data/mockData';
import './MonitoreoView.css';

// Coordenadas aproximadas de cada finca (Colombia)
const fincaLocations = {
  tomate:     { lat: 5.638,  lng: -73.525, name: 'Finca El Progreso',   municipio: 'Villa de Leyva' },
  cafe:       { lat: 5.000,  lng: -75.619, name: 'Hacienda La Palma',   municipio: 'Chinchiná' },
  papa:       { lat: 6.470,  lng: -72.416, name: 'Alturas del Cocuy',   municipio: 'Güicán' },
  aguacate:   { lat: 5.155,  lng: -74.996, name: 'Finca Villa Lorena',  municipio: 'Fresno' },
  arroz:      { lat: 7.088,  lng: -70.757, name: 'Llanos de Arauca',    municipio: 'Arauca' },
  banano:     { lat: 7.766,  lng: -76.658, name: 'Valle del Urabá',     municipio: 'Carepa' },
  maiz:       { lat: 5.338,  lng: -72.397, name: 'Llanos de Casanare',  municipio: 'Yopal' },
  cacao:      { lat: 7.237,  lng: -73.225, name: 'Finca Bellavista',    municipio: 'Lebrija' },
  cana:       { lat: 3.522,  lng: -76.295, name: 'Hacienda San Jerónimo', municipio: 'Palmira' },
  hortalizas: { lat: 4.906,  lng: -73.944, name: 'Finca Los Alerces',   municipio: 'Sopó' },
};

function getBatteryColor(pct) {
  if (pct >= 60) return '#46b464';
  if (pct >= 30) return '#f97316';
  return '#ef4444';
}

function getStatusColor(humedad, optimo) {
  const diff = humedad - optimo;
  if (diff < -15) return 'critica';
  if (diff < -5)  return 'warning';
  if (diff > 15)  return 'warning';
  return 'optimo';
}

export default function MonitoreoView({ selectedCropId, setSelectedCropId }) {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const markersRef  = useRef([]);
  const [activeCrop, setActiveCrop] = useState(selectedCropId || 'tomate');

  // Mount Leaflet map
  useEffect(() => {
    if (mapInstance.current) return; // already initialized

    // Dynamically import leaflet to avoid SSR issues
    import('leaflet').then(L => {
      const Lmod = L.default || L;

      // Fix default icon path for Vite
      delete Lmod.Icon.Default.prototype._getIconUrl;
      Lmod.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = Lmod.map(mapRef.current, {
        center: [5.0, -73.5],
        zoom: 6,
        zoomControl: true,
        attributionControl: false,
      });

      // Dark tile layer
      Lmod.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 18,
      }).addTo(map);

      // Add markers for each finca
      Object.entries(fincaLocations).forEach(([cropId, loc]) => {
        const crop   = cropsData[cropId];
        const status = getStatusColor(crop.humedad, crop.humedadOptima);
        const color  = status === 'critica' ? '#ef4444' : status === 'warning' ? '#f97316' : '#46b464';

        const icon = Lmod.divIcon({
          className: '',
          html: `<div class="map-marker-pin" style="border-color:${color};box-shadow:0 0 12px ${color}40">
                   <span style="font-size:1.1rem">${crop.emoji}</span>
                 </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -44],
        });

        const marker = Lmod.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="map-popup">
              <strong>${crop.emoji} ${crop.name}</strong><br/>
              <span style="color:#94a3b8;font-size:0.8rem">${loc.name}</span><br/><br/>
              💧 ${crop.humedad}% humedad<br/>
              🌡️ ${crop.temperaturaSuelo}°C suelo<br/>
              🔋 ${crop.dispositivo.bateria}% batería
            </div>
          `);

        marker.on('click', () => setActiveCrop(cropId));
        markersRef.current.push(marker);
      });

      mapInstance.current = map;
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Fly to selected finca
  useEffect(() => {
    if (!mapInstance.current || !fincaLocations[activeCrop]) return;
    const { lat, lng } = fincaLocations[activeCrop];
    import('leaflet').then(L => {
      mapInstance.current.flyTo([lat, lng], 9, { duration: 1.2 });
    });
  }, [activeCrop]);

  const allSensors = Object.values(cropsData).map(crop => ({
    id:          crop.id,
    nombre:      crop.dispositivo.nombre,
    cultivo:     crop.name,
    emoji:       crop.emoji,
    finca:       crop.finca,
    bateria:     crop.dispositivo.bateria,
    senales:     crop.dispositivo.senales,
    estado:      crop.dispositivo.estado,
    firmware:    crop.dispositivo.firmware,
    humedad:     crop.humedad,
    humedadOpt:  crop.humedadOptima,
    tempSuelo:   crop.temperaturaSuelo,
    statusClass: getStatusColor(crop.humedad, crop.humedadOptima),
  }));

  const activeCropData = cropsData[activeCrop] || cropsData.tomate;

  return (
    <main className="monitoreo-view content-bg animate-fade">

      {/* Header */}
      <div className="monitoreo-header">
        <div>
          <h2 className="monitoreo-title">📡 Monitoreo Global</h2>
          <p className="monitoreo-subtitle">
            {allSensors.length} nodos activos · Colombia
          </p>
        </div>
        <div className="monitoreo-stats-row">
          <div className="monitoreo-stat">
            <span className="monitoreo-stat-val">{allSensors.filter(s => s.statusClass === 'optimo').length}</span>
            <span className="monitoreo-stat-label">Óptimos</span>
          </div>
          <div className="monitoreo-stat warning">
            <span className="monitoreo-stat-val">{allSensors.filter(s => s.statusClass === 'warning').length}</span>
            <span className="monitoreo-stat-label">Advertencia</span>
          </div>
          <div className="monitoreo-stat critica">
            <span className="monitoreo-stat-val">{allSensors.filter(s => s.statusClass === 'critica').length}</span>
            <span className="monitoreo-stat-label">Críticos</span>
          </div>
        </div>
      </div>

      {/* Map + Side Panel */}
      <div className="monitoreo-body">

        {/* MAP */}
        <div className="glass-card monitoreo-map-card">
          <div ref={mapRef} className="monitoreo-map" />
          <div className="map-legend">
            <span className="map-legend-item optimo">🟢 Óptimo</span>
            <span className="map-legend-item warning">🟠 Advertencia</span>
            <span className="map-legend-item critica">🔴 Crítico</span>
          </div>
        </div>

        {/* Sensor list */}
        <div className="monitoreo-side">
          <h3 className="monitoreo-side-title">Nodos Activos</h3>
          <div className="sensor-list">
            {allSensors.map(sensor => (
              <button
                key={sensor.id}
                className={`sensor-card ${activeCrop === sensor.id ? 'active' : ''} ${sensor.statusClass}`}
                onClick={() => setActiveCrop(sensor.id)}
              >
                <div className="sensor-card-top">
                  <span className="sensor-emoji">{sensor.emoji}</span>
                  <div className="sensor-info">
                    <p className="sensor-name">{sensor.cultivo}</p>
                    <p className="sensor-finca">{sensor.finca}</p>
                  </div>
                  <span className={`sensor-status-dot ${sensor.statusClass}`} />
                </div>
                <div className="sensor-metrics">
                  <span>💧 {sensor.humedad}%</span>
                  <span>🌡️ {sensor.tempSuelo}°C</span>
                  <span style={{ color: getBatteryColor(sensor.bateria) }}>🔋 {sensor.bateria}%</span>
                </div>
                <div className="sensor-battery-bar">
                  <div
                    className="sensor-battery-fill"
                    style={{ width: `${sensor.bateria}%`, background: getBatteryColor(sensor.bateria) }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Detail Card */}
      <div className="glass-card monitoreo-detail">
        <div className="monitoreo-detail-header">
          <span className="monitoreo-detail-emoji">{activeCropData.emoji}</span>
          <div>
            <h3 className="monitoreo-detail-title">{activeCropData.name} — {activeCropData.finca}</h3>
            <p className="monitoreo-detail-sub">{activeCropData.municipio} · {activeCropData.altitud}</p>
          </div>
          <span className={`monitoreo-detail-badge ${getStatusColor(activeCropData.humedad, activeCropData.humedadOptima)}`}>
            {getStatusColor(activeCropData.humedad, activeCropData.humedadOptima).toUpperCase()}
          </span>
        </div>
        <div className="monitoreo-detail-grid">
          <div className="detail-item">
            <p className="detail-label">HUMEDAD SUELO</p>
            <p className="detail-val">{activeCropData.humedad}% <span className="detail-opt">(óptimo {activeCropData.humedadOptima}%)</span></p>
          </div>
          <div className="detail-item">
            <p className="detail-label">TEMPERATURA SUELO</p>
            <p className="detail-val">{activeCropData.temperaturaSuelo}°C</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">DISPOSITIVO</p>
            <p className="detail-val">{activeCropData.dispositivo.nombre}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">SEÑAL IoT</p>
            <p className="detail-val">{activeCropData.dispositivo.senales} dBm</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">BATERÍA</p>
            <p className="detail-val" style={{ color: getBatteryColor(activeCropData.dispositivo.bateria) }}>
              {activeCropData.dispositivo.bateria}%
            </p>
          </div>
          <div className="detail-item">
            <p className="detail-label">PRÓXIMO RIEGO</p>
            <p className="detail-val">{activeCropData.proximoRiego}</p>
          </div>
        </div>
      </div>

    </main>
  );
}
