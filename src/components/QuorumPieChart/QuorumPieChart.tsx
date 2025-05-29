import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VoteData } from '../../types';
import './QuorumPieChart.css';

interface QuorumPieChartProps {
  data: VoteData[];
  totalAbitanti: number;
  quorumPercentage: number;
  currentQuesito: number;
  onQuesitoChange: (quesito: number) => void;
}

const QuorumPieChart: React.FC<QuorumPieChartProps> = ({ 
  data, 
  totalAbitanti, 
  quorumPercentage,
  currentQuesito,
  onQuesitoChange
}) => {
  const quesito = data[currentQuesito - 1];
  const [key, setKey] = useState(0);
  
  // Forza re-render quando cambiano i dati
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [quesito.si, quesito.no]);
  
  const calculations = useMemo(() => {
    const totalVotes = quesito.si + quesito.no;
    const participationPercentage = totalVotes > 0 ? (totalVotes / totalAbitanti) * 100 : 0;
    const quorumReached = participationPercentage >= quorumPercentage;
    const siPercentage = totalVotes > 0 ? (quesito.si / totalVotes) * 100 : 0;
    const noPercentage = totalVotes > 0 ? (quesito.no / totalVotes) * 100 : 0;
    
    return {
      totalVotes,
      participationPercentage,
      quorumReached,
      siPercentage,
      noPercentage
    };
  }, [quesito.si, quesito.no, totalAbitanti, quorumPercentage]);

  const radius = 120;
  const centerX = 150;
  const centerY = 150;
  const strokeWidth = 40;
  const circumference = 2 * Math.PI * radius;
  
  // Calcola i valori per gli archi
  const siLength = (calculations.siPercentage / 100) * circumference;
  const noLength = (calculations.noPercentage / 100) * circumference;
  const siOffset = circumference / 4;
  const noOffset = circumference / 4 - siLength;
  
  // Calcola la posizione della linea del quorum
  const quorumAngle = (quorumPercentage / 100) * 2 * Math.PI - Math.PI / 2;
  const quorumX1 = centerX + (radius - strokeWidth/2) * Math.cos(quorumAngle);
  const quorumY1 = centerY + (radius - strokeWidth/2) * Math.sin(quorumAngle);
  const quorumX2 = centerX + (radius + strokeWidth/2) * Math.cos(quorumAngle);
  const quorumY2 = centerY + (radius + strokeWidth/2) * Math.sin(quorumAngle);

  return (
    <div className="quorum-chart-container">
      <h3 className="quesito-title">{quesito.name}</h3>
      
      <div className="chart-wrapper">
        <svg className="quorum-pie-chart" viewBox="0 0 300 300">
          {/* Cerchio di sfondo (non votanti) */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          
          <AnimatePresence mode="wait">
            {/* Arco per il SI - con key per forzare re-render */}
            {calculations.siPercentage > 0 && (
              <motion.circle
                key={`si-${key}-${calculations.siPercentage}`}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#22c55e"
                strokeWidth={strokeWidth}
                strokeDasharray={`${siLength} ${circumference}`}
                initial={{ 
                  strokeDashoffset: circumference + siOffset,
                  opacity: 0 
                }}
                animate={{ 
                  strokeDashoffset: siOffset,
                  opacity: 1 
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            )}
            
            {/* Arco per il NO - con key per forzare re-render */}
            {calculations.noPercentage > 0 && (
              <motion.circle
                key={`no-${key}-${calculations.noPercentage}`}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#ef4444"
                strokeWidth={strokeWidth}
                strokeDasharray={`${noLength} ${circumference}`}
                initial={{ 
                  strokeDashoffset: circumference + noOffset,
                  opacity: 0 
                }}
                animate={{ 
                  strokeDashoffset: noOffset,
                  opacity: 1 
                }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            )}
          </AnimatePresence>
          
          {/* Linea del quorum */}
          <motion.line
            x1={centerX}
            y1={centerY}
            x2={quorumX2}
            y2={quorumY2}
            stroke="#1f2937"
            strokeWidth="3"
            strokeDasharray="5,5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          
          {/* Etichetta quorum */}
          <motion.text
            x={quorumX2 + 10}
            y={quorumY2}
            textAnchor="start"
            className="quorum-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Quorum {quorumPercentage}%
          </motion.text>
          
          {/* Centro con percentuale di partecipazione */}
          <circle cx={centerX} cy={centerY} r={radius - strokeWidth - 10} fill="white" />
          
          {/* Testi centrali con animazione */}
          <motion.g
            key={`text-${key}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <text x={centerX} y={centerY - 20} textAnchor="middle" className="center-percentage">
              <tspan className="percentage-value">
                {calculations.participationPercentage.toFixed(1)}%
              </tspan>
            </text>
            <text x={centerX} y={centerY + 5} textAnchor="middle" className="center-label">
              Affluenza
            </text>
            <text 
              x={centerX} 
              y={centerY + 30} 
              textAnchor="middle" 
              className={`quorum-status ${calculations.quorumReached ? 'reached' : 'not-reached'}`}
            >
              {calculations.quorumReached ? '✓ Quorum Raggiunto' : '✗ Quorum Non Raggiunto'}
            </text>
          </motion.g>
        </svg>
        
        {/* Legenda laterale con key per aggiornamento */}
        <motion.div 
          className="vote-legend"
          key={`legend-${key}`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="legend-item si">
            <div className="legend-color" style={{ backgroundColor: '#22c55e' }} />
            <div className="legend-info">
              <span className="legend-label">SÌ</span>
              <motion.span 
                className="legend-value"
                key={`si-value-${quesito.si}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {quesito.si.toLocaleString('it-IT')}
              </motion.span>
              <span className="legend-percentage">{calculations.siPercentage.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="legend-item no">
            <div className="legend-color" style={{ backgroundColor: '#ef4444' }} />
            <div className="legend-info">
              <span className="legend-label">NO</span>
              <motion.span 
                className="legend-value"
                key={`no-value-${quesito.no}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {quesito.no.toLocaleString('it-IT')}
              </motion.span>
              <span className="legend-percentage">{calculations.noPercentage.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="legend-divider" />
          
          <div className="legend-item total">
            <div className="legend-info">
              <span className="legend-label">Votanti</span>
              <motion.span 
                className="legend-value"
                key={`total-${calculations.totalVotes}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {calculations.totalVotes.toLocaleString('it-IT')}
              </motion.span>
              <span className="legend-percentage">su {totalAbitanti.toLocaleString('it-IT')}</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Navigazione quesiti */}
      <div className="quesiti-navigation">
        {data.map((_, index) => (
          <button
            key={index}
            className={`quesito-button ${currentQuesito === index + 1 ? 'active' : ''}`}
            onClick={() => onQuesitoChange(index + 1)}
          >
            Q{index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuorumPieChart;