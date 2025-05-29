import type { VoteData } from '../types';
import { referendumDataFinal, TOTAL_ABITANTI } from '../data/initialData';

interface VoteSimulation {
    votantiTotali: Set<number>;
    votantiPerQuesito: Map<number, Set<number>>;
    currentData: VoteData[];
}

export class VoteSimulator {
    private simulation: VoteSimulation;
    private maxVotanti: number;

    constructor() {
        this.maxVotanti = TOTAL_ABITANTI;
        this.simulation = {
            votantiTotali: new Set(),
            votantiPerQuesito: new Map(),
            currentData: referendumDataFinal.map(item => ({
                ...item,
                si: 0,
                no: 0
            }))
        };

        // Inizializza le mappe per ogni quesito
        for (let i = 1; i <= 5; i++) {
            this.simulation.votantiPerQuesito.set(i, new Set());
        }
    }

    simulateVotes(numberOfNewVoters: number): VoteData[] {
        // Genera nuovi votanti
        const newVoters = this.generateNewVoters(numberOfNewVoters);

        newVoters.forEach(voterId => {
            // Ogni votante decide quali quesiti votare
            const quesitiDaVotare = this.decideWhichQuestionsToVote();

            quesitiDaVotare.forEach(quesitoId => {
                // Verifica che non abbia già votato per questo quesito
                const votantiQuesito = this.simulation.votantiPerQuesito.get(quesitoId)!;

                if (!votantiQuesito.has(voterId)) {
                    votantiQuesito.add(voterId);

                    // Decide SI o NO basandosi sulle proporzioni finali
                    const voteYes = this.shouldVoteYes(quesitoId);
                    const currentQuesito = this.simulation.currentData[quesitoId - 1];

                    if (voteYes) {
                        currentQuesito.si++;
                    } else {
                        currentQuesito.no++;
                    }
                }
            });
        });

        return [...this.simulation.currentData];
    }

    private generateNewVoters(count: number): number[] {
        const newVoters: number[] = [];
        let attempts = 0;

        while (newVoters.length < count && attempts < count * 10) {
            const voterId = Math.floor(Math.random() * this.maxVotanti) + 1;

            if (!this.simulation.votantiTotali.has(voterId)) {
                this.simulation.votantiTotali.add(voterId);
                newVoters.push(voterId);
            }
            attempts++;
        }

        return newVoters;
    }

    private decideWhichQuestionsToVote(): number[] {
        const quesiti: number[] = [];

        // Probabilità che un votante voti per ogni quesito
        const probabilities = {
            1: 0.9,  // 90% vota il quesito 1
            2: 0.85, // 85% vota il quesito 2
            3: 0.9,  // 90% vota il quesito 3
            4: 0.85, // 85% vota il quesito 4
            5: 0.8   // 80% vota il quesito 5
        };

        for (let i = 1; i <= 5; i++) {
            if (Math.random() < probabilities[i as keyof typeof probabilities]) {
                quesiti.push(i);
            }
        }

        // Assicurati che almeno un quesito sia votato
        if (quesiti.length === 0) {
            quesiti.push(Math.floor(Math.random() * 5) + 1);
        }

        return quesiti;
    }

    private shouldVoteYes(quesitoId: number): boolean {
        const finalData = referendumDataFinal[quesitoId - 1];
        const totalVotes = finalData.si + finalData.no;
        const yesPercentage = finalData.si / totalVotes;

        // Aggiungi un po' di variabilità
        const randomFactor = (Math.random() - 0.5) * 0.1; // ±5%

        return Math.random() < (yesPercentage + randomFactor);
    }

    getCurrentData(): VoteData[] {
        return [...this.simulation.currentData];
    }

    getTotalVoters(): number {
        return this.simulation.votantiTotali.size;
    }

    getVotersPerQuestion(): Map<number, number> {
        const result = new Map<number, number>();
        this.simulation.votantiPerQuesito.forEach((voters, questionId) => {
            result.set(questionId, voters.size);
        });
        return result;
    }

    reset(): void {
        this.simulation = {
            votantiTotali: new Set(),
            votantiPerQuesito: new Map(),
            currentData: referendumDataFinal.map(item => ({
                ...item,
                si: 0,
                no: 0
            }))
        };

        for (let i = 1; i <= 5; i++) {
            this.simulation.votantiPerQuesito.set(i, new Set());
        }
    }
}