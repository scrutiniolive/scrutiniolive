// components/BarChartByQuestion/BarChartByQuestion.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { VoteData } from '../../types';
import './BarChartByQuestion.css';

interface BarChartByQuestionProps {
    data: VoteData[];
    currentQuesito: number;
    onQuesitoChange: (quesito: number) => void;
}

// In components/BarChartByQuestion/BarChartByQuestion.tsx

const BarChartByQuestion: React.FC<BarChartByQuestionProps> = ({
    data,
    currentQuesito,
    onQuesitoChange
}) => {
    const quesito = data[currentQuesito - 1];
    const totalVotes = quesito.si + quesito.no;
    const siPercentage = totalVotes > 0 ? (quesito.si / totalVotes) * 100 : 0;
    const noPercentage = totalVotes > 0 ? (quesito.no / totalVotes) * 100 : 0;

    const bars = [
        {
            id: 'si',
            label: 'SI',
            value: quesito.si,
            percentage: siPercentage,
            color: '#22c55e',
            image: '/images/yes-no/yes.png'
        },
        {
            id: 'no',
            label: 'NO',
            value: quesito.no,
            percentage: noPercentage,
            color: '#ef4444',
            image: '/images/yes-no/no.png'
        }
    ].sort((a, b) => b.value - a.value);

    // Controlla se c'è parità
    const isParity = quesito.si === quesito.no;
    const hasVotes = totalVotes > 0;

    return (
        <div className="bar-chart-by-question">
            <h3 className="question-title">{quesito.name}</h3>

            <div className="bars-container">
                {bars.map((bar, index) => (
                    <motion.div
                        key={bar.id}
                        className="bar-row"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            y: index * 80
                        }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="bar-left">
                            <img src={`${import.meta.env.BASE_URL}${bar.image}`} alt={bar.label} className="option-image" />

                            <span className="option-label">{bar.label}</span>
                        </div>

                        <div className="bar-container">
                            <motion.div
                                className="bar-fill"
                                style={{ backgroundColor: bar.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${bar.percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                            <div className="bar-stats">
                                <span className="vote-count">{bar.value.toLocaleString('it-IT')} voti</span>
                                <span className="vote-percentage">{bar.percentage.toFixed(1)}%</span>
                            </div>
                        </div>

                        {/* Mostra corona solo se non c'è parità e ha voti */}
                        {index === 0 && hasVotes && !isParity && (
                            <motion.div
                                className="leading-indicator"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                👑
                            </motion.div>
                        )}

                        {/* Mostra simbolo di parità su entrambe le barre */}
                        {isParity && hasVotes && (
                            <motion.div
                                className="parity-indicator"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                🤝
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="question-stats">
                <div className="stat-item">
                    <span className="stat-label">Totale voti:</span>
                    <span className="stat-value">{totalVotes.toLocaleString('it-IT')}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Maggioranza:</span>
                    {!hasVotes ? (
                        <span className="stat-value" style={{ color: '#6b7280' }}>
                            In attesa di voti
                        </span>
                    ) : isParity ? (
                        <span className="stat-value" style={{ color: '#f59e0b' }}>
                            Parità ({siPercentage.toFixed(1)}%)
                        </span>
                    ) : (
                        <span className="stat-value" style={{ color: bars[0].color }}>
                            {bars[0].label} ({bars[0].percentage.toFixed(1)}%)
                        </span>
                    )}
                </div>
            </div>

            {/* Navigazione quesiti */}
            <div className="question-navigation">
                {data.map((_, index) => (
                    <button
                        key={index}
                        className={`question-button ${currentQuesito === index + 1 ? 'active' : ''}`}
                        onClick={() => onQuesitoChange(index + 1)}
                    >
                        Q{index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BarChartByQuestion;