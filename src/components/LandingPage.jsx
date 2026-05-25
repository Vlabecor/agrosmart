import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import agrosmartHero from '../assets/agrosmart_hero.png';
import esp32Sensor from '../assets/esp32_sensor.png';
import agroBg from '../assets/agro_bg.png';
import './LandingPage.css';

export default function LandingPage({ onExplore, onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleExplore = onExplore || (() => navigate('/dashboard'));
  const handleLoginClick = onLoginClick || (() => navigate('/login'));

  // Desplazamiento suave para los links de anclaje
  const handleScrollTo = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const cultivosColombianos = [
    { name: 'Café', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=180&auto=format&fit=crop&q=80' },
    { name: 'Tomate', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=180&auto=format&fit=crop&q=80' },
    { name: 'Aguacate', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=180&auto=format&fit=crop&q=80' },
    { name: 'Maíz', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d20f6?w=180&auto=format&fit=crop&q=80' },
    { name: 'Papa', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=180&auto=format&fit=crop&q=80' },
    { name: 'Cacao', img: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=180&auto=format&fit=crop&q=80' },
    { name: 'Arroz', img: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=180&auto=format&fit=crop&q=80' }
  ];

  const climasColombia = [
    { name: 'Frío', icon: '❄️', label: 'Copos de nieve' },
    { name: 'Templado', icon: '⛅', label: 'Nubes y sol' },
    { name: 'Cálido', icon: '☀️', label: 'Sol brillante' },
    { name: 'Húmedo', icon: '🌧️', label: 'Nube lluviosa' },
    { name: 'Seco', icon: '🌵', label: 'Desértico' }
  ];

  const beneficios = [
    { title: 'Ahorro de agua garantizado', desc: 'Reduce el consumo de agua hasta en un 35% automatizando los tiempos de riego basándote en la humedad real.', icon: '💧' },
    { title: 'Incremento de producción', desc: 'Consigue cosechas más abundantes y de mejor calidad al mantener tus cultivos en su punto de humedad óptimo.', icon: '📈' },
    { title: 'Alertas en tiempo real', desc: 'Recibe notificaciones automáticas SMS o WhatsApp cuando la humedad sea crítica o se detecten anomalías.', icon: '🔔' },
    { title: 'Sensores de alta resistencia', desc: 'Nodos de hardware ESP32 herméticos de bajo consumo con batería de larga duración listos para la intemperie.', icon: '📡' },
    { title: 'Control desde tu bolsillo', desc: 'Visualiza el estado de tu finca desde cualquier navegador o dispositivo móvil con gráficos interactivos sencillos.', icon: '📱' },
    { title: 'Adaptado a tu región', desc: 'Algoritmos calibrados específicamente para los microclimas y suelos colombianos (Boyacá, Huila, Antioquia, etc.).', icon: '🇨🇴' }
  ];

  return (
    <div className="landing-container animate-fade">
      {/* ─── HEADER ─── */}
      <header className="landing-header">
        <div className="landing-brand" onClick={() => handleScrollTo('inicio')}>
          <div className="brand-logo-leaf">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
              <path d="M2 22C2 22 6 18 12 18C18 18 22 22 22 22" stroke="#46b464" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 2C12 2 4 10 4 15C4 18.5 7 21 10.5 21C12 21 13 20.5 14 19.5" stroke="#46b464" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 2C12 2 20 10 20 15C20 18.5 17 21 13.5 21C12 21 11 20.5 10 19.5" fill="#46b464" opacity="0.85" />
              <path d="M12 2V21" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="brand-text-block">
            <span className="brand-title">AGRO<span className="accent">SMART</span></span>
            <span className="brand-legend">Inteligencia al servicio del campo <span className="legend-dot">●</span></span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav-menu">
          <button onClick={() => handleScrollTo('beneficios')} className="nav-link">Beneficios</button>
        </nav>
        
        {/* Desktop Auth Actions */}
        <div className="desktop-auth-actions">
          <button className="auth-btn-login" onClick={handleLoginClick}>
            <span className="user-icon">👤</span> Iniciar sesión
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="landing-nav-mobile">
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="landing-dropdown-menu animate-fade">
              <button className="dropdown-item" onClick={() => handleScrollTo('inicio')}>🏠 Inicio</button>
              <button className="dropdown-item" onClick={() => handleScrollTo('funciones')}>🛠️ Funciones</button>
              <button className="dropdown-item" onClick={() => handleScrollTo('cultivos')}>🌱 Cultivos</button>
              <button className="dropdown-item" onClick={() => handleScrollTo('beneficios')}>💎 Beneficios</button>
              <button className="dropdown-item" onClick={() => handleScrollTo('contacto')}>📞 Contacto</button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleLoginClick}>🔑 Iniciar Sesión</button>
              <button className="dropdown-item" onClick={() => navigate('/register')}>📝 Registrarse</button>
              <button className="dropdown-item highlight-btn" onClick={handleExplore}>🎯 Explorar App</button>
            </div>
          )}
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="hero-section" id="inicio">
        {/* Left Column: Promotion Info */}
        <div className="hero-left-card">
          <div className="hero-badge">
            <span className="leaf-badge-icon">🌿</span>
            <span>Tecnología agrícola inteligente</span>
          </div>

          <h1 className="hero-title">
            Monitorea tu cultivo <br />
            <span className="highlight">en tiempo real.</span>
          </h1>
          
          <p className="hero-desc">
            AgroSmart te ayuda a tomar mejores decisiones de riego, ahorrar agua y aumentar la productividad de tus cultivos desde cualquier lugar.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleLoginClick}>
              <span className="btn-leaf-icon">🌿</span> monitorea tu cultivo <span className="btn-arrow">→</span>
            </button>
            <button className="btn btn-secondary-play" onClick={handleExplore}>
              <span className="play-icon">▶</span> Ver cómo funciona
            </button>
          </div>

          {/* 4 Mini cards horizontales de stats */}
          <div className="hero-stats-cards-grid">
            <div className="glass-card stat-mini-card">
              <span className="stat-card-icon blue-glow">💧</span>
              <div className="stat-card-text">
                <span className="stat-card-label">Ahorra hasta</span>
                <span className="stat-card-value">35% <span className="stat-card-sub">de agua</span></span>
              </div>
            </div>
            
            <div className="glass-card stat-mini-card">
              <span className="stat-card-icon green-glow">🌿</span>
              <div className="stat-card-text">
                <span className="stat-card-label">Aumenta hasta</span>
                <span className="stat-card-value">20% <span className="stat-card-sub">la productividad</span></span>
              </div>
            </div>

            <div className="glass-card stat-mini-card">
              <span className="stat-card-icon yellow-glow">🔔</span>
              <div className="stat-card-text">
                <span className="stat-card-label">Alertas en</span>
                <span className="stat-card-value">tiempo real <span className="stat-card-sub">24/7</span></span>
              </div>
            </div>

            <div className="glass-card stat-mini-card">
              <span className="stat-card-icon purple-glow">☁️</span>
              <div className="stat-card-text">
                <span className="stat-card-label">Accede desde</span>
                <span className="stat-card-value">cualquier lugar <span className="stat-card-sub">y dispositivo</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Smartphone Showcase */}
        <div className="hero-right-card-premium">
          {/* Imagen de fondo nativa (Campesino + Celular) */}
          <img src={agroBg} alt="Campesino y celular AgroSmart" className="hero-right-bg-image" />
          <div className="hero-right-overlay-light"></div>
          
          {/* Floating UI Elements matching the mockup */}
          <div className="floating-ui-container">
            <div className="float-pill float-humidity animate-float-slow">
              <span className="float-icon-drop">💧</span>
              <div>
                <span className="float-label">Humedad</span>
                <span className="float-value">45%</span>
              </div>
            </div>

            <div className="float-pill float-temp animate-float-medium">
              <span className="float-icon-thermometer">🌡️</span>
              <div>
                <span className="float-label">Temperatura</span>
                <span className="float-value">24°C</span>
              </div>
            </div>

            <div className="float-pill float-signal animate-float-fast">
              <span className="float-icon-wifi">📶</span>
              <div>
                <span className="float-label">Señal</span>
                <span className="float-value">Fuerte</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BENTO GRID SECTION (CULTIVOS, CLIMAS & HARDWARE) ─── */}
      <section className="bento-layout-section" id="funciones">
        {/* Bento 1: Cultivos Colombianos */}
        <div className="bento-card-crop glass-card" id="cultivos">
          <h3 className="bento-section-title">
            Compatible con cultivos colombianos <span className="flag-co-emoji">🇨🇴</span>
          </h3>
          
          <div className="bento-crops-grid">
            {cultivosColombianos.map((crop, idx) => (
              <div key={idx} className="bento-crop-item" onClick={handleLoginClick}>
                <div className="bento-crop-img-wrap">
                  <img src={crop.img} alt={crop.name} className="bento-crop-img" />
                  <div className="bento-crop-overlay"></div>
                </div>
                <span className="bento-crop-name">{crop.name}</span>
              </div>
            ))}
            
            {/* Botón Mas Cultivos */}
            <div className="bento-crop-item bento-crop-item--more" onClick={handleLoginClick}>
              <div className="bento-crop-more-icon-wrap">
                <span className="more-plus-icon">+</span>
              </div>
              <span className="bento-crop-name">y muchos más...</span>
            </div>
          </div>
        </div>

        {/* Bento 2: Climas de Colombia */}
        <div className="bento-card-climate glass-card">
          <div className="bento-climate-text">
            <h3 className="bento-climate-title">Adaptado a todos los climas de Colombia</h3>
          </div>
          
          <div className="bento-climate-content">
            {/* SVG del Mapa de Colombia en verde brillante */}
            <div className="colombia-map-svg-wrap">
              <svg viewBox="0 0 200 240" className="colombia-map-svg" width="90" height="110">
                <path 
                  d="M95 10 C100 20, 110 25, 115 15 C120 5, 130 10, 132 22 C134 34, 145 42, 140 50 C135 58, 148 68, 143 78 C138 88, 155 95, 158 108 C161 121, 185 130, 178 145 C171 160, 182 178, 170 190 C158 202, 145 198, 138 215 C131 232, 115 235, 105 220 C95 205, 82 220, 72 210 C62 200, 52 205, 48 190 C44 175, 28 178, 32 160 C36 142, 22 135, 30 120 C38 105, 45 112, 52 98 C59 84, 52 75, 62 62 C72 49, 78 52, 82 38 C86 24, 90 20, 95 10 Z" 
                  fill="none" 
                  stroke="#46b464" 
                  strokeWidth="2.5" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M95 10 C100 20, 110 25, 115 15 C120 5, 130 10, 132 22 C134 34, 145 42, 140 50 C135 58, 148 68, 143 78 C138 88, 155 95, 158 108 C161 121, 185 130, 178 145 C171 160, 182 178, 170 190 C158 202, 145 198, 138 215 C131 232, 115 235, 105 220 C95 205, 82 220, 72 210 C62 200, 52 205, 48 190 C44 175, 28 178, 32 160 C36 142, 22 135, 30 120 C38 105, 45 112, 52 98 C59 84, 52 75, 62 62 C72 49, 78 52, 82 38 C86 24, 90 20, 95 10 Z" 
                  fill="#46b464" 
                  opacity="0.15" 
                />
                <circle cx="110" cy="90" r="4" fill="#46b464" />
                <circle cx="110" cy="90" r="10" stroke="#46b464" strokeWidth="1" fill="none" opacity="0.5" />
              </svg>
            </div>

            {/* Listado de climas con iconos */}
            <div className="bento-climates-list">
              {climasColombia.map((climate, idx) => (
                <div key={idx} className="bento-climate-item">
                  <span className="bento-climate-icon" title={climate.label}>{climate.icon}</span>
                  <span className="bento-climate-name">{climate.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bento 3: Tecnología IoT con ESP32 */}
        <div className="bento-card-iot glass-card">
          <div className="bento-iot-text">
            <h3 className="bento-iot-title">Tecnología IoT con ESP32</h3>
            <p className="bento-iot-desc">
              Sensores inteligentes que trabajan 24/7 por tu cultivo.
            </p>
            <button className="bento-iot-link-btn" onClick={handleExplore}>
              Conecta, monitorea y decide. <span className="iot-link-arrow">→</span>
            </button>
          </div>

          <div className="bento-iot-hardware-wrap">
            <div className="hardware-signal-pulse">
              <span className="wifi-icon-blue">📶</span>
              <span className="pulse-ring ring-1"></span>
              <span className="pulse-ring ring-2"></span>
            </div>
            <img src={esp32Sensor} alt="ESP32 hardware node" className="bento-iot-img" />
          </div>
        </div>
      </section>

      {/* ─── NUEVA SECCIÓN DE BENEFICIOS ─── */}
      <section className="benefits-section-detailed" id="beneficios">
        <div className="benefits-header">
          <h2 className="section-title-premium">Beneficios de AgroSmart</h2>
          <p className="section-subtitle-premium">
            Diseñado para optimizar el rendimiento hídrico y maximizar la rentabilidad de tus cultivos.
          </p>
        </div>

        <div className="benefits-premium-grid">
          {beneficios.map((benefit, idx) => (
            <div key={idx} className="glass-card benefit-premium-card">
              <div className="benefit-premium-icon-wrap">
                <span className="benefit-premium-icon">{benefit.icon}</span>
              </div>
              <h4 className="benefit-premium-title">{benefit.title}</h4>
              <p className="benefit-premium-desc">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section className="landing-contact-section" id="contacto">
        <div className="glass-card contact-container-premium">
          <div className="contact-info-premium">
            <h3 className="contact-title-premium">¿Listo para transformar tu finca?</h3>
            <p className="contact-desc-premium">
              Ponte en contacto con nuestro equipo de soporte técnico agrícola para diseñar el plan de sensores adecuado para ti.
            </p>
            <div className="contact-details-list">
              <div className="contact-detail-item">
                <span className="contact-detail-icon">📞</span>
                <span>+57 300 123 4567</span>
              </div>
              <div className="contact-detail-item">
                <span className="contact-detail-icon">📧</span>
                <span>soporte@agrosmart.co</span>
              </div>
              <div className="contact-detail-item">
                <span className="contact-detail-icon">📍</span>
                <span>Bogotá, Colombia</span>
              </div>
            </div>
          </div>

          <form className="contact-form-premium" onSubmit={(e) => { e.preventDefault(); alert('¡Mensaje enviado con éxito! Te contactaremos pronto.'); }}>
            <div className="form-group-premium">
              <label className="form-label-premium">Nombre Completo</label>
              <input type="text" className="form-input-premium" placeholder="Ingresa tu nombre" required />
            </div>
            <div className="form-group-premium">
              <label className="form-label-premium">Correo Electrónico</label>
              <input type="email" className="form-input-premium" placeholder="correo@ejemplo.com" required />
            </div>
            <div className="form-group-premium">
              <label className="form-label-premium">Mensaje o Consulta</label>
              <textarea className="form-textarea-premium" placeholder="Cuéntanos sobre tu finca y cultivos..." rows="3" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center py-3">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
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
