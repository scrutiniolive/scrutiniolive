import type { DataItem, VoteData } from '../types';

// Dati FINALI del referendum (obiettivo da raggiungere)
export const referendumDataFinal: VoteData[] = [
    {
        id: 1,
        name: 'Quesito 1 - Trasporto Pubblico',
        si: 5800,
        no: 3200,
        color: '#22c55e'
    },
    {
        id: 2,
        name: 'Quesito 2 - Raccolta Differenziata',
        si: 6500,
        no: 2000,
        color: '#3b82f6'
    },
    {
        id: 3,
        name: 'Quesito 3 - Zone Pedonali',
        si: 4200,
        no: 4800,
        color: '#f59e0b'
    },
    {
        id: 4,
        name: 'Quesito 4 - Piste Ciclabili',
        si: 7200,
        no: 1300,
        color: '#8b5cf6'
    },
    {
        id: 5,
        name: 'Quesito 5 - Verde Pubblico',
        si: 5500,
        no: 2500,
        color: '#ef4444'
    }
];

// Dati iniziali (tutti a zero)
export const referendumData: VoteData[] = referendumDataFinal.map(item => ({
    ...item,
    si: 0,
    no: 0
}));

// Funzioni helper per creare i dati dei grafici
export const createBarData = (data: VoteData[]): DataItem[] => {
    return data.flatMap(item => [
        {
            id: item.id * 2 - 1,
            name: `Q${item.id} - SI`,
            value: item.si,
            image: `/images/yes-no/yes.png`,
            color: '#22c55e'
        },
        {
            id: item.id * 2,
            name: `Q${item.id} - NO`,
            value: item.no,
            image: `/images/yes-no/no.png`,
            color: '#ef4444'
        }
    ]);
};

export const createRadarData = (data: VoteData[]): DataItem[] => {
    return data.map(item => ({
        id: item.id,
        name: `Q${item.id}`,
        value: item.si + item.no, // Totale voti
        image: `https://via.placeholder.com/40/${item.color.slice(1)}/FFFFFF?text=Q${item.id}`,
        color: item.color
    }));
};

// Dati iniziali per i grafici
export const referendumBarData = createBarData(referendumData);
export const referendumRadarData = createRadarData(referendumData);

export const TOTAL_ABITANTI = 15000;
export const QUORUM_PERCENTAGE = 50;

// Tracking dei votanti per evitare duplicati
export interface Votante {
    id: number;
    haVotato: {
        [quesito: number]: boolean;
    };
}