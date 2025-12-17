import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAggregatedData } from '../hooks/useAggregatedData';
import { useClickSound } from '../hooks/useClickSound';
import { getStatusColor, checkThresholds, isEligibleForTopPerformer } from '../utils/scoring';
import { THRESHOLDS } from '../utils/constants';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export const LeaderboardTable = () => {
    const { filters } = useDashboard();
    const aggregatedData = useAggregatedData();
    const { playClickSound } = useClickSound();
    const [sortField, setSortField] = useState('numberOfChats');
    const [sortDirection, setSortDirection] = useState('desc');

    const filteredData = aggregatedData.filter(d => {
        const matchesPeriod = filters.periodType === 'Weekly'
            ? d.week === filters.selectedPeriod
            : d.month === filters.selectedPeriod;
        const matchesRole = filters.role === 'All' || d.role === filters.role;
        const matchesSearch = d.agentName.toLowerCase().includes(filters.searchQuery.toLowerCase());
        return matchesPeriod && matchesRole && matchesSearch;
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc'); // Default to desc for most metrics (except maybe name)
        }
    };

    const sortedData = [...filteredData].sort((a, b) => {
        // Primary Sort: Eligibility (Perfect Score / All Thresholds Met)
        // We want eligible agents to be at the top.
        const aEligible = isEligibleForTopPerformer(a);
        const bEligible = isEligibleForTopPerformer(b);

        if (aEligible && !bEligible) return -1;
        if (!aEligible && bEligible) return 1;

        // Secondary Sort: Selected Field
        const modifier = sortDirection === 'asc' ? 1 : -1;
        if (a[sortField] < b[sortField]) return -1 * modifier;
        if (a[sortField] > b[sortField]) return 1 * modifier;
        return 0;
    });

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <div className="w-4 h-4" />;
        return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    return (
        <div id="leaderboard-section" className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-white to-brand-50/30 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Leaderboard</h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    {sortedData.length} Agents
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-3 sm:px-6 py-4 w-12 sm:w-16">Rank</th>
                            <th className="px-3 sm:px-6 py-4">
                                <div className="flex items-center gap-1">Agent</div>
                            </th>
                            <th className="px-3 sm:px-6 py-4">Employee ID</th>
                            <th className="px-3 sm:px-6 py-4 text-center cursor-pointer hover:text-brand-600 transition-colors" onClick={() => { playClickSound(); handleSort('numberOfChats'); }}>
                                <div className="flex items-center justify-center gap-1">Chats</div>
                            </th>
                            <th className="px-3 sm:px-6 py-4 text-center cursor-pointer hover:text-brand-600 transition-colors" onClick={() => { playClickSound(); handleSort('slPercentage'); }}>
                                <div className="flex items-center justify-center gap-1">SL (%) <SortIcon field="slPercentage" /></div>
                            </th>
                            <th className="px-3 sm:px-6 py-4 text-center cursor-pointer hover:text-brand-600 transition-colors" onClick={() => { playClickSound(); handleSort('frtSeconds'); }}>
                                <div className="flex items-center justify-center gap-1">FRT (sec) <SortIcon field="frtSeconds" /></div>
                            </th>
                            <th className="px-3 sm:px-6 py-4 text-center cursor-pointer hover:text-brand-600 transition-colors" onClick={() => { playClickSound(); handleSort('artSeconds'); }}>
                                <div className="flex items-center justify-center gap-1">ART (sec) <SortIcon field="artSeconds" /></div>
                            </th>
                            <th className="px-3 sm:px-6 py-4 text-center cursor-pointer hover:text-brand-600 transition-colors" onClick={() => { playClickSound(); handleSort('ahtMinutes'); }}>
                                <div className="flex items-center justify-center gap-1">AHT (min) <SortIcon field="ahtMinutes" /></div>
                            </th>
                            <th className="px-3 sm:px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedData.map((agent, index) => {
                            const { slStatus, frtStatus, artStatus, ahtStatus } = checkThresholds(agent);
                            const issues = [];
                            if (slStatus === 'warning') issues.push('SL');
                            if (frtStatus === 'warning') issues.push('FRT');
                            if (artStatus === 'warning') issues.push('ART');
                            if (ahtStatus === 'warning') issues.push('AHT');

                            return (
                                <tr key={agent.id} className="hover:bg-brand-50/30 transition-colors group">
                                    <td className="px-3 sm:px-6 py-4 text-slate-400 font-medium group-hover:text-brand-500">{index + 1}</td>
                                    <td className="px-3 sm:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-600 overflow-hidden border-2 border-white shadow-sm">
                                                {agent.imageUrl ? (
                                                    <img src={agent.imageUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    agent.agentName.split(' ').map((n) => n[0]).join('').slice(0, 2)
                                                )}
                                            </div>
                                            <span className="font-bold text-slate-700 group-hover:text-brand-700 transition-colors">{agent.agentName}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4">
                                        <span className="font-mono text-slate-500 text-xs">
                                            {agent.agentId}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 text-center font-bold text-slate-900">{agent.numberOfChats}</td>
                                    <td className={clsx("px-3 sm:px-6 py-4 text-center font-medium", getStatusColor(agent.slPercentage, THRESHOLDS.sl, 'higherIsBetter'))}>
                                        {agent.slPercentage.toFixed(1)}%
                                    </td>
                                    <td className={clsx("px-3 sm:px-6 py-4 text-center font-medium", getStatusColor(agent.frtSeconds, THRESHOLDS.frt))}>
                                        {agent.frtSeconds.toFixed(1)}
                                    </td>
                                    <td className={clsx("px-3 sm:px-6 py-4 text-center font-medium", getStatusColor(agent.artSeconds, THRESHOLDS.art))}>
                                        {agent.artSeconds.toFixed(1)}
                                    </td>
                                    <td className={clsx("px-3 sm:px-6 py-4 text-center font-medium", getStatusColor(agent.ahtMinutes, THRESHOLDS.aht))}>
                                        {agent.ahtMinutes.toFixed(1)}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4">
                                        {issues.length === 0 ? (
                                            <span className="inline-flex items-center gap-1.5 text-green-700 text-xs font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> All OK
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                                <AlertCircle className="w-3.5 h-3.5" /> Check {issues.join(', ')}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {sortedData.length === 0 && (
                            <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                                    No agents found matching the filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
