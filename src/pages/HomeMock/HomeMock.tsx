import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuorumPieChart from '../../components/QuorumPieChart/QuorumPieChart';
import type { VoteData } from '../../types';
import './HomeMock.css';
import BarChartByQuestion from '../../components/BarChartByQuestion/BarChartByQuestion';

type ChartType = 'bar' | 'quorum';

// Helper per mappare i colori
const QUESITO_COLORS: { [key: number]: string } = {
    1: '#8884d8',
    2: '#82ca9d',
    3: '#ffc658',
    4: '#ff7c7c',
    5: '#8dd1e1'
};

// Simulatore di dati
class DataSimulator {
    private baseData: VoteData[] = [
        { id: 1, name: 'Cittadinanza: dimezzamento da 10 a 5 anni', si: 0, no: 0, color: QUESITO_COLORS[1] },
        { id: 2, name: 'Cannabis: depenalizzazione coltivazione domestica', si: 0, no: 0, color: QUESITO_COLORS[2] },
        { id: 3, name: 'Eutanasia: introduzione del "rifiuto delle cure"', si: 0, no: 0, color: QUESITO_COLORS[3] },
        { id: 4, name: 'Giustizia: separazione delle carriere', si: 0, no: 0, color: QUESITO_COLORS[4] },
        { id: 5, name: 'Giustizia: limiti alla custodia cautelare', si: 0, no: 0, color: QUESITO_COLORS[5] }
    ];

    private votingProgress = 0;
    private totalPeople = 46747;

    constructor() {
        // Inizializza con alcuni voti casuali
        this.baseData = this.baseData.map(item => ({
            ...item,
            si: Math.floor(Math.random() * 1000),
            no: Math.floor(Math.random() * 1000)
        }));
    }

    getNextData() {
        // Simula progresso votazione
        this.votingProgress = Math.min(this.votingProgress + Math.random() * 2, 100);

        // Aggiorna i voti con incrementi casuali
        this.baseData = this.baseData.map(item => {
            const siIncrement = Math.floor(Math.random() * 50);
            const noIncrement = Math.floor(Math.random() * 50);

            return {
                ...item,
                si: item.si + siIncrement,
                no: item.no + noIncrement
            };
        });

        return {
            data: [...this.baseData],
            votersInfo: {
                totalPeople: this.totalPeople,
                totalVoters: Math.floor((this.votingProgress / 100) * this.totalPeople),
                turnoutPercentage: this.votingProgress,
                isLive: this.votingProgress < 95 // Simula live fino al 95%
            }
        };
    }
}

