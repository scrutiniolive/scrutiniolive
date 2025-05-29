import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { DataItem } from '../../types';
import './LineChart.css';

interface LineChartProps {
  data: DataItem[];
}

interface HistoricalData {
  [key: number]: number[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalData>({});
  const maxPoints = 10;
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = 40;

  useEffect(() => {
    // Aggiungi i dati correnti allo storico
    setHistoricalData(prev => {
      const newData = { ...prev };
      data.forEach(item => {
        if (!newData[item.id]) {
          newData[item.id] = [];
        }
        newData[item.id] = [...newData[item.id], item.value].slice(-maxPoints);
      });
      return newData;
    });
  }, [data]);

  const xScale = (index: number) => {
    return padding + (index * (chartWidth - 2 * padding)) / (maxPoints - 1);
  };

  const yScale = (value: number) => {
    return chartHeight - padding - ((value / 100) * (chartHeight - 2 * padding));
  };

  return (
    <div className="line-chart-container">
      <svg className="line-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Griglia */}
        <g className="grid">
          {/* Linee orizzontali */}
          {[0, 25, 50, 75, 100].map(value => (
            <g key={value}>
              <line
                x1={padding}
                y1={yScale(value)}
                x2={chartWidth - padding}
                y2={yScale(value)}
                stroke="#e0e0e0"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={yScale(value) + 5}
                textAnchor="end"
                className="axis-label"
              >
                {value}
              </text>
            </g>
          ))}
        </g>

        {/* Linee dei dati */}
        {data.map((item) => {
          const points = historicalData[item.id] || [];
          const pathData = points
            .map((value, index) => {
              const x = xScale(index);
              const y = yScale(value);
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');

          return (
            <g key={item.id}>
              {/* Linea */}
              <motion.path
                d={pathData}
                fill="none"
                stroke={item.color}
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="data-line"
              />

              {/* Punti */}
              {points.map((value, index) => (
                <motion.circle
                  key={index}
                  cx={xScale(index)}
                  cy={yScale(value)}
                  r="5"
                  fill={item.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="data-point"
                />
              ))}

              {/* Etichetta finale */}
              {points.length > 0 && (
                <motion.g
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <rect
                    x={chartWidth - padding + 10}
                    y={yScale(points[points.length - 1]) - 12}
                    width={60}
                    height={24}
                    rx={12}
                    fill={item.color}
                    className="label-bg"
                  />
                  <text
                    x={chartWidth - padding + 40}
                    y={yScale(points[points.length - 1]) + 4}
                    textAnchor="middle"
                    className="label-text"
                    fill="white"
                  >
                    {item.name}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}

        {/* Asse X */}
        <line
          x1={padding}
          y1={chartHeight - padding}
          x2={chartWidth - padding}
          y2={chartHeight - padding}
          stroke="#333"
          strokeWidth="2"
        />

        {/* Asse Y */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={chartHeight - padding}
          stroke="#333"
          strokeWidth="2"
        />
      </svg>

      {/* Legenda */}
      <div className="line-legend">
        {data.map((item) => (
          <div key={item.id} className="legend-item">
            <span 
              className="legend-color" 
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-name">{item.name}</span>
            <span className="legend-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineChart;