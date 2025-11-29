export type Role = 'AHD';

export interface AgentPerformance {
    id: string;
    agentId: string;
    agentName: string;
    role: Role;
    week?: string; // e.g., "2025-W45"
    month: string; // e.g., "2025-11"
    numberOfChats: number;
    slPercentage: number;
    frtSeconds: number;
    artSeconds: number;
    ahtMinutes: number;
    imageUrl?: string;
}

export interface PerformanceThresholds {
    sl: number; // Target >= 95%
    frt: number; // Target <= 30s
    art: number; // Target <= 30s
    aht: number; // Target <= 6 (minutes)
}

export const THRESHOLDS: PerformanceThresholds = {
    sl: 95,
    frt: 30,
    art: 30,
    aht: 6,
};

export type PeriodType = 'Weekly' | 'Monthly';

export interface FilterState {
    periodType: PeriodType;
    selectedPeriod: string; // The specific week or month string
    role: Role | 'All';
    searchQuery: string;
}