const HomeMock: React.FC = () => {
    // Stati per i dati
    const [referendumData, setReferendumData] = useState<VoteData[]>([]);

    // Stati UI
    const [currentChart, setCurrentChart] = useState<ChartType>('quorum');
    const [currentQuesito, setCurrentQuesito] = useState(1);
    const [isLive, setIsLive] = useState(false);
    const [totalAbitanti, setTotalAbitanti] = useState(46747);
    const [quorumPercentage, setQuorumPercentage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updateButtonState, setUpdateButtonState] = useState<'idle' | 'loading' | 'completed'>('idle');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateKey, setUpdateKey] = useState(0);

    // Refs
    const intervalRef = useRef<number | null>(null);
    const isUpdatingRef = useRef(false);
    const simulatorRef = useRef(new DataSimulator());

    const charts: ChartType[] = ['quorum', 'bar'];
    const currentIndex = charts.indexOf(currentChart);

    // Funzione per simulare il recupero dati
    const fetchLatestData = async () => {
        // Simula delay di rete
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

        const { data, votersInfo } = simulatorRef.current.getNextData();

        setReferendumData(data);
        setQuorumPercentage(50);
        setTotalAbitanti(votersInfo.totalPeople);

        // Incrementa updateKey per forzare il refresh
        setUpdateKey(prev => prev + 1);

        return votersInfo;
    };

    // Aggiornamento automatico (per intervallo)
    const automaticUpdate = useCallback(async () => {
        if (isUpdatingRef.current || updateButtonState === 'loading' || isUpdating) {
            console.log('Skip automatic update - manual update in progress');
            return;
        }

        try {
            console.log('🔄 Automatic update (simulated)');
            const votersInfo = await fetchLatestData();

            // Gestisci cambio stato live
            if (!votersInfo.isLive && intervalRef.current) {
                stopLiveUpdate();
            }
        } catch (err) {
            console.error('Error in automatic update:', err);
            setError('Errore nell\'aggiornamento automatico');
            stopLiveUpdate();
        }
    }, [updateButtonState, isUpdating]);

    // Aggiornamento manuale
    const manualUpdate = async () => {
        console.log('🔄 manualUpdate chiamato (simulated)');
        if (isUpdatingRef.current || isUpdating || updateButtonState !== 'idle') {
            console.log('❌ Update già in corso, SKIP');
            return;
        }

        try {
            isUpdatingRef.current = true;
            setIsUpdating(true);
            setUpdateButtonState('loading');
            setError(null);

            const startTime = Date.now();
            const votersInfo = await fetchLatestData();

            const elapsedTime = Date.now() - startTime;
            const minimumLoadingTime = 1500;
            if (elapsedTime < minimumLoadingTime) {
                await new Promise(resolve => setTimeout(resolve, minimumLoadingTime - elapsedTime));
            }

            setUpdateButtonState('completed');
            setTimeout(() => {
                setUpdateButtonState('idle');
                setIsUpdating(false);
            }, 2000);

            // Gestione live state
            if (votersInfo.isLive) {
                if (!intervalRef.current) {
                    console.log('📡 Avvio live update simulato');
                    startLiveUpdate();
                }
            } else {
                if (intervalRef.current || isLive) {
                    console.log('📴 Fermo live update');
                    stopLiveUpdate();
                }
            }
        } catch (err) {
            console.error('Error in manual update:', err);
            setError('Errore nell\'aggiornamento dei voti');
            setUpdateButtonState('idle');
            setIsUpdating(false);
        } finally {
            isUpdatingRef.current = false;
        }
    };

    // Start live update
    const startLiveUpdate = useCallback(() => {
        console.log('🟢 Starting live update (simulated)');

        if (intervalRef.current) {
            console.log('⚠️ Intervallo già esistente, SKIP');
            return;
        }

        setIsLive(true);
        intervalRef.current = window.setInterval(() => {
            console.log('⏰ Tick automatico simulato');
            automaticUpdate();
        }, 5000); // Più frequente per la demo

        console.log('✅ Intervallo simulato creato:', intervalRef.current);
    }, [automaticUpdate]);

    // Stop live update
    const stopLiveUpdate = useCallback(() => {
        console.log('🔴 Stopping live update');
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsLive(false);
    }, []);

    // Carica i dati iniziali
    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            console.log('🚀 Caricamento dati simulati iniziali...');
            try {
                setIsLoading(true);
                setError(null);

                // Simula delay iniziale
                await new Promise(resolve => setTimeout(resolve, 1000));

                const votersInfo = await fetchLatestData();

                if (!isMounted) return;

                if (votersInfo.isLive) {
                    console.log('📡 Simulazione live attiva');
                    startLiveUpdate();
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error loading initial data:', err);
                    setError('Errore nel caricamento dei dati simulati.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            console.log('🧹 Cleanup simulatore');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setIsLive(false);
        };
    }, []);

    // Handler navigazione
    const handleQuesitoChange = (newQuesito: number) => {
        setCurrentQuesito(newQuesito);
    };

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? charts.length - 1 : currentIndex - 1;
        setCurrentChart(charts[newIndex]);
    };

    const goToNext = () => {
        const newIndex = currentIndex === charts.length - 1 ? 0 : currentIndex + 1;
        setCurrentChart(charts[newIndex]);
    };

    const getChartTitle = () => {
        switch (currentChart) {
            case 'bar':
                return 'Dettaglio Quesiti';
            case 'quorum':
                return 'Quorum';
        }
    };

    // Gestione stati di caricamento ed errore
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Caricamento dati simulati...</div>
            </div>
        );
    }

    if (error && !referendumData.length) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button onClick={() => window.location.reload()}>Ricarica</button>
            </div>
        );
    }

    return (
        <motion.div
            key="home"
            className="home-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            {/* Banner simulazione */}
            <div style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#92400e'
            }}>
                ⚠️ Modalità simulazione - Dati di test
            </div>

            {/* Header section con navigazione e pulsante aggiorna */}
            <div className="header-section">
                <div className="chart-navigation">
                    <button
                        className="nav-arrow nav-prev"
                        onClick={(e) => {
                            goToPrevious();
                            e.currentTarget.blur();
                        }}
                        aria-label="Grafico precedente"
                    >
                        ‹
                    </button>
                    <h1 className="title">
                        {getChartTitle()}
                        {isLive && (
                            <span className="live-indicator-inline">
                                <span className="live-dot-blink"></span>
                                LIVE (DEMO)
                            </span>
                        )}
                    </h1>
                    <button
                        className="nav-arrow nav-next"
                        onClick={(e) => {
                            goToNext();
                            e.currentTarget.blur();
                        }}
                        aria-label="Grafico successivo"
                    >
                        ›
                    </button>
                </div>

                {/* Pulsante aggiorna */}
                <div className="update-button-container">
                    <button
                        className={`update-button ${updateButtonState !== 'idle' ? 'active' : ''}`}
                        onClick={manualUpdate}
                        disabled={updateButtonState !== 'idle' || isUpdatingRef.current || isUpdating}
                        aria-label={
                            updateButtonState === 'loading' ? 'Aggiornamento in corso' :
                                updateButtonState === 'completed' ? 'Aggiornamento completato' :
                                    'Aggiorna dati'
                        }
                    >
                        {updateButtonState === 'idle' && (
                            <>
                                <span aria-hidden="true">🔄</span>
                                Aggiorna
                            </>
                        )}
                        {updateButtonState === 'loading' && (
                            <>
                                <span className="loading-spinner-small" aria-hidden="true"></span>
                                In corso...
                            </>
                        )}
                        {updateButtonState === 'completed' && (
                            <>
                                <span aria-hidden="true">✓</span>
                                Completato
                            </>
                        )}
                    </button>
                </div>
            </div>



            {/* Indicatori di navigazione */}
            <div className="chart-indicator" role="tablist">
                {charts.map((chart) => (
                    <span
                        key={chart}
                        className={`indicator-dot ${chart === currentChart ? 'active' : ''}`}
                        onClick={() => setCurrentChart(chart)}
                        role="tab"
                        aria-selected={chart === currentChart}
                        aria-label={`Visualizza grafico ${chart === 'bar' ? 'a barre' : 'quorum'}`}
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setCurrentChart(chart);
                            }
                        }}
                    />
                ))}
            </div>



            {/* Container per i grafici */}
            <div className="chart-container" role="main">
                <AnimatePresence mode="wait">
                    {currentChart === 'bar' && (
                        <motion.div
                            key={`bar-chart-${updateKey}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                            aria-label="Grafico a barre dei voti"
                        >
                            <BarChartByQuestion
                                data={referendumData}
                                currentQuesito={currentQuesito}
                                onQuesitoChange={handleQuesitoChange}
                            />
                        </motion.div>
                    )}

                    {currentChart === 'quorum' && (
                        <motion.div
                            key={`quorum-chart-${updateKey}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                            aria-label="Grafico del quorum"
                        >
                            <QuorumPieChart
                                data={referendumData}
                                totalAbitanti={totalAbitanti}
                                quorumPercentage={quorumPercentage}
                                currentQuesito={currentQuesito}
                                onQuesitoChange={handleQuesitoChange}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Info debug per simulazione */}
            <div style={{
                marginTop: '20px',
                padding: '10px',
                background: '#f3f4f6',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center'
            }}>
                Simulazione: {quorumPercentage.toFixed(1)}% affluenza |
                {isLive ? ' Aggiornamento automatico ogni 5 secondi' : ' Votazione conclusa'}
            </div>
        </motion.div>
    );
};

export default React.memo(HomeMock);