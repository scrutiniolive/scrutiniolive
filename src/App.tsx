import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Menu from './components/Menu/Menu';
import Home from './pages/Home/Home';
import HomeMock from './pages/HomeMock/HomeMock';

import Credits from './pages/Credits/Credits';
import FAQ from './pages/FAQ/FAQ';
import FAQReferedum from './pages/FAQReferedum/FAQReferendum'
import type { MenuSection } from './types';
import './App.css';




function App() {


    const [currentSection, setCurrentSection] = useState<MenuSection>('home');

    const renderSection = () => {
        switch (currentSection) {
            case 'home':
                return <Home />;
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

            {/* Contenuto principale con padding per il header */}
            <main className="main-content">
                <div className="app">
                    <AnimatePresence mode="wait">
                        {renderSection()}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

export default App;