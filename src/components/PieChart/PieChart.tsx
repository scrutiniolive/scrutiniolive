import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { DataItem } from '../../types';
import './PieChart.css';

interface PieChartProps {
  data: DataItem[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const [animatedData, setAnimatedData] = useState<DataItem[]>([]);
  
  useEffect(() => {
    // Animazione progressiva
    const timeout = setTimeout(() => {
      setAnimatedData(data);
    }, 100);
    return () => clearTimeout(timeout);
  }, [data]);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // Inizia dall'alto

  return (
    <div className="pie-chart-container">
      <svg className="pie-chart" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#f0f0f0"
          strokeWidth="3"
        />
        
        {animatedData.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          
          // Calcola il percorso dell'arco
          const circumference = 2 * Math.PI * 80;
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -(startAngle / 360) * circumference;
          
          return (
            <motion.circle
              key={item.id}
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={item.color}
              strokeWidth="40"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ 
                duration: 1.5, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
              className="pie-segment"
            />
          );
        })}
        
        {/* Centro bianco */}
        <circle cx="100" cy="100" r="60" fill="white" />
        
        {/* Percentuale totale al centro */}
        <text x="100" y="100" textAnchor="middle" className="center-text">
          <tspan x="100" dy="-5" className="total-label">Total</tspan>
          <tspan x="100" dy="25" className="total-value">{total}</tspan>
        </text>
      </svg>
      
      {/* Legenda */}
      <div className="pie-legend">
        {data.map((item) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <motion.div
              key={item.id}
              className="legend-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span 
                className="legend-color" 
                style={{ backgroundColor: item.color }}
              />
              <span className="legend-name">{item.name}</span>
              <span className="legend-value">{percentage}%</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChart;