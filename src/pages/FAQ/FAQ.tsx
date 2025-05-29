import React from 'react';
import { motion } from 'framer-motion';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Cos'è ScrutinioLive?",
      answer: "ScrutinioLive è la piattaforma innovativa che trasforma il modo di seguire le elezioni, rendendo i risultati elettorali trasparenti, immediati e accessibili a tutti. Creata da tre amici appassionati di tecnologia, offre aggiornamenti in tempo reale direttamente dai seggi."
    },
    {
      question: "Come funziona il tracking dei risultati?",
      answer: "I dati vengono aggiornati in tempo reale man mano che arrivano dai seggi elettorali. La piattaforma mostra grafici dettagliati, analisi dei flussi di voto e proiezioni per il Consiglio Comunale."
    },
    {
      question: "Quali elezioni state seguendo?",
      answer: "Abbiamo inziato con le elezioni del comune di Paola (CS), seguiremo adesso anche il Referendum Abrogativo del 8-9 Giugno ma questo è solo l'inizio!"
    },
    {
      question: "Su quali canali posso seguire ScrutinioLive?",
      answer: "Puoi seguirci sul nostro sito web, Facebook, YouTube e Instagram. Trovi tutti i link nella sezione Credits."
    },
    {
      question: "Cosa offre la piattaforma?",
      answer: "Offriamo aggiornamenti in tempo reale, grafici dettagliati e interattivi, analisi dei flussi di voto, proiezioni per il Consiglio Comunale e un'interfaccia intuitiva per seguire facilmente i risultati."
    },
    {
      question: "Chi ha sviluppato ScrutinioLive?",
      answer: "ScrutinioLive è stato realizzato da Luca Pastore, Paolo F. Sciammarella e Armando Santoro ed Emanuel Russo, quattro amici appassionati di tecnologia con l'obiettivo di fornire un servizio che fornisca trasparenza elettorale ed immediatezza dell'informazione."
    }
  ];

  return (
    <motion.div
      key="faq"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="content-section"
    >
      <h1 className="title">FAQ - Domande Frequenti</h1>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            className="faq-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="faq-question">❓ {faq.question}</h3>
            <p className="faq-answer">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FAQ;