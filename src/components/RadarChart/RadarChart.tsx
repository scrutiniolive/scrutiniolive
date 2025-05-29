import React from 'react';
import { motion } from 'framer-motion';
import type { DataItem } from '../../types';
import './RadarChart.css';

interface RadarChartProps {
  data: DataItem[];
  maxValue?: number; // Aggiungi questa prop
}

const RadarChart: React.FC<RadarChartProps> = ({ data, maxValue }) => {
  const calculatedMaxValue = maxValue || Math.max(...data.map(d => d.value));
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const angleStep = (2 * Math.PI) / data.length;

  // Genera punti per il poligono
  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const value = (item.value / calculatedMaxValue) * radius;
    const x = centerX + value * Math.cos(angle);
    const y = centerY + value * Math.sin(angle);
    return { x, y, angle, item };
  });

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Genera livelli della griglia
  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <div className="radar-chart-container">
      <svg className="radar-chart" viewBox="0 0 300 300">
        {/* Griglia di sfondo */}
        <g className="radar-grid">
          {gridLevels.map((level) => {
            const levelRadius = (level / 100) * radius;
            const levelPoints = data.map((_, index) => {
              const angle = index * angleStep - Math.PI / 2;
              const x = centerX + levelRadius * Math.cos(angle);
              const y = centerY + levelRadius * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ');

            return (
              <motion.polygon
                key={level}
                points={levelPoints}
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: level * 0.01 }}
              />
            );
          })}
        </g>

        {/* Linee radiali */}
        {data.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          return (
            <motion.line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#e0e0e0"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          );
        })}

        {/* Area del grafico */}
        <motion.polygon
          points={polygonPoints}
          fill={`${data[0]?.color || '#667eea'}40`}
          stroke={data[0]?.color || '#667eea'}
          strokeWidth="3"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="radar-area"
        />

        {/* Punti sui vertici */}
        {points.map((point, index) => (
          <motion.g key={point.item.id}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={point.item.color}
              stroke="white"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="radar-point"
            />
            
            {/* Valore al passaggio del mouse */}
            <motion.text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              className="radar-value"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {point.item.value}
            </motion.text>
          </motion.g>
        ))}

        {/* Etichette */}
        {data.map((item, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelRadius = radius + 25;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          
          return (
            <motion.g key={item.id}>
              {/* Icona */}
              <motion.image
                href={item.image}
                x={x - 15}
                y={y - 15}
                width="30"
                height="30"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="radar-icon"
              />
              
              {/* Nome */}
              <motion.text
                x={x}
                y={y + 25}
                textAnchor="middle"
                className="radar-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                {item.name}
              </motion.text>
            </motion.g>
          );
        })}

        {/* Centro */}
        <circle cx={centerX} cy={centerY} r="3" fill="#333" />
      </svg>

      {/* Statistiche */}
      <div className="radar-stats">
        <h3>Performance Overview</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Highest</span>
            <span className="stat-value" style={{ color: data[0]?.color }}>
              {data[0]?.name}: {data[0]?.value}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average</span>
            <span className="stat-value">
              {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Points</span>
            <span className="stat-value">
              {data.reduce((sum, item) => sum + item.value, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;