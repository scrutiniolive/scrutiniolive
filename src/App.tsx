import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Menu from './components/Menu/Menu';
import Home from './pages/Home/Home';
import HomeMock from './pages/HomeMock/HomeMock';
import LaunchBanner from './components/LaunchBanner/LaunchBanner';

import Credits from './pages/Credits/Credits';
import FAQ from './pages/FAQ/FAQ';
import FAQReferedum from './pages/FAQReferedum/FAQReferendum'
import type { MenuSection } from './types';
import './App.css';




function App() {
    const launchDate = new Date('2025-06-09T12:00:00+02:00');

    const [currentSection, setCurrentSection] = useState<MenuSection>('home');

    const renderSection = () => {
        switch (currentSection) {
            case 'home':
                return <HomeMock />;
            case 'credits':
                return <Credits />;
            case 'faq':
                return <FAQ />;
            case 'faq-referendum':
                return <FAQReferedum />;
            default:
                return <Home />;
        }
    };



    // Nel tuo componente App
    return (
        <div className="app-wrapper">
            {/* Header fisso */}
            <header className="fixed-header">
                <div className="header-content">
                    <div className="header-brand">
                        <img
                            src={`${import.meta.env.BASE_URL}images/scrutinio_live.png`}
                            alt="ScrutinioLive Logo"
                            className="header-logo"
                        />
                        <div className="header-title-group">
                            <h1 className="header-title">ScrutinioLive</h1>
                            <span className="header-subtitle">per il referendum</span>
                        </div>
                    </div>
                    <Menu
                        currentSection={currentSection}
                        onSectionChange={setCurrentSection}
                    />
                </div>
            </header>

            {/* Contenuto principale */}
            <main className="main-content">
                <div className="app">
                    <AnimatePresence mode="wait">
                        {renderSection()}
                    </AnimatePresence>
                </div>
            </main>

            {/* Launch Banner in basso */}
            <LaunchBanner
                targetDate={new Date('2025-06-09T15:30:00')}
                onClose={() => console.log('Banner chiuso')}
            />
        </div>
    );
}
export default App;