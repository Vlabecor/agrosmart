import React, { useState } from 'react';
import './Charts.css';

// 1. Line Chart for Soil Moisture Evolution
export function SoilMoistureLineChart({ data = [], optimo = null }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (data.length === 0) return <div>No hay datos disponibles</div>;

  const width = 500;
  const height = 200;
  const padding = 35;

  const maxVal = 100;
  const minVal = 0;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Map values to coordinates
  const points = data.map((d, index) => {
    const x = padding + (index * chartWidth) / (data.length - 1);
    const y = padding + chartHeight - ((d.valor - minVal) * chartHeight) / (maxVal - minVal);
    return { x, y, ...d };
  });

  // Build SVG Path (d)
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  // Build Area Path (closed loop for gradient fill)
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  // Draw Horizontal Grid Lines
  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div className="chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg">
        <defs>
          <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid lines */}
        {gridLines.map((val, idx) => {
          const y = padding + chartHeight - ((val - minVal) * chartHeight) / (maxVal - minVal);
          return (
            <g key={idx}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                className="grid-line"
              />
              <text x={padding - 10} y={y + 4} className="grid-axis-text text-right">
                {val}%
              </text>
            </g>
          );
        })}

        {/* Optimal humidity reference line */}
        {optimo !== null && (() => {
          const optimoY = padding + chartHeight - ((optimo - minVal) * chartHeight) / (maxVal - minVal);
          return (
            <line
              x1={padding} y1={optimoY}
              x2={width - padding} y2={optimoY}
              stroke="#ffa502" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7"
            />
          );
        })()}

        {/* Area fill */}
        {points.length > 0 && (
          <path d={areaD} fill="url(#chartAreaGrad)" />
        )}

        {/* Line */}
        {points.length > 0 && (
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        )}

        {/* Point markers */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredPoint === idx ? "7" : "4"}
              fill={hoveredPoint === idx ? "var(--color-primary-hover)" : "var(--bg-primary)"}
              stroke="var(--color-primary)"
              strokeWidth="2"
              onMouseEnter={() => setHoveredPoint(idx)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="chart-point"
            />
            {/* Tooltip on hover */}
            {hoveredPoint === idx && (
              <g className="chart-tooltip">
                <rect
                  x={p.x - 30}
                  y={p.y - 35}
                  width="60"
                  height="22"
                  rx="4"
                  fill="rgba(5, 11, 7, 0.95)"
                  stroke="var(--color-primary)"
                  strokeWidth="1"
                />
                <text
                  x={p.x}
                  y={p.y - 20}
                  textAnchor="middle"
                  className="tooltip-text"
                >
                  {p.valor}%
                </text>
              </g>
            )}
            {/* X Axis label */}
            <text
              x={p.x}
              y={height - padding + 18}
              textAnchor="middle"
              className="grid-axis-text"
            >
              {p.fecha}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// 2. Donut Chart for Moisture Distribution
export function MoistureDistributionDonutChart({ distribution = { bajo: 30, medio: 50, alto: 20 } }) {
  const { bajo, medio, alto } = distribution;

  const radius = 50;
  const strokeWidth = 14;
  const circ = 2 * Math.PI * radius; // 314.16

  // Percentages must sum to 100
  const bajoStroke = (bajo / 100) * circ;
  const medioStroke = (medio / 100) * circ;
  const altoStroke = (alto / 100) * circ;

  const bajoOffset = circ;
  const medioOffset = circ - bajoStroke;
  const altoOffset = circ - bajoStroke - medioStroke;

  return (
    <div className="donut-chart-wrapper">
      <div className="donut-svg-container">
        <svg viewBox="0 0 140 140" className="donut-chart-svg">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#122519"
            strokeWidth={strokeWidth}
          />
          {/* Bajo */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#ff5252"
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={bajoOffset}
            transform="rotate(-90 70 70)"
            strokeLinecap="round"
            className="donut-segment"
          />
          {/* Medio */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#00e676"
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={medioOffset}
            transform={`rotate(${(bajo / 100) * 360 - 90} 70 70)`}
            strokeLinecap="round"
            className="donut-segment"
          />
          {/* Alto */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#2979ff"
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={altoOffset}
            transform={`rotate(${((bajo + medio) / 100) * 360 - 90} 70 70)`}
            strokeLinecap="round"
            className="donut-segment"
          />
          <g className="donut-center-text">
            <text x="70" y="65" textAnchor="middle" className="donut-number">
              {medio}%
            </text>
            <text x="70" y="82" textAnchor="middle" className="donut-label">
              Óptimo
            </text>
          </g>
        </svg>
      </div>

      <div className="donut-legend">
        <div className="legend-item">
          <span className="dot dot-bajo"></span>
          <span className="legend-name">Bajo (0-30%)</span>
          <span className="legend-val">{bajo}%</span>
        </div>
        <div className="legend-item">
          <span className="dot dot-medio"></span>
          <span className="legend-name">Medio (30-70%)</span>
          <span className="legend-val">{medio}%</span>
        </div>
        <div className="legend-item">
          <span className="dot dot-alto"></span>
          <span className="legend-name">Alto (70-100%)</span>
          <span className="legend-val">{alto}%</span>
        </div>
      </div>
    </div>
  );
}

// 3. Bar Chart for Daily Water Usage
export function IrrigationBarChart({ data = [] }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  if (data.length === 0) return <div>No hay datos disponibles</div>;

  const width = 500;
  const height = 200;
  const padding = 35;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxVal = Math.max(...data.map(d => d.valor), 1000);

  return (
    <div className="chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} className="bar-chart-svg">
        {/* Horizontal grid lines */}
        {[0, maxVal / 2, maxVal].map((val, idx) => {
          const y = padding + chartHeight - (val * chartHeight) / maxVal;
          return (
            <g key={idx}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                className="grid-line"
              />
              <text x={padding - 10} y={y + 4} className="grid-axis-text text-right">
                {Math.round(val)} L
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, idx) => {
          const barWidth = Math.min(24, chartWidth / data.length - 12);
          const barHeight = (d.valor * chartHeight) / maxVal;
          const x = padding + (idx * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
          const y = padding + chartHeight - barHeight;

          return (
            <g key={idx}>
              {/* Bar background path or rect */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx="4"
                ry="4"
                fill={hoveredBar === idx ? "var(--color-primary)" : "rgba(0, 230, 118, 0.4)"}
                className="chart-bar"
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{ cursor: 'pointer', transition: 'fill var(--transition-fast)' }}
              />
              {/* Tooltip */}
              {hoveredBar === idx && (
                <g className="chart-tooltip">
                  <rect
                    x={x + barWidth / 2 - 40}
                    y={y - 35}
                    width="80"
                    height="22"
                    rx="4"
                    fill="rgba(5, 11, 7, 0.95)"
                    stroke="var(--color-primary)"
                    strokeWidth="1"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 20}
                    textAnchor="middle"
                    className="tooltip-text"
                  >
                    {d.valor} L
                  </text>
                </g>
              )}
              {/* X axis labels */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 18}
                textAnchor="middle"
                className="grid-axis-text"
              >
                {d.fecha}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
