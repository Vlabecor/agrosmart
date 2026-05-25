import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import agrosmartHero from '../assets/agrosmart_hero.png.png';
import esp32Sensor from '../assets/esp32_sensor.png';
import colombiaMap from '../assets/colombia_map.png';
import esp32Banner from '../assets/esp32_banner.png';
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
    { id: 'cafe',     name: 'Café',     img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=300&auto=format&fit=crop&q=80' },
    { id: 'tomate',   name: 'Tomate',   img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop&q=80' },
    { id: 'fresas',   name: 'Fresas',   img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&auto=format&fit=crop&q=80' },
    { id: 'papa',     name: 'Papa',     img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&auto=format&fit=crop&q=80' },
    { id: 'banana',   name: 'Banano',   img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&auto=format&fit=crop&q=80' },
    { id: 'flores',   name: 'Flores',   img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&auto=format&fit=crop&q=80' },
    { id: 'hortalizas', name: 'Hortalizas', img: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=300&auto=format&fit=crop&q=80' }
  ];

  const climasColombia = [
    { name: 'Frio', icon: '❄️', label: 'Copos de nieve' },
    { name: 'Templado', icon: '⛅', label: 'Nubes y sol' },
    { name: 'Cálido', icon: '☀️', label: 'Sol brillante' },
    { name: 'Húmedo', icon: '🌧️', label: 'Nube lluviosa' },
    { name: 'Seco', icon: '☀️', label: 'Sol' }
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
      <section className="hero-section full-screen-hero" id="inicio" style={{ backgroundImage: `url('${agrosmartHero}')` }}>
        <div className="hero-overlay-gradient"></div>
        
        <div className="hero-content-container">
          {/* Contenido de texto y stats (Izquierda) */}
          <div className="hero-left-content">
            <div className="hero-badge">
              <span className="leaf-badge-icon">🌿</span>
              <span>Tecnología agrícola diseñada para el campo colombiano.</span>
            </div>

            <h1 className="hero-title">
              Riega mejor, <br />
              <span className="highlight">produce más.</span>
            </h1>
            
            <p className="hero-desc">
              Monitorea la humedad de tu suelo en tiempo real y toma decisiones inteligentes para ahorrar agua y mejorar tus cultivos.
            </p>

            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={handleLoginClick}>
                <span className="btn-leaf-icon">🌿</span> Monitorea tu cultivo <span className="btn-arrow">→</span>
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

          {/* Columna derecha vacía para respetar el espacio del campesino en la imagen */}
          <div className="hero-right-content">
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
        </div>
      </section>

      {/* ─── BENTO GRID SECTION (CULTIVOS, CLIMAS & HARDWARE) ─── */}
      <section className="bento-layout-section" id="funciones">
        {/* Bento 1: Cultivos Colombianos */}
        <div className="bento-card-crop glass-card" id="cultivos">
          <h3 className="bento-section-title">
            Compatible con cultivos colombianos
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
          </div>
        </div>

        {/* Bento 2: Climas de Colombia (Mapa Poligonal Premium) */}
        <div className="bento-card-climate glass-card">
          <div className="colombia-map-svg-wrap">
            <img
              src={colombiaMap}
              alt="Mapa de Colombia"
              className="colombia-map-svg"
              style={{ width: '170px', height: '170px', objectFit: 'contain' }}
            />
          </div>
          
          <div className="bento-climate-info">
            <h3 className="bento-climate-title">Adaptado a todos los climas de Colombia</h3>
            <div className="bento-climates-row">
              {climasColombia.map((climate, idx) => (
                <div key={idx} className="bento-climate-item-col">
                  <span className="bento-climate-icon" title={climate.label}>{climate.icon}</span>
                  <span className="bento-climate-name">{climate.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bento 3: Tecnología IoT — Banner Completo */}
        <div className="bento-card-iot-banner">
          {/* Imagen de fondo */}
          <div className="iot-banner-bg-wrap">
            <img src={esp32Banner} alt="" className="iot-banner-bg-img" aria-hidden="true" />
            <div className="iot-banner-overlay" />
          </div>

          {/* Contenido encima */}
          <div className="iot-banner-content">
            {/* Badge WiFi animado */}
            <div className="iot-wifi-badge">
              <span className="iot-wifi-dot" />
              <span>En vivo · Conectado</span>
            </div>

            <h3 className="iot-banner-title">Tecnología IoT con ESP32</h3>
            <p className="iot-banner-desc">
              Sensores inteligentes que trabajan 24/7 por tu cultivo.<br />
              Monitoreo en tiempo real desde cualquier lugar.
            </p>

            {/* Pills de características */}
            <div className="iot-banner-pills">
              <span className="iot-pill">📡 WiFi + Bluetooth</span>
              <span className="iot-pill">💧 Sensor de humedad</span>
              <span className="iot-pill">🌡️ Temperatura</span>
              <span className="iot-pill">☀️ Panel Solar</span>
            </div>

            <button className="iot-banner-cta" onClick={handleExplore}>
              Conecta, monitorea y decide
              <span className="iot-cta-arrow">→</span>
            </button>
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
