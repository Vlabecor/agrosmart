import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import useAgroStore from './store/useAgroStore';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import CropSelection from './components/CropSelection';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProfileView from './components/ProfileView';
import AlertasView from './components/AlertasView';
import HistorialView from './components/HistorialView';
import ReportesView from './components/ReportesView';
import MonitoreoView from './components/MonitoreoView';
import ConfiguracionView from './components/ConfiguracionView';
import { cropsData } from './data/mockData';
import './App.css';

// ─── Gestión de Cultivos (tab simple) ────────────────────────────────────────
function CultivosView({ selectedCropId, onSelectCrop }) {
  return (
    <main className="dashboard-content content-bg animate-fade">
      <header className="dashboard-header">
        <div className="header-titles">
          <h1>🌱 Gestión de Cultivos</h1>
          <p>Selecciona el cultivo activo que deseas monitorear</p>
        </div>
      </header>
      <div className="mock-grid" style={{ padding: '0 2rem 2rem' }}>
        {Object.values(cropsData).map(crop => (
          <div
            key={crop.id}
            className="mock-item"
            onClick={() => onSelectCrop(crop.id)}
            style={{
              cursor: 'pointer', textAlign: 'center',
              border: selectedCropId === crop.id
                ? '2px solid var(--primary)'
                : '1px solid var(--border-color)',
              background: selectedCropId === crop.id
                ? 'rgba(70,180,100,0.12)'
                : 'rgba(255,255,255,0.03)',
              borderRadius: '14px',
              padding: '1.25rem',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{crop.emoji}</div>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{crop.name}</strong>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{crop.finca}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{crop.municipio}</div>
            {selectedCropId === crop.id && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                ● Activo
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

// ─── Protected Route ─────────────────────────────────────────────────────────
function ProtectedRoute({ children, guestAllowed = false }) {
  const { user, isAuthLoading } = useAgroStore();
  if (isAuthLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050b07', color: '#46b464', fontSize: '1.5rem' }}>
        Cargando AgroSmart...
      </div>
    );
  }
  if (!user && !guestAllowed) return <Navigate to="/login" replace />;
  return children;
}

// ─── App Shell (dashboard layout) ────────────────────────────────────────────
function AppShell() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const { user, selectedCropId, setSelectedCropId, logout } = useAgroStore();
  const navigate = useNavigate();

  const userProfile = {
    name: user?.displayName || (user?.email ? user.email.split('@')[0] : 'Agricultor'),
    finca: cropsData[selectedCropId]?.finca || 'Mi Finca'
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            selectedCropId={selectedCropId}
            setSelectedCropId={setSelectedCropId}
          />
        );
      case 'perfil':
        return <ProfileView onNavigate={setActiveTab} />;
      case 'alertas':
        return (
          <AlertasView
            selectedCropId={selectedCropId}
            setSelectedCropId={setSelectedCropId}
          />
        );
      case 'historial':
        return (
          <HistorialView
            selectedCropId={selectedCropId}
            setSelectedCropId={setSelectedCropId}
          />
        );
      case 'reportes':
        return <ReportesView selectedCropId={selectedCropId} />;
      case 'monitoreo':
        return (
          <MonitoreoView
            selectedCropId={selectedCropId}
            setSelectedCropId={setSelectedCropId}
          />
        );
      case 'configuracion':
        return <ConfiguracionView selectedCropId={selectedCropId} />;
      case 'cultivos':
        return (
          <CultivosView
            selectedCropId={selectedCropId}
            onSelectCrop={setSelectedCropId}
          />
        );
      default:
        return (
          <Dashboard
            selectedCropId={selectedCropId}
            setSelectedCropId={setSelectedCropId}
          />
        );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentCrop={selectedCropId}
        onBrandClick={() => setActiveTab('dashboard')}
        onLogout={handleLogout}
        userProfile={userProfile}
      />
      {renderContent()}
    </div>
  );
}

// ─── Landing wrapper ──────────────────────────────────────────────────────────
function LandingWithNav() {
  const navigate = useNavigate();
  const setSelectedCropId = useAgroStore((state) => state.setSelectedCropId);

  const handleExplore = () => navigate('/dashboard');
  const handleLoginClick = () => navigate('/login');
  const handleCropSelect = (cropId) => {
    setSelectedCropId(cropId);
    navigate('/dashboard');
  };

  return <LandingPage onExplore={handleExplore} onLoginClick={handleLoginClick} onCropSelect={handleCropSelect} />;
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { initAuth } = useAgroStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingWithNav />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Crop selection */}
      <Route
        path="/crop-selection"
        element={
          <ProtectedRoute>
            <CropSelectionRoute />
          </ProtectedRoute>
        }
      />

      {/* Protected Dashboard — guestAllowed so "Explorar" works */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute guestAllowed={true}>
            <AppShell />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ─── CropSelectionRoute ───────────────────────────────────────────────────────
function CropSelectionRoute() {
  const { user, setSelectedCropId } = useAgroStore();
  const navigate = useNavigate();

  const handleSelect = (cropId) => {
    setSelectedCropId(cropId);
    navigate('/dashboard');
  };

  return <CropSelection userEmail={user?.email || user?.displayName || 'Agricultor'} onSelectCrop={handleSelect} />;
}
