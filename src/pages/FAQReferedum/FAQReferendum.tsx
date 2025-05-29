import React from 'react';
import { motion } from 'framer-motion';
import './FAQReferendum.css';

const FAQReferendum: React.FC = () => {
  const faqs = [
    {
      question: "Quando si vota per il referendum 2025?",
      answer: "Si vota domenica 8 giugno (dalle 7:00 alle 23:00) e lunedì 9 giugno 2025 (dalle 7:00 alle 15:00). La votazione coincide con il secondo turno delle elezioni amministrative."
    },
    {
      question: "Quali sono i 5 quesiti referendari?",
      answer: "1) Reintegro nel posto di lavoro per licenziamenti illegittimi (superamento Jobs Act), 2) Maggiore tutela nei licenziamenti delle piccole imprese, 3) Limiti ai contratti a termine con obbligo di causale, 4) Responsabilità negli appalti e sicurezza sul lavoro, 5) Cittadinanza italiana dopo 5 anni di residenza (invece di 10)."
    },
    {
      question: "Quesito 1: Cosa prevede il reintegro nel posto di lavoro?",
      answer: "Il quesito propone di abrogare il Jobs Act (d.lgs. 23/2015) per ripristinare la possibilità di reintegro nel posto di lavoro in caso di licenziamento illegittimo, superando l'attuale sistema che prevede solo indennizzi economici per chi è stato assunto dopo il 2015."
    },
    {
      question: "Quesito 2: Cosa cambia per i licenziamenti nelle piccole imprese?",
      answer: "Si propone di eliminare il tetto massimo di 6 mensilità per il risarcimento in caso di licenziamento illegittimo nelle aziende con meno di 16 dipendenti, lasciando al giudice la libertà di determinare un risarcimento equo."
    },
    {
      question: "Quesito 3: Cosa prevede sui contratti a termine?",
      answer: "Il quesito vuole eliminare la possibilità di stipulare contratti a termine senza causale per i primi 12 mesi, rendendo obbligatoria la presenza di una giustificazione fin dall'inizio per contrastare la precarizzazione."
    },
    {
      question: "Quesito 4: Come cambia la responsabilità negli appalti?",
      answer: "Si propone di rendere il committente sempre corresponsabile degli infortuni sul lavoro, anche quando derivano da rischi specifici dell'appaltatore, per aumentare la sicurezza dei lavoratori."
    },
    {
      question: "Quesito 5: Come cambia l'accesso alla cittadinanza?",
      answer: "Il quesito propone di ridurre da 10 a 5 anni il periodo di residenza necessario per richiedere la cittadinanza italiana e di estendere automaticamente il diritto ai figli minorenni dei nuovi cittadini."
    },
    {
      question: "Chi può votare?",
      answer: "Possono votare tutti i cittadini italiani maggiorenni iscritti nelle liste elettorali. Chi è temporaneamente all'estero o fuori sede può votare per corrispondenza presentando richiesta entro il 4 maggio (Italia) o 7 maggio (estero)."
    },
    {
      question: "Qual è il quorum necessario?",
      answer: "Per la validità del referendum è necessario che voti almeno il 50% più uno degli aventi diritto. Se il quorum non viene raggiunto, il referendum non è valido e le leggi restano invariate."
    },
    {
      question: "Cosa succede se vince il SÌ?",
      answer: "In caso di vittoria del SÌ e raggiungimento del quorum, le norme oggetto del quesito vengono abrogate e non saranno più applicabili. Le modifiche entreranno in vigore dopo la pubblicazione in Gazzetta Ufficiale."
    },
    {
      question: "Chi ha promosso questi referendum?",
      answer: "I quesiti sono stati promossi principalmente dalla CGIL, con il sostegno di altre organizzazioni sindacali e comitati civici impegnati nella tutela dei diritti dei lavoratori e dei cittadini stranieri."
    },
    {
      question: "Come si vota praticamente?",
      answer: "Per ogni quesito si può votare SÌ (per abrogare la norma) o NO (per mantenerla). È possibile votare solo per alcuni quesiti e lasciare gli altri in bianco. Serve un documento valido e la tessera elettorale."
    },
    {
      question: "Quali sono le date importanti da ricordare?",
      answer: "8-9 giugno: votazioni. 4 maggio: scadenza domande voto fuori sede in Italia. 7 maggio: scadenza domande voto dall'estero. 7 giugno: inizio silenzio elettorale. 9 giugno ore 15: inizio scrutinio."
    }
  ];

  return (
    <motion.div
      key="faq-referendum"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="faq-referendum-container"
    >
      <h1 className="faq-referendum-title">Referendum Abrogativo - 8/9 Giugno 2025</h1>
      
      <div className="faq-referendum-intro">
        <h2>5 Quesiti su Lavoro e Cittadinanza</h2>
        <p>I cittadini italiani sono chiamati a esprimersi su cinque quesiti referendari abrogativi che riguardano temi fondamentali del mondo del lavoro e della cittadinanza.</p>
      </div>

      <div className="faq-referendum-info-banner">
        <div className="info-row">
          <span className="info-icon">📅</span>
          <div className="info-content">
            <strong>Domenica 8 giugno 2025</strong>
            <span>dalle ore 7:00 alle 23:00</span>
          </div>
        </div>
        <div className="info-row">
          <span className="info-icon">📅</span>
          <div className="info-content">
            <strong>Lunedì 9 giugno 2025</strong>
            <span>dalle ore 7:00 alle 15:00</span>
          </div>
        </div>
        <div className="info-row">
          <span className="info-icon">📊</span>
          <div className="info-content">
            <strong>Quorum necessario</strong>
            <span>50% + 1 degli aventi diritto</span>
          </div>
        </div>
      </div>
      
      <div className="faq-referendum-quesiti-summary">
        <h3>I 5 Quesiti in sintesi:</h3>
        <ol className="faq-referendum-quesiti-list">
          <li><strong>Reintegro lavoratori</strong> - Superamento del Jobs Act</li>
          <li><strong>Piccole imprese</strong> - Eliminazione tetto risarcimenti</li>
          <li><strong>Contratti a termine</strong> - Obbligo di causale</li>
          <li><strong>Sicurezza appalti</strong> - Maggiore responsabilità committenti</li>
          <li><strong>Cittadinanza</strong> - Da 10 a 5 anni di residenza</li>
        </ol>
      </div>
      
      <div className="faq-referendum-faq-section">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            className="faq-referendum-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <h3 className="faq-referendum-question">❓ {faq.question}</h3>
            <p className="faq-referendum-answer">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="faq-referendum-notice">
        <h3>⚠️ Documenti necessari per votare</h3>
        <ul>
          <li>Documento di identità valido</li>
          <li>Tessera elettorale (richiedibile in Comune se smarrita)</li>
        </ul>
        <div className="notice-divider"></div>
        <p className="notice-footer">
          Per informazioni: numero verde <strong>800.123.456</strong> o sito del Ministero dell'Interno
        </p>
      </div>
    </motion.div>
  );
};

export default FAQReferendum;