import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAggregatedData } from '../hooks/useAggregatedData';
import { AgentCard } from './AgentCard';
import { isEligibleForTopPerformer } from '../utils/scoring';
import { Trophy } from 'lucide-react';

export const TopPerformers: React.FC = () => {
    const { filters } = useDashboard();
    const data = useAggregatedData();

    // Filter data based on selection (Role only, as period is handled by hook)
    const filteredData = data.filter(d => {
        const matchesRole = filters.role === 'All' || d.role === filters.role;
        return matchesRole;
    });

    // Sort for top performers:
    // 1. Must be eligible (meet all thresholds)
    // 2. Sort by chats (desc)
    // 3. Tiebreaker: AHT (asc)

    const sortedAgents = [...filteredData].sort((a, b) => {
        const aEligible = isEligibleForTopPerformer(a);
        const bEligible = isEligibleForTopPerformer(b);

        // Let's prioritize eligible agents for the podium if there are any.
        if (aEligible && !bEligible) return -1;
        if (!aEligible && bEligible) return 1;

        // Then by chats
        if (b.numberOfChats !== a.numberOfChats) {
            return b.numberOfChats - a.numberOfChats;
        }
        // Then by AHT (lower is better)
        return a.ahtMinutes - b.ahtMinutes;
    });

    const top3 = sortedAgents.slice(0, 3);

    if (top3.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                <p className="text-slate-500">No data available for the selected period.</p>
            </div>
        );
    }

    return (
        <div className="mb-16">
            <div className="text-center mb-12 relative z-20">
                <h2 className="text-3xl font-bold text-brand-900 mb-2 flex items-center justify-center gap-3">
                    <Trophy className="w-8 h-8 text-brand-500" />
                    Top Performers
                </h2>
                <p className="text-slate-500">Celebrating excellence in support delivery</p>
            </div>

            {/* Podium Layout: 2nd, 1st, 3rd */}
            <div className="flex flex-col md:flex-row justify-center items-end gap-8 md:gap-12 px-4 mt-16">
                {top3[1] && <div className="w-full md:w-1/3 max-w-sm order-2 md:order-1"><AgentCard agent={top3[1]} rank={2} /></div>}
                {top3[0] && <div className="w-full md:w-1/3 max-w-sm order-1 md:order-2 md:-mt-16 z-10 transform md:scale-110 transition-transform mb-12 md:mb-0"><AgentCard agent={top3[0]} rank={1} /></div>}
                {top3[2] && <div className="w-full md:w-1/3 max-w-sm order-3 md:order-3"><AgentCard agent={top3[2]} rank={3} /></div>}
            </div>
        </div>
    );
};
