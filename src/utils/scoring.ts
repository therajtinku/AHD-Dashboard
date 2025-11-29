import type { AgentPerformance } from '../types';
import { THRESHOLDS } from '../types';


export const calculateScore = (agent: AgentPerformance): number => {
    // Base score logic (can be refined)
    // Start with a base derived from chats (normalized roughly)
    // This is a heuristic scoring system as requested.

    // Check if all metrics meet thresholds (Perfect Score)
    const { slStatus, frtStatus, artStatus, ahtStatus } = checkThresholds(agent);
    if (slStatus === 'ok' && frtStatus === 'ok' && artStatus === 'ok' && ahtStatus === 'ok') {
        return 100;
    }

    let score = 0;

    // Volume component (up to 40 points)
    // Assuming 100 chats is a "good" high number for normalization, but we should probably just use raw relative to max, 
    // but for a standalone score, let's cap it or log scale it. 
    // Let's keep it simple: 1 point per 2 chats, max 50.
    score += Math.min(50, agent.numberOfChats / 2);

    // SL Component (Max 20 points)
    // SL is now percentage, target 95%
    if (agent.slPercentage >= THRESHOLDS.sl) {
        score += 20;
    } else if (agent.slPercentage >= THRESHOLDS.sl - 5) { // Within 5%
        score += 10;
    }

    // ART Component (Max 15 points)
    if (agent.artSeconds <= THRESHOLDS.art) {
        score += 15;
    } else if (agent.artSeconds <= THRESHOLDS.art + 10) {
        score += 5;
    }

    // AHT Component (Max 15 points)
    if (agent.ahtMinutes <= THRESHOLDS.aht) {
        score += 15;
    } else if (agent.ahtMinutes <= THRESHOLDS.aht + 1) { // +1 minute tolerance
        score += 5;
    }

    return Math.min(100, Math.round(score));
};

export const isEligibleForTopPerformer = (agent: AgentPerformance): boolean => {
    return (
        agent.slPercentage >= THRESHOLDS.sl &&
        agent.frtSeconds <= THRESHOLDS.frt &&
        agent.artSeconds <= THRESHOLDS.art &&
        agent.ahtMinutes <= THRESHOLDS.aht
    );
};

export const getStatusColor = (value: number, threshold: number, type: 'lowerIsBetter' | 'higherIsBetter' = 'lowerIsBetter'): 'text-green-600' | 'text-amber-500' | 'text-red-600' => {
    if (type === 'lowerIsBetter') {
        if (value <= threshold) return 'text-green-600';
        if (value <= threshold * 1.2) return 'text-amber-500'; // Within 20% over
        return 'text-red-600';
    } else {
        // For higher is better (not currently used for color coding thresholds in the prompt, but good to have)
        if (value >= threshold) return 'text-green-600';
        return 'text-red-600';
    }
};

export const getMetricStatus = (value: number, threshold: number): 'ok' | 'warning' => {
    // Inclusive inequality for SL/ART (<= 30 means 30 is OK, 30.1 is warning)
    // AHT is <= 6 (6 is OK, 6.1 is warning)
    return value <= threshold ? 'ok' : 'warning';
};

export const checkThresholds = (agent: AgentPerformance) => {
    // SL is percentage, higher is better
    const slStatus = agent.slPercentage >= THRESHOLDS.sl ? 'ok' : 'warning';
    // FRT is seconds, lower is better
    const frtStatus = agent.frtSeconds <= THRESHOLDS.frt ? 'ok' : 'warning';
    const artStatus = agent.artSeconds <= THRESHOLDS.art ? 'ok' : 'warning';
    const ahtStatus = agent.ahtMinutes <= THRESHOLDS.aht ? 'ok' : 'warning';

    return { slStatus, frtStatus, artStatus, ahtStatus };
};
