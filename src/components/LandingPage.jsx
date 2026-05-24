import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage({ onExplore, onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleExplore = onExplore || (() => navigate('/dashboard'));
  const handleLoginClick = onLoginClick || (() => navigate('/login'));
  const crops = [
    { name: 'Café', icon: '☕' },
    { name: 'Tomate', icon: '🍅' },
    { name: 'Papa', icon: '🥔' },
    { name: 'Arroz', icon: '🌾' },
    { name: 'Banano', icon: '🍌' },
    { name: 'Maíz', icon: '🌽' },
    { name: 'Aguacate', icon: '🥑' },
    { name: 'Cacao', icon: '🍫' },
    { name: 'Caña', icon: '🌱' },
    { name: 'Hortalizas', icon: '🥦' }
  ];

  const climates = [
    { name: 'Frío', icon: '❄️' },
    { name: 'Templado', icon: '⛅' },
    { name: 'Cálido', icon: '☀️' },
    { name: 'Húmedo', icon: '🌧️' },
    { name: 'Seco', icon: '🌵' }
  ];

  const benefits = [
    { title: 'Ahorra agua', desc: 'Riego eficiente y sostenible.', icon: '💧' },
    { title: 'Mejora tus cultivos', desc: 'Decisiones basadas en datos reales.', icon: '📈' },
    { title: 'Acceso desde cualquier lugar', desc: 'Web y móvil.', icon: '📱' },
    { title: 'Alertas inteligentes', desc: 'Actúa a tiempo y evita pérdidas.', icon: '🔔' },
    { title: 'Tecnología confiable', desc: 'Diseñada para el campo, probada en Colombia.', icon: '🛡️' }
  ];

  return (
    <div className="landing-container animate-fade">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-brand">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 11v1c0 1.66 1.34 3 3 3v1.93zM17.9 10.1c.1.3.1.6.1.9 0 2.87-1.84 5.31-4.4 6.18L13 16v-2c0-1.1-.9-2-2-2H9.27L12 8.5c.34.34.82.5 1.3.5h2.2c1.1 0 2 .9 2 2.1z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="brand-text">AGRO<span className="accent">SMART</span></span>
        </div>
        
        <div className="landing-nav" style={{ position: 'relative' }}>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="landing-dropdown-menu animate-fade">
              <button className="dropdown-item" onClick={handleLoginClick}>🔑 Iniciar Sesión</button>
              <button className="dropdown-item" onClick={() => navigate('/register')}>📝 Registrarse</button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleExplore}>🎯 Explorar App</button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section Grid */}
      <section className="hero-section">
        {/* Left Column (Main Promotion with Sprout Sprout Image Background) */}
        <div className="hero-left-card" style={{ backgroundImage: `linear-gradient(rgba(5, 11, 7, 0.75), rgba(5, 11, 7, 0.9)), url('./agrosmart_hero.png')` }}>
          <div className="hero-badge">
            <span className="flag-emoji">🇨🇴</span>
            <span>Tecnología agrícola diseñada para el campo colombiano.</span>
          </div>

          <h1 className="hero-title">Riega mejor, <br /><span className="highlight">produce más.</span></h1>
          
          <p className="hero-desc">
            Monitorea la humedad de tu suelo en tiempo real y toma decisiones inteligentes para ahorrar agua y mejorar tus cultivos.
          </p>

        <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleLoginClick}>
              Monitorea tu cultivo <span className="btn-arrow">→</span>
            </button>
            <button className="btn btn-secondary" onClick={handleExplore}>
              🎯 Explorar plataforma
            </button>
          </div>

          <div className="hero-stats-row">
            <div className="stat-box">
              <span className="stat-val">35%</span>
              <span className="stat-lbl">Ahorro de agua</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">+20%</span>
              <span className="stat-lbl">Eficiencia de riego</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">24/7</span>
              <span className="stat-lbl">Monitoreo continuo</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">Live</span>
              <span className="stat-lbl">Datos en tiempo real</span>
            </div>
          </div>
        </div>

        {/* Right Column (IoT Technology Section) */}
        <div className="hero-right-card glass-card">
          <div className="iot-header">
            <h3>Conecta. Monitorea. Decide.</h3>
            <p>Un ecosistema inteligente para cada cultivo y clima de Colombia.</p>
          </div>

          <div className="iot-pipeline">
            <div className="pipeline-step">
              <div className="step-icon">📡</div>
              <span>Sensores IoT</span>
            </div>
            <span className="pipe-arrow">→</span>
            <div className="pipeline-step">
              <div className="step-icon">☁️</div>
              <span>Nube Segura</span>
            </div>
            <span className="pipe-arrow">→</span>
            <div className="pipeline-step">
              <div className="step-icon">📊</div>
              <span>Dashboard</span>
            </div>
            <span className="pipe-arrow">→</span>
            <div className="pipeline-step">
              <div className="step-icon">🔔</div>
              <span>Alertas</span>
            </div>
          </div>

          <div className="hardware-showcase">
            <img src="./esp32_sensor.png" alt="ESP32 hardware node" className="hardware-image" />
            <div className="hardware-details">
              <h4>Tecnología IoT con ESP32</h4>
              <p>Sensores de humedad y temperatura conectados para decisiones precisas y oportunas.</p>
            </div>
          </div>

          <div className="iot-footer-badge">
            <span className="badge-shield">🛡️</span>
            <span>Bajo consumo y alta confiabilidad. Diseñado para el campo colombiano.</span>
          </div>
        </div>
      </section>

      {/* Crop Compatibility Section */}
      <section className="compatibility-section glass-card">
        <h3>Compatible con todo tipo de cultivos colombianos</h3>
        <div className="crops-grid">
          {crops.map((crop, idx) => (
            <div key={idx} className="crop-badge" onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
              <span className="crop-emoji">{crop.icon}</span>
              <span className="crop-name">{crop.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Climates Adaptation Section */}
      <section className="climates-section glass-card">
        <h3>Adaptado a todos los climas</h3>
        <div className="climates-list">
          {climates.map((climate, idx) => (
            <div key={idx} className="climate-badge">
              <span className="climate-emoji">{climate.icon}</span>
              <span className="climate-name">{climate.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why AgroSmart? Section */}
      <section className="why-section">
        <h2>¿Por qué AGROSMART?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="benefit-card glass-card">
              <span className="benefit-icon">{benefit.icon}</span>
              <h4>{benefit.title}</h4>
              <p>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <span>AGRO<span className="accent">SMART</span> — Inteligencia al servicio del agricultor colombiano.</span>
        </div>
        <div className="footer-bottom">
          <span>🔒 Datos seguros</span>
          <span className="divider">|</span>
          <span>📞 Soporte local</span>
          <span className="divider">|</span>
          <span>🇨🇴 Hecho en Colombia</span>
        </div>
      </footer>
    </div>
  );
}
