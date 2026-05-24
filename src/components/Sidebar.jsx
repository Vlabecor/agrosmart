import React, { useState } from 'react';
import './Sidebar.css';

const menuItems = [
  { id: 'dashboard',     label: 'Dashboard',      icon: '📊' },
  { id: 'cultivos',      label: 'Cultivos',        icon: '🌱' },
  { id: 'monitoreo',     label: 'Monitoreo',       icon: '📡' },
  { id: 'alertas',       label: 'Alertas',         icon: '🔔' },
  { id: 'historial',     label: 'Historial',       icon: '📅' },
  { id: 'reportes',      label: 'Reportes',        icon: '📄' },
  { id: 'configuracion', label: 'Configuración',   icon: '⚙️' },
  { id: 'perfil',        label: 'Mi Perfil',       icon: '👤' },
];

export default function Sidebar({ activeTab, setActiveTab, onBrandClick, onLogout, userProfile }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="sidebar-brand" onClick={() => { onBrandClick(); setMobileOpen(false); }} title="Ir al Inicio">
        <div className="logo-icon">
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
            <circle cx="16" cy="16" r="15" stroke="#46b464" strokeWidth="1.5" />
            <path d="M16 8 C12 8 9 11 9 15 C9 19 12 21 16 21 C20 21 23 19 23 15" stroke="#46b464" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M16 21 L16 26" stroke="#46b464" strokeWidth="2" strokeLinecap="round"/>
            <path d="M13 24 L19 24" stroke="#46b464" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="20" cy="10" r="3" fill="#46b464" opacity="0.7"/>
            <path d="M20 10 L20 7 M20 7 C20 7 18 5 16 6" stroke="#46b464" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <div className="brand-text">
          AGRO<span className="brand-accent">SMART</span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="sidebar-status">
        <span className="status-dot" />
        <span className="status-text">Sistema activo</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Principal</span>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleNav(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            {activeTab === item.id && <span className="menu-active-dot" />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="menu-item landing-btn" onClick={onLogout}>
          <span className="menu-icon">🚪</span>
          <span className="menu-label">Cerrar sesión</span>
        </button>
        <div
          className={`user-profile-card ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => handleNav('perfil')}
          title="Ver mi perfil"
        >
          <div className="user-avatar-placeholder">
            {userProfile?.name?.charAt(0) || 'A'}
          </div>
          <div className="user-info">
            <span className="user-name">{userProfile?.name || 'Agricultor'}</span>
            <span className="user-sub">{userProfile?.finca || 'Mi Finca'}</span>
          </div>
          <span className="user-online-dot" />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="sidebar animate-slide-left">
        <SidebarContent />
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="mobile-topbar">
        <div className="mobile-brand" onClick={() => { onBrandClick(); setMobileOpen(false); }}>
          <div className="logo-icon logo-icon--sm">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
              <circle cx="16" cy="16" r="15" stroke="#46b464" strokeWidth="1.5" />
              <path d="M16 8 C12 8 9 11 9 15 C9 19 12 21 16 21 C20 21 23 19 23 15" stroke="#46b464" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M16 21 L16 26" stroke="#46b464" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="brand-text" style={{ fontSize: '0.95rem' }}>
            AGRO<span className="brand-accent">SMART</span>
          </span>
        </div>

        <div className="mobile-topbar-center">
          <span className="mobile-active-label">
            {menuItems.find(m => m.id === activeTab)?.icon}{' '}
            {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
          </span>
        </div>

        <button
          className="hamburger-btn"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
        >
          <span className={`hamburger-icon ${mobileOpen ? 'hamburger-icon--open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Cerrar menú"
        />
      )}
      <aside className={`mobile-drawer ${mobileOpen ? 'mobile-drawer--open' : ''}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
