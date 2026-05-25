import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import agrosmartHero from '../assets/agrosmart_hero.png';
import esp32Sensor from '../assets/esp32_sensor.png';
import agroBg from '../assets/agro_bg.png';
import './LandingPage.css';

export default function LandingPage({ onExplore, onLoginClick, onCropSelect }) {
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
    { id: 'cafe',     name: 'Café',     img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80' },
    { id: 'tomate',   name: 'Tomate',   img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop&q=80' },
    { id: 'aguacate', name: 'Aguacate', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&auto=format&fit=crop&q=80' },
    { id: 'maiz',     name: 'Maíz',     img: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=300&auto=format&fit=crop&q=80' },
    { id: 'papa',     name: 'Papa',     img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&auto=format&fit=crop&q=80' },
    { id: 'banana',   name: 'Banano',   img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&auto=format&fit=crop&q=80' },
    { id: 'cacao',    name: 'Cacao',    img: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=300&auto=format&fit=crop&q=80' },
    { id: 'arroz',    name: 'Arroz',    img: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=300&auto=format&fit=crop&q=80' }
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
    <div className="landing-page-root">
    <div className="landing-container animate-fade">
      {/* ─── HEADER (Solo logo, 'Beneficios' y menú hamburguesa) ─── */}
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

        {/* Enlaces horizontales: solo Beneficios (visible en desktop) */}
        <nav className="landing-desktop-nav">
          <button className="nav-link-horizontal" onClick={() => handleScrollTo('beneficios')}>Beneficios</button>
        </nav>

        {/* Único menú de navegación (Hamburguesa para todo tamaño de pantalla) */}
        <div className="landing-nav-general">
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu" aria-expanded={isMenuOpen}>
            <div className={`hamburger-lines ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </header>

      {/* Backdrop y Side Drawer Overlay (Menu Hamburguesa) */}
      {isMenuOpen && (
        <div className="landing-backdrop" onClick={() => setIsMenuOpen(false)} />
      )}
      <aside className={`landing-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="landing-brand" onClick={() => { handleScrollTo('inicio'); setIsMenuOpen(false); }}>
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
            </div>
          </div>
          <button className="drawer-close" onClick={() => setIsMenuOpen(false)} aria-label="Cerrar menú">✕</button>
        </div>
        <nav className="drawer-nav">
          <button className="drawer-item" onClick={() => { setIsMenuOpen(false); handleScrollTo('inicio'); }}>🏠 Inicio</button>
          <button className="drawer-item" onClick={() => { setIsMenuOpen(false); handleScrollTo('funciones'); }}>🛠️ Funciones</button>
          <button className="drawer-item" onClick={() => { setIsMenuOpen(false); handleScrollTo('cultivos'); }}>🌱 Cultivos</button>
          <button className="drawer-item" onClick={() => { setIsMenuOpen(false); handleScrollTo('beneficios'); }}>💎 Beneficios</button>
          <button className="drawer-item" onClick={() => { setIsMenuOpen(false); handleScrollTo('contacto'); }}>📞 Contacto</button>
          <div className="drawer-divider"></div>
          <button className="drawer-item" onClick={() => { setIsMenuOpen(false); handleLoginClick(); }}>🔑 Iniciar Sesión</button>
          <button className="drawer-item" onClick={() => { setIsMenuOpen(false); navigate('/register'); }}>📝 Registrarse</button>
          <button className="drawer-item highlight-btn" onClick={() => { setIsMenuOpen(false); handleExplore(); }}>🎯 Explorar App</button>
        </nav>
      </aside>

      {/* ─── HERO SECTION ─── */}
      <section className="hero-section" id="inicio">
        {/* Left Column: Promotion Info (Fondo de planta de fondo) */}
        <div className="hero-left-card" style={{ backgroundImage: `linear-gradient(rgba(5, 11, 7, 0.78), rgba(5, 11, 7, 0.92)), url('${agroBg}')` }}>
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

        {/* Right Column: Premium Smartphone Showcase (Campesino + Celular) */}
        <div className="hero-right-card-premium">
          {/* Imagen de fondo nativa (Campesino + Celular cargada de agrosmartHero) */}
          <img src={agrosmartHero} alt="Campesino y celular AgroSmart" className="hero-right-bg-image" />
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
              <div key={idx} className="bento-crop-item" onClick={() => onCropSelect ? onCropSelect(crop.id) : handleExplore()}>
                <div className="bento-crop-img-wrap">
                  <img src={crop.img} alt={crop.name} className="bento-crop-img" />
                  <div className="bento-crop-overlay"></div>
                </div>
                <span className="bento-crop-name">{crop.name}</span>
              </div>
            ))}
            
            {/* Botón Mas Cultivos */}
            <div className="bento-crop-item bento-crop-item--more" onClick={handleExplore}>
              <div className="bento-crop-more-icon-wrap">
                <span className="more-plus-icon">+</span>
              </div>
              <span className="bento-crop-name">y muchos más...</span>
            </div>
          </div>
        </div>

        {/* Bento 2: Climas de Colombia (Mapa Poligonal Premium) */}
        <div className="bento-card-climate glass-card">
          <div className="bento-climate-text">
            <h3 className="bento-climate-title">Adaptado a todos los climas de Colombia</h3>
          </div>
          
          <div className="bento-climate-content">
            {/* SVG del Mapa de Colombia Poligonal 3D en verde brillante */}
            <div className="colombia-map-svg-wrap">
              <svg viewBox="0 0 200 240" className="colombia-map-svg" width="160" height="192">
                {/* Definiciones de gradientes poligonales */}
                <defs>
                  <linearGradient id="poly1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#46b464" />
                    <stop offset="100%" stopColor="#2e7d32" />
                  </linearGradient>
                  <linearGradient id="poly2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#81c784" />
                    <stop offset="100%" stopColor="#388e3c" />
                  </linearGradient>
                  <linearGradient id="poly3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a5d6a7" />
                    <stop offset="100%" stopColor="#4caf50" />
                  </linearGradient>
                  <linearGradient id="poly4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2e7d32" />
                    <stop offset="100%" stopColor="#1b5e20" />
                  </linearGradient>
                </defs>
                {/* Dibujo poligonal del mapa */}
                {/* Norte */}
                <polygon points="90,10 110,12 115,25 95,28 90,10" fill="url(#poly2)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="110,12 135,14 130,30 115,25 110,12" fill="url(#poly1)" stroke="#2e7d32" strokeWidth="0.5" />
                {/* Región Caribe */}
                <polygon points="95,28 115,25 125,50 90,48 95,28" fill="url(#poly3)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="115,25 130,30 142,42 125,50 115,25" fill="url(#poly4)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="125,50 142,42 148,65 120,68 125,50" fill="url(#poly1)" stroke="#2e7d32" strokeWidth="0.5" />
                {/* Centro / Andina */}
                <polygon points="90,48 120,68 105,100 75,80 90,48" fill="url(#poly2)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="120,68 148,65 140,95 105,100 120,68" fill="url(#poly3)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="105,100 140,95 158,115 112,130 105,100" fill="url(#poly1)" stroke="#2e7d32" strokeWidth="0.5" />
                {/* Suroccidente */}
                <polygon points="75,80 105,100 88,140 50,120 75,80" fill="url(#poly4)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="50,120 88,140 70,180 42,160 50,120" fill="url(#poly2)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="42,160 70,180 58,210 32,190 42,160" fill="url(#poly3)" stroke="#2e7d32" strokeWidth="0.5" />
                {/* Sur / Amazonía */}
                <polygon points="88,140 112,130 135,160 100,185 88,140" fill="url(#poly1)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="100,185 135,160 152,190 115,220 100,185" fill="url(#poly4)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="115,220 152,190 172,212 135,230 115,220" fill="url(#poly2)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="70,180 100,185 115,220 72,210 70,180" fill="url(#poly3)" stroke="#2e7d32" strokeWidth="0.5" />
                {/* Orinoquía */}
                <polygon points="112,130 158,115 180,140 135,160 112,130" fill="url(#poly3)" stroke="#2e7d32" strokeWidth="0.5" />
                <polygon points="135,160 180,140 175,178 152,190 135,160" fill="url(#poly1)" stroke="#2e7d32" strokeWidth="0.5" />
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
    </div>
  );
}
