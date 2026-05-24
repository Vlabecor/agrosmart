import React from 'react';
import './MetricCard.css';

/**
 * accent: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
 */
export default function MetricCard({ title, value, status, icon, accent = 'success' }) {
  const accentColors = {
    success: { icon: 'rgba(46,213,115,0.15)', text: '#2ed573', border: 'rgba(46,213,115,0.3)' },
    warning: { icon: 'rgba(255,165,2,0.15)',  text: '#ffa502', border: 'rgba(255,165,2,0.3)' },
    danger:  { icon: 'rgba(255,71,87,0.15)',  text: '#ff4757', border: 'rgba(255,71,87,0.3)' },
    info:    { icon: 'rgba(84,160,255,0.15)', text: '#54a0ff', border: 'rgba(84,160,255,0.3)' },
    neutral: { icon: 'rgba(255,255,255,0.07)',text: '#87a895', border: 'rgba(255,255,255,0.1)' },
  };

  const colors = accentColors[accent] || accentColors.success;

  return (
    <div className="metric-card glass-card">
      <div
        className="metric-icon-wrap"
        style={{ background: colors.icon, border: `1px solid ${colors.border}` }}
      >
        <span style={{ color: colors.text }}>{icon}</span>
      </div>
      <div className="metric-body">
        <span className="metric-title">{title}</span>
        <span className="metric-value">{value}</span>
        {status && (
          <span className="metric-status" style={{ color: colors.text }}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
