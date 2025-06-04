import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuorumPieChart from '../../components/QuorumPieChart/QuorumPieChart';
import type { DataItem, VoteData } from '../../types';
import {
    createBarData,
    createRadarData,
} from '../../data/initialData';
import './Home.css';
import BarChartByQuestion from '../../components/BarChartByQuestion/BarChartByQuestion';
import { Configuration, DisplayControllerApi, type VoteDataResponse } from '../../api/generated/src';

type ChartType = 'bar' | 'quorum';

// Configurazione API
const apiConfig = new Configuration({
    basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// Istanza dell'API
const referendumApi = new DisplayControllerApi(apiConfig);

// Helper per mappare i colori
const QUESITO_COLORS: { [key: number]: string } = {
    1: '#8884d8',
    2: '#82ca9d',
    3: '#ffc658',
    4: '#ff7c7c',
    5: '#8dd1e1'
};

const Home: React.FC = () => {
    // Stati per i dati
    const [referendumData, setReferendumData] = useState<VoteData[]>([]);
    const [_barData, setBarData] = useState<DataItem[]>([]);
    const [_radarData, setRadarData] = useState<DataItem[]>([]);

    // Stati UI
    const [currentChart, setCurrentChart] = useState<ChartType>('quorum');
    const [currentQuesito, setCurrentQuesito] = useState(1);
    const [isLive, setIsLive] = useState(false);
    const [totalAbitanti, setTotalAbitanti] = useState(46747);
    const [quorumPercentage, setQuorumPercentage] = useState(50);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updateButtonState, setUpdateButtonState] = useState<'idle' | 'loading' | 'completed'>('idle');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateKey, setUpdateKey] = useState(0);


    // Refs
    const intervalRef = useRef<number | null>(null);
    const isUpdatingRef = useRef(false);
    const isInitializedRef = useRef(false);

    const charts: ChartType[] = ['quorum', 'bar'];
    const currentIndex = charts.indexOf(currentChart);

    // Funzione per mappare VoteDataResponse a VoteData
    const mapResponseToVoteData = (data: VoteDataResponse[]): VoteData[] => {
        return data.map(item => {
            const id = item.id ?? 0;
            const quesito = item.quesito ?? '';
            const si = item.si ?? 0;
            const no = item.no ?? 0;
            const blankNull = item.blank ?? 0;
            return {
                id,
                name: quesito,
                si,
                no,
                blankNull,
                color: QUESITO_COLORS[id] || '#666'
            };
        });
    };

    // Funzione base per recuperare i dati - CORRETTA
    // Modifica la funzione fetchLatestData per incrementare updateKey
    const fetchLatestData = async () => {
        // Chiamate sequenziali per evitare duplicati
        const votersInfo = await referendumApi.getTotalVoters();
        const votesData = await referendumApi.statsVote();
        const mappedData = mapResponseToVoteData(votesData);

        setReferendumData(mappedData);
        setBarData(createBarData(mappedData));
        setRadarData(createRadarData(mappedData));
        setQuorumPercentage(votersInfo.turnoutPercentage || 0);
        setTotalAbitanti(votersInfo.totalPeople || 0);

        // Incrementa updateKey per forzare il refresh
        setUpdateKey(prev => prev + 1);

        return votersInfo;
    };

    // Aggiornamento automatico (per intervallo)
    const automaticUpdate = useCallback(async () => {
        // Skip se già in aggiornamento manuale
        if (isUpdatingRef.current || updateButtonState === 'loading' || isUpdating) {
            console.log('Skip automatic update - manual update in progress');
            return;
        }

        try {
            console.log('🔄 Automatic update');
            const votersInfo = await fetchLatestData();

            // Gestisci cambio stato live dal server
            if (!votersInfo.isLive && intervalRef.current) {
                stopLiveUpdate();
            }
        } catch (err) {
            console.error('Error in automatic update:', err);
            setError('Errore nell\'aggiornamento automatico');
            stopLiveUpdate();
        }
    }, [updateButtonState, isUpdating]);

    // Aggiornamento manuale (per pulsante) - CORRETTA
    // 5. Nel manualUpdate, controlla meglio le condizioni
    const manualUpdate = async () => {
        console.log('🔄 manualUpdate chiamato');

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

            // Gestione live state migliorata
            if (votersInfo.isLive) {
                if (!intervalRef.current) {
                    console.log('📡 Avvio live update da manualUpdate');
                    startLiveUpdate();
                } else {
                    console.log('ℹ️ Live update già attivo');
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

    // 1. Modifica startLiveUpdate per gestire meglio lo stato
    const startLiveUpdate = useCallback(() => {
        console.log('🟢 Starting live update');
        console.log('Stato attuale:', {
            intervalRef: intervalRef.current,
            isLive,
        });

        // Se c'è già un intervallo attivo, non fare nulla
        if (intervalRef.current) {
            console.log('⚠️ Intervallo già esistente, SKIP');
            return;
        }

        // NON controllare isLive qui! Potrebbe essere già true ma senza intervallo

        // Pulisci eventuale intervallo zombie
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        console.log('✅ Avvio nuovo intervallo');
        setIsLive(true);
        intervalRef.current = window.setInterval(() => {
            console.log('⏰ Tick automatico');
            automaticUpdate();
        }, 60000);
        console.log('✅ Intervallo creato:', intervalRef.current);
    }, [automaticUpdate]); // Rimuovi isLive dalle dipendenze

    // Ferma aggiornamento live
    const stopLiveUpdate = useCallback(() => {
        console.log('🔴 Stopping live update');

        if (intervalRef.current) {
            console.log('🛑 Fermo intervallo:', intervalRef.current);
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setIsLive(false); // Importante: resetta anche isLive
    }, []);

    // Carica i dati iniziali
    useEffect(() => {
        // Usa un flag locale invece di ref per evitare problemi con StrictMode
        let isMounted = true;
        let hasInitialized = false;

        const loadInitialData = async () => {
            // Controlla se già inizializzato
            if (hasInitialized || !isMounted) {
                console.log('⏭️ Skip inizializzazione');
                return;
            }

            hasInitialized = true;
            console.log('🚀 Caricamento dati iniziali...');

            try {
                setIsLoading(true);
                setError(null);

                const votersInfo = await fetchLatestData();

                if (!isMounted) return;

                if (votersInfo.isLive) {
                    console.log('📡 Server è live al caricamento');
                    startLiveUpdate();
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error loading initial data:', err);
                    setError('Errore nel caricamento dei dati. Riprova più tardi.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        // Delay per evitare chiamate multiple in StrictMode
        const timeoutId = setTimeout(() => {
            if (isMounted && !isInitializedRef.current) {
                isInitializedRef.current = true;
                loadInitialData();
            }
        }, 100);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            // Non resettare isInitializedRef qui per evitare re-inizializzazioni
        };
    }, []); // Array vuoto, nessuna dipendenza

    // 4. Cleanup finale migliorato
    useEffect(() => {
        return () => {
            console.log('🧹 Cleanup finale componente');
            // Ferma tutto alla distruzione del componente
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setIsLive(false);
            isInitializedRef.current = false;
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
                <div className="loading-spinner">Caricamento dati...</div>
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
                                LIVE
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

                {/* Pulsante aggiorna centrato */}
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

            {/* Indicatori di navigazione grafici */}
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
                            key={`bar-chart-${updateKey}`} // Chiave dinamica
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
                            key={`quorum-chart-${updateKey}`} // Chiave dinamica
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
        </motion.div>
    );
};

export default React.memo(Home);