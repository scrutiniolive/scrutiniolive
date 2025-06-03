// components/LaunchBanner/LaunchBanner.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LaunchBanner.css';

interface LaunchBannerProps {
    targetDate: Date;
    onClose?: () => void;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const LaunchBanner: React.FC<LaunchBannerProps> = ({ targetDate, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }

            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        // Update immediately
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="launch-banner"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="launch-banner-content">
                        <div className="launch-banner-main">
                            <div className="launch-banner-text">
                                <span className="launch-emoji">🚀</span>
                                <span className="launch-title">Applicazione in arrivo!</span>
                            </div>

                            <div className="countdown-container">
                                <div className="countdown-item">
                                    <div className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</div>
                                    <div className="countdown-label">Giorni</div>
                                </div>
                                <div className="countdown-separator">:</div>
                                <div className="countdown-item">
                                    <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
                                    <div className="countdown-label">Ore</div>
                                </div>
                                <div className="countdown-separator">:</div>
                                <div className="countdown-item">
                                    <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                    <div className="countdown-label">Minuti</div>
                                </div>
                                <div className="countdown-separator">:</div>
                                <div className="countdown-item">
                                    <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                    <div className="countdown-label">Secondi</div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="launch-banner-close"
                            onClick={handleClose}
                            aria-label="Chiudi banner"
                        >
                            ×
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LaunchBanner;