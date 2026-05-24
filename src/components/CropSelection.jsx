import React from 'react';
import { cropsData } from '../data/mockData';

export default function CropSelection({ userEmail, onSelectCrop }) {
  const userName = userEmail ? userEmail.split('@')[0] : 'Agricultor';

  return (
    <div className="login-container animate-fade">
      <div className="login-card" style={{ maxWidth: '700px', padding: '3rem 2rem' }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>¡Hola, {userName}!</h2>
          <p style={{ fontSize: '1.1rem' }}>Selecciona el cultivo que deseas monitorear hoy.</p>
        </div>

        <div className="mock-grid" style={{ gap: '1.5rem' }}>
          {Object.values(cropsData).map(crop => (
            <div 
              key={crop.id} 
              className="glass-card" 
              style={{ 
                cursor: 'pointer', 
                width: '180px', 
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}
              onClick={() => onSelectCrop(crop.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#46b464';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(70,180,100,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{crop.emoji}</div>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem' }}>{crop.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{crop.finca}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
