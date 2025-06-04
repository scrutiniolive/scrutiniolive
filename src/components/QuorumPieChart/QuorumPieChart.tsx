import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
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
    const [isAnimating, setIsAnimating] = useState(false);

    // Motion values per animazioni fluide
    const animatedPercentage = useMotionValue(0);
    const displayPercentage = useTransform(
        animatedPercentage,
        (latest) => `${latest.toFixed(1)}%`
    );

    const calculations = useMemo(() => {
        const totalVotes = quesito.si + quesito.no + quesito.blankNull;

        const participationPercentage = totalVotes > 0 ? (totalVotes / totalAbitanti) * 100 : 0;

        // Calcola la percentuale esatta necessaria per il quorum (50% + 1 voto)
        const exactQuorumPercentage = ((Math.floor(totalAbitanti * 0.5) + 1) / totalAbitanti) * 100;

        // Verifica se il quorum è raggiunto
        const quorumReached = participationPercentage >= exactQuorumPercentage;

        const siPercentageOfTotal = (quesito.si / totalAbitanti) * 100;
        const noPercentageOfTotal = (quesito.no / totalAbitanti) * 100;
        const blankNullPercentageOfTotal = (quesito.blankNull / totalAbitanti) * 100;

        const siPercentage = totalVotes > 0 ? (quesito.si / totalVotes) * 100 : 0;
        const noPercentage = totalVotes > 0 ? (quesito.no / totalVotes) * 100 : 0;
        const blankNullPercentage = totalVotes > 0 ? (quesito.blankNull / totalVotes) * 100 : 0;

        return {
            totalVotes,
            participationPercentage,
            quorumReached,
            siPercentage,
            noPercentage,
            blankNullPercentage,
            siPercentageOfTotal,
            noPercentageOfTotal,
            blankNullPercentageOfTotal,
            exactQuorumPercentage
        };
    }, [quesito.si, quesito.no, quesito.blankNull, totalAbitanti, quorumPercentage]);

    // Animazione della percentuale quando cambiano i dati
    useEffect(() => {
        setKey(prev => prev + 1);
        setIsAnimating(true);

        // Anima da 0 alla percentuale attuale
        const controls = animate(animatedPercentage, calculations.participationPercentage, {
            duration: 1.5,
            ease: "easeOut"
        });

        const animationTimer = setTimeout(() => {
            setIsAnimating(false);
        }, 2000);

        return () => {
            controls.stop();
            clearTimeout(animationTimer);
        };
    }, [quesito.si, quesito.no, quesito.blankNull, calculations.participationPercentage, animatedPercentage]);

    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    const strokeWidth = 40;
    const circumference = 2 * Math.PI * radius;

    const siLength = (calculations.siPercentageOfTotal / 100) * circumference;
    const noLength = (calculations.noPercentageOfTotal / 100) * circumference;
    const blankNullLength = (calculations.blankNullPercentageOfTotal / 100) * circumference;

    // Calcola la posizione della linea del quorum
    const quorumAngle = (calculations.exactQuorumPercentage / 100) * 2 * Math.PI - Math.PI / 2;
    const quorumX2 = centerX + (radius + strokeWidth / 2 + 15) * Math.cos(quorumAngle);
    const quorumY2 = centerY + (radius + strokeWidth / 2 + 15) * Math.sin(quorumAngle);

    // Calcola la posizione del testo con più offset
    const labelOffset = 15;

    // Varianti di animazione
    const chartVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="quorum-chart-container">
            <motion.h3
                className="quesito-title"
                key={`title-${currentQuesito}`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {quesito.name}
            </motion.h3>

            <div className="chart-wrapper">
                <motion.svg
                    className="quorum-pie-chart"
                    viewBox="0 0 300 340"
                    variants={chartVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '300px', height: '340px' }}
                >
                    {/* Cerchio di sfondo con animazione */}
                    <motion.circle
                        cx={centerX}
                        cy={centerY}
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />

                    {/* Gruppo ruotato per partire dall'alto */}
                    <g transform={`rotate(-90 ${centerX} ${centerY})`}>
                        <AnimatePresence mode="wait">
                            {/* Arco per il SI con effetto di disegno */}
                            {calculations.siPercentageOfTotal > 0 && (
                                <motion.circle
                                    key={`si-${key}-${calculations.siPercentageOfTotal}`}
                                    cx={centerX}
                                    cy={centerY}
                                    r={radius}
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={`${siLength} ${circumference}`}
                                    initial={{
                                        strokeDasharray: `0 ${circumference}`,
                                        opacity: 0,
                                        strokeWidth: 0
                                    }}
                                    animate={{
                                        strokeDasharray: `${siLength} ${circumference}`,
                                        opacity: 1,
                                        strokeWidth: strokeWidth
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        ease: [0.43, 0.13, 0.23, 0.96],
                                        strokeWidth: { duration: 0.5 }
                                    }}
                                />
                            )}

                            {/* Arco per il NO con effetto di disegno ritardato */}
                            {calculations.noPercentageOfTotal > 0 && (
                                <motion.circle
                                    key={`no-${key}-${calculations.noPercentageOfTotal}`}
                                    cx={centerX}
                                    cy={centerY}
                                    r={radius}
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={`0 ${siLength} ${noLength} ${circumference}`}
                                    initial={{
                                        strokeDasharray: `0 ${siLength} 0 ${circumference}`,
                                        opacity: 0,
                                        strokeWidth: 0
                                    }}
                                    animate={{
                                        strokeDasharray: `0 ${siLength} ${noLength} ${circumference}`,
                                        opacity: 1,
                                        strokeWidth: strokeWidth
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        ease: [0.43, 0.13, 0.23, 0.96],
                                        delay: 0.5,
                                        strokeWidth: { duration: 0.5, delay: 0.5 }
                                    }}
                                />
                            )}

                            {/* Arco per BIANCHE/NULLE con effetto di disegno ritardato */}
                            {calculations.blankNullPercentageOfTotal > 0 && (
                                <motion.circle
                                    key={`blank-${key}-${calculations.blankNullPercentageOfTotal}`}
                                    cx={centerX}
                                    cy={centerY}
                                    r={radius}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={`0 ${siLength + noLength} ${blankNullLength} ${circumference}`}
                                    initial={{
                                        strokeDasharray: `0 ${siLength + noLength} 0 ${circumference}`,
                                        opacity: 0,
                                        strokeWidth: 0
                                    }}
                                    animate={{
                                        strokeDasharray: `0 ${siLength + noLength} ${blankNullLength} ${circumference}`,
                                        opacity: 1,
                                        strokeWidth: strokeWidth
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        ease: [0.43, 0.13, 0.23, 0.96],
                                        delay: 1,
                                        strokeWidth: { duration: 0.5, delay: 1 }
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    </g>

                    {/* Linea del quorum con animazione di disegno */}
                    <motion.line
                        x1={centerX}
                        y1={centerY}
                        x2={centerX}
                        y2={centerY}
                        stroke="#1f2937"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        animate={{
                            x2: quorumX2,
                            y2: quorumY2,
                        }}
                        transition={{
                            duration: 1,
                            delay: 1,
                            ease: "easeOut"
                        }}
                    />

                    {/* Etichetta quorum con fade-in */}
                    <motion.text
                        x={quorumX2 + Math.abs(labelOffset) * Math.cos(quorumAngle)}
                        y={quorumY2 + Math.abs(labelOffset) * Math.sin(quorumAngle)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="quorum-label"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                    >
                        Quorum {quorumPercentage}% + 1
                    </motion.text>

                    {/* Centro con percentuale di partecipazione */}
                    <motion.circle
                        cx={centerX}
                        cy={centerY}
                        r={radius - strokeWidth - 10}
                        fill="white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
                    />

                    {/* Testi centrali con animazione contatore */}
                    <motion.g
                        key={`text-${key}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <text
                            x={centerX}
                            y={centerY - 20}
                            textAnchor="middle"
                            className={`center-percentage ${isAnimating ? 'animating' : ''}`}
                        >
                            <motion.tspan className="percentage-value">
                                {displayPercentage}
                            </motion.tspan>
                        </text>
                        <text x={centerX} y={centerY + 5} textAnchor="middle" className="center-label">
                            Affluenza
                        </text>
                        <motion.text
                            x={centerX}
                            y={centerY + 30}
                            textAnchor="middle"
                            className={`quorum-status ${calculations.quorumReached ? 'reached' : 'not-reached'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                        >
                            {calculations.quorumReached ? '✓ Quorum Raggiunto' : '✗ Quorum Non Raggiunto'}
                        </motion.text>
                    </motion.g>
                </motion.svg>

                {/* Legenda laterale con animazione stagger */}
                <motion.div
                    className="vote-legend"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <motion.div
                        className="legend-item si"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div
                            className="legend-color"
                            style={{ backgroundColor: '#22c55e' }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7, type: "spring" }}
                        />
                        <div className="legend-info">
                            <span className="legend-label">SÌ</span>
                            <motion.span
                                className="legend-value"
                                key={`si-value-${quesito.si}`}
                                initial={{ scale: 1.5, color: '#22c55e' }}
                                animate={{ scale: 1, color: '#000' }}
                                transition={{ duration: 0.5 }}
                            >
                                {quesito.si.toLocaleString('it-IT')}
                            </motion.span>
                            <span className="legend-percentage">{calculations.siPercentage.toFixed(1)}% del totale dei voti</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="legend-item no"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div
                            className="legend-color"
                            style={{ backgroundColor: '#ef4444' }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.9, type: "spring" }}
                        />
                        <div className="legend-info">
                            <span className="legend-label">NO</span>
                            <motion.span
                                className="legend-value"
                                key={`no-value-${quesito.no}`}
                                initial={{ scale: 1.5, color: '#ef4444' }}
                                animate={{ scale: 1, color: '#000' }}
                                transition={{ duration: 0.5 }}
                            >
                                {quesito.no.toLocaleString('it-IT')}
                            </motion.span>
                            <span className="legend-percentage">{calculations.noPercentage.toFixed(1)}% del totale dei voti</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="legend-item blank-null"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div
                            className="legend-color"
                            style={{ backgroundColor: '#3b82f6' }}  // Cambiato da grigio a blu
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.1, type: "spring" }}
                        />
                        <div className="legend-info">
                            <span className="legend-label">BIANCHE/NULLE</span>
                            <motion.span
                                className="legend-value"
                                key={`blank-value-${quesito.blankNull}`}
                                initial={{ scale: 1.5, color: '#9ca3af' }}
                                animate={{ scale: 1, color: '#000' }}
                                transition={{ duration: 0.5 }}
                            >

                            </motion.span>
                            <span className="legend-percentage">{calculations.blankNullPercentage.toFixed(1)}% del totale dei voti</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="legend-divider"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    />

                    <motion.div
                        className="legend-item total"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        whileHover={{ scale: 1.05 }}
                    >
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
                    </motion.div>

                    <motion.div
                        className="legend-item non-votanti"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.6 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="legend-info">
                            <span className="legend-label">Non votanti</span>
                            <motion.span
                                className="legend-value"
                                key={`non-votanti-${totalAbitanti - calculations.totalVotes}`}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {(totalAbitanti - calculations.totalVotes).toLocaleString('it-IT')}
                            </motion.span>
                            <span className="legend-percentage">
                                {((totalAbitanti - calculations.totalVotes) / totalAbitanti * 100).toFixed(1)}%
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Navigazione quesiti con animazione */}
            <motion.div
                className="quesiti-navigation"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                {data.map((_, index) => (
                    <motion.button
                        key={index}
                        className={`quesito-button ${currentQuesito === index + 1 ? 'active' : ''}`}
                        onClick={() => onQuesitoChange(index + 1)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: 0.8 + (index * 0.1),
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                        }}
                    >
                        Q{index + 1}
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};

export default QuorumPieChart;