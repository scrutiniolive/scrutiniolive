import React from 'react';
import { motion } from 'framer-motion';
import './Credits.css';

const Credits: React.FC = () => {
    const developers = [
        {
            name: 'Luca Pastore',
            linkedin: 'https://www.linkedin.com/in/luca-pastore-33a485184/',
            avatar: '/images/devs/luca.jpeg'
        },
        {
            name: 'Paolo F. Sciammarella',
            linkedin: 'https://www.linkedin.com/in/paolo-francesco-sciammarella-6570a468/',
            avatar: '/images/devs/paolo.jpeg'
        },
        {
            name: 'Armando Santoro',
            linkedin: 'https://www.linkedin.com/in/armando-santoro-b88977174/',
            avatar: '/images/devs/armando.jpeg'
        },
        {
            name: 'Emanuel Russo',
            linkedin: 'https://www.linkedin.com/in/emanuel-russo/',
            avatar: '/images/devs/emanuel.jpeg'
        }
    ];

    const socialLinks = [
        {
            name: 'Sito Web',
            url: 'https://scrutiniolive.github.io/elezionicomunalipaola',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
            )
        },
        {
            name: 'Facebook',
            url: 'https://www.facebook.com/profile.php?id=61576148416339',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            )
        },
        {
            name: 'YouTube',
            url: 'https://www.youtube.com/@ScrutinioLive',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            )
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/scrutiniolive?igsh=MTIxazZndDN4bW9kcg==',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
            )
        }
    ];

    return (
        <motion.div
            key="credits"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="content-section"
        >
            <h1 className="credits-title">🗳️ ScrutinioLive</h1>
            <p className="credits-subtitle">RISULTATI ELETTORALI IN TEMPO REALE</p>

            <div className="credits-new-container">
                {/* Prima riga: Chi Siamo e Funzionalità */}
                <div className="credits-row">
                    <div className="credit-card-half">
                        <h3>📱 Chi Siamo</h3>
                        <p>
                            Piattaforma innovativa che trasforma il modo di seguire le elezioni,
                            rendendo i risultati elettorali trasparenti e accessibili a tutti.
                        </p>
                        <p className="highlight-text">
                            <strong>✅ Prima Tappa: Elezioni Comunali Paola (CS)</strong>
                        </p>
                        <p className="highlight-text">
                            <strong>🔜 Seconda Tappa: Referendum 8-9 Giugno 2025 Paola (CS)</strong>
                        </p>
                    </div>

                    <div className="credit-card-half">
                        <h3>✅ Funzionalità</h3>
                        <ul>
                            <li>🔴 Aggiornamenti live dai seggi elettorali</li>
                            <li>📊 Dashboard con grafici interattivi</li>
                            <li>📈 Analisi dei trend e flussi di voto</li>
                            <li>🎯 Proiezioni basate sui dati reali</li>
                            <li>💎 UI/UX completamente ridisegnata</li>
                        </ul>
                    </div>
                </div>

                {/* Seconda riga: Sviluppatori */}
                <div className="credit-card-full developers-card-new">
                    <h3>👨‍💻 Sviluppato da</h3>
                    <div className="developers-grid-new">
                        {developers.map((dev, index) => (
                            <motion.a
                                key={index}
                                href={dev.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="developer-link"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="developer-avatar">
                                    {dev.avatar ? (
                                        <img src={`${import.meta.env.BASE_URL}${dev.avatar}`}
                                            alt={dev.name}
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {dev.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    )}
                                </div>
                                <span className="developer-name">{dev.name}</span>
                                <span className="linkedin-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </span>
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Terza riga: Social */}
                <div className="credit-card-full social-card-new">
                    <h3>📺 Seguici su</h3>
                    <div className="social-links-new">
                        {socialLinks.map((link, index) => (
                            <motion.a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link-new"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="social-icon-new">{link.icon}</span>
                                <span className="social-name-new">{link.name}</span>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="copyright-simple">
                <p>© 2025 ScrutinioLive</p>
                <p>Tutti i diritti riservati | Protetto da: L. 633/1941 - D.Lgs. 30/2005</p>
                <p className="hashtags-simple">#ScrutinioLive #ElezioniPaola #Elezioni2025</p>
            </div>
        </motion.div>
    );
};

export default Credits;