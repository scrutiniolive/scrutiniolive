import React from 'react';
import { motion } from 'framer-motion';
import type { BarProps } from '../../types';
import './Bar.css';

const Bar: React.FC<BarProps> = ({ item, index, maxValue }) => {
  const percentage = (item.value / maxValue) * 100;
  
  return (
    <motion.div
      className="bar-wrapper"
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: index * 70,
        transition: {
          y: { type: "spring", stiffness: 300, damping: 30 }
        }
      }}
      exit={{ opacity: 0 }}
    >
      <div className="bar-content">
        <motion.img 
          src={item.image} 
          alt={item.name}
          className="bar-image"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        />
        
        <div className="bar-info">
          <span className="bar-label">{item.name}</span>
        </div>
        
        <div className="bar-chart">
          <motion.div
            className="bar"
            style={{ backgroundColor: item.color }}
            initial={{ width: 0 }}
            animate={{ 
              width: `${percentage}%`,
              transition: {
                duration: 1,
                ease: "easeOut"
              }
            }}
          />
          {/* Valore sempre visibile fuori dalla barra */}
          <span className="bar-value-outside">
            {item.value.toLocaleString('it-IT')}
          </span>
        </div>
      </div>
      
      {item.value > maxValue * 0.5 && (
        <motion.div
          className="winner-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
};

export default Bar;