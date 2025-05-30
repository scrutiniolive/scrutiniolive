import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuorumPieChart from '../../components/QuorumPieChart/QuorumPieChart';
import type { DataItem, VoteData } from '../../types';
import { 
  createBarData,
  createRadarData,
  TOTAL_ABITANTI, 
  QUORUM_PERCENTAGE 
} from '../../data/initialData';
import { VoteSimulator } from '../../utils/voteSimulator';
import './Home.css';
import BarChartByQuestion from '../../components/BarChartByQuestion/BarChartByQuestion';

type ChartType = 'bar'  | 'quorum';

const Home: React.FC = () => {
  const simulatorRef = useRef<VoteSimulator>(new VoteSimulator());
  
  // Stati per i dati
  const [referendumData, setReferendumData] = useState<VoteData[]>(
    simulatorRef.current.getCurrentData()
  );
  const [_barData, setBarData] = useState<DataItem[]>(createBarData(referendumData));
  const [_radarData, setRadarData] = useState<DataItem[]>(createRadarData(referendumData));
  
  const [currentChart, setCurrentChart] = useState<ChartType>('quorum');
  const [currentQuesito, setCurrentQuesito] = useState(1);
  const [isLive, setIsLive] = useState(false);
  const [totalVoters, setTotalVoters] = useState(0);
  
  const intervalRef = useRef<number | null>(null);
  
  
  const MAX_VOTERS = 8000; // Massimo numero di votanti

  const charts: ChartType[] = ['quorum', 'bar'];
  const currentIndex = charts.indexOf(currentChart);

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

  // Funzione per aggiornare i voti
  const updateVotes = () => {
    const currentTotal = simulatorRef.current.getTotalVoters();
    
    // Se abbiamo raggiunto il massimo, ferma tutto
    if (currentTotal >= MAX_VOTERS) {
      stopLiveUpdate();
      return;
    }
    
    // Calcola quanti nuovi votanti aggiungere (1000 o il rimanente se < 1000)
    const remainingVoters = MAX_VOTERS - currentTotal;
    const newVoters = Math.min(1000, remainingVoters);
    
    const updatedData = simulatorRef.current.simulateVotes(newVoters);
    
    setReferendumData([...updatedData]);
    setBarData(createBarData(updatedData));
    setRadarData(createRadarData(updatedData));
    setTotalVoters(simulatorRef.current.getTotalVoters());
    
    // Se abbiamo raggiunto il massimo dopo questo aggiornamento
    if (simulatorRef.current.getTotalVoters() >= MAX_VOTERS) {
      stopLiveUpdate();
    }
  };

  // Funzione per avviare/fermare l'aggiornamento live
  const toggleLiveUpdate = () => {
    if (isLive) {
      stopLiveUpdate();
    } else {
      startLiveUpdate();
    }
  };

  const startLiveUpdate = () => {
    // Non avviare se abbiamo già raggiunto il massimo
    if (simulatorRef.current.getTotalVoters() >= MAX_VOTERS) {
      return;
    }
    
    setIsLive(true);
    
    // Aggiorna immediatamente
    updateVotes();
    
    // Poi ogni 2 secondi
    intervalRef.current = window.setInterval(updateVotes, 2000);
  };

  const stopLiveUpdate = () => {
    setIsLive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup all'unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getChartTitle = () => {
    switch (currentChart) {
      case 'bar':
        return 'Voti SI/NO per Quesito';
      case 'quorum':
        return 'Risultati Referendum con Quorum';
    }
  };


  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="chart-navigation">
        <button className="nav-arrow nav-prev" onClick={goToPrevious}>
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
        <button className="nav-arrow nav-next" onClick={goToNext}>
          ›
        </button>
      </div>

      <div className="chart-indicator">
        {charts.map((chart, _) => (
          <span
            key={chart}
            className={`indicator-dot ${chart === currentChart ? 'active' : ''}`}
            onClick={() => setCurrentChart(chart)}
          />
        ))}
      </div>

      <div className="update-button-container">
        <button 
          className={`update-button ${isLive ? 'active' : ''}`}
          onClick={toggleLiveUpdate}
          disabled={totalVoters >= MAX_VOTERS}
        >
          {totalVoters >= MAX_VOTERS ? '✓ Completato' : '🔄 Aggiorna'}
        </button>
      </div>

    <div className="chart-container">
        <AnimatePresence mode="wait">
          {currentChart === 'bar' && (
            <motion.div
              key="bar-chart"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
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
              key="quorum-chart"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <QuorumPieChart 
                data={referendumData}
                totalAbitanti={TOTAL_ABITANTI}
                quorumPercentage={QUORUM_PERCENTAGE}
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

export default Home;