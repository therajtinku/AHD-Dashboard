import { useMemo } from 'react';
import { useDashboard } from './useDashboard';
import type { AgentPerformance } from '../types';

export const useAggregatedData = () => {
    const { data, filters } = useDashboard();

    return useMemo(() => {
        if (filters.periodType === 'Weekly') {
            // Filter by week
            return data.filter(d => d.week === filters.selectedPeriod);
        }

        // Monthly Aggregation
        const grouped = new Map<string, AgentPerformance>();

        data.forEach(record => {
            if (record.month !== filters.selectedPeriod) return;

            if (!grouped.has(record.agentId)) {
                grouped.set(record.agentId, { ...record });
            } else {
                const existing = grouped.get(record.agentId)!;
                const totalChats = existing.numberOfChats + record.numberOfChats;

                // Weighted averages
                const weightExisting = existing.numberOfChats;
                const weightNew = record.numberOfChats;

                if (totalChats > 0) {
                    existing.slPercentage = (existing.slPercentage * weightExisting + record.slPercentage * weightNew) / totalChats;
                    existing.frtSeconds = (existing.frtSeconds * weightExisting + record.frtSeconds * weightNew) / totalChats;
                    existing.artSeconds = (existing.artSeconds * weightExisting + record.artSeconds * weightNew) / totalChats;
                    existing.ahtMinutes = (existing.ahtMinutes * weightExisting + record.ahtMinutes * weightNew) / totalChats;
                } else {
                    existing.slPercentage = (existing.slPercentage + record.slPercentage) / 2;
                    existing.frtSeconds = (existing.frtSeconds + record.frtSeconds) / 2;
                    existing.artSeconds = (existing.artSeconds + record.artSeconds) / 2;
                    existing.ahtMinutes = (existing.ahtMinutes + record.ahtMinutes) / 2;
                }

                existing.numberOfChats = totalChats;

                // Fix: Update image if missing in existing but present in new
                if (!existing.imageUrl && record.imageUrl) {
                    existing.imageUrl = record.imageUrl;
                }
            }
        });

        return Array.from(grouped.values());
    }, [data, filters.periodType, filters.selectedPeriod]);
};
