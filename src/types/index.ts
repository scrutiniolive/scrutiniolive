export interface DataItem {
    id: number;
    name: string;
    value: number;
    image: string;
    color: string;
}

export interface BarProps {
    item: DataItem;
    index: number;
    maxValue: number;
}

export interface VoteData {
    id: number;
    name: string;
    si: number;
    no: number;
    color: string;
}

export type MenuSection = 'home' | 'exitpoll' | 'credits' | 'faq' | 'faq-referendum';