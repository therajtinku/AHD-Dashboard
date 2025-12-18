import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAggregatedData } from '../hooks/useAggregatedData';
import { useClickSound } from '../hooks/useClickSound';
import { getStatusColor, checkThresholds, isEligibleForTopPerformer } from '../utils/scoring';
import { THRESHOLDS } from '../utils/constants';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentDetailModal } from './AgentDetailModal';

export const LeaderboardTable = () => {
    const { filters } = useDashboard();
    const aggregatedData = useAggregatedData();
    const { playClickSound } = useClickSound();
    const [sortField, setSortField] = useState('numberOfChats');
    const [sortDirection, setSortDirection] = useState('desc');
    const [selectedAgent, setSelectedAgent] = useState(null);

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
            setSortDirection('desc');
        }
    };

    const sortedData = [...filteredData].sort((a, b) => {
        const aEligible = isEligibleForTopPerformer(a);
        const bEligible = isEligibleForTopPerformer(b);

        if (aEligible && !bEligible) return -1;
        if (!aEligible && bEligible) return 1;

        const modifier = sortDirection === 'asc' ? 1 : -1;
        if (a[sortField] < b[sortField]) return -1 * modifier;
        if (a[sortField] > b[sortField]) return 1 * modifier;
        return 0;
    });

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <div className="w-3 h-3 opacity-0" />;
        return sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
    };

    return (
        <>
            <AgentDetailModal
                agent={selectedAgent}
                onClose={() => setSelectedAgent(null)}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                id="leaderboard-section"
                className="glass-panel rounded-3xl overflow-hidden mb-12"
            >
                <div className="px-8 py-6 border-b border-slate-100/50 flex justify-between items-center bg-white/50">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 tracking-tight">Leaderboard</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">Real-time performance metrics</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
                        {sortedData.length} Agents
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/30 text-slate-400 font-semibold border-b border-slate-100/60">
                            <tr>
                                <th className="px-4 md:px-6 py-4 w-16 text-center">#</th>
                                <th className="px-4 md:px-6 py-4">Agent</th>
                                <th className="px-4 md:px-6 py-4">ID</th>
                                <th className="px-4 md:px-6 py-4 text-center cursor-pointer hover:text-brand-600 transition-colors" onClick={() => { playClickSound(); handleSort('numberOfChats'); }}>
                                    <div className="flex items-center justify-center gap-1">CHATS <SortIcon field="numberOfChats" /></div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-center cursor-pointer hover:text-brand-600 transition-colors" onClick={() => { playClickSound(); handleSort('slPercentage'); }}>
                                    <div className="flex items-center justify-center gap-1">SL% <SortIcon field="slPercentage" /></div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-center cursor-pointer hover:text-brand-600 transition-colors" onClick={() => { playClickSound(); handleSort('frtSeconds'); }}>
                                    <div className="flex items-center justify-center gap-1">FRT <SortIcon field="frtSeconds" /></div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-center cursor-pointer hover:text-brand-600 transition-colors" onClick={() => { playClickSound(); handleSort('artSeconds'); }}>
                                    <div className="flex items-center justify-center gap-1">ART <SortIcon field="artSeconds" /></div>
                                </th>
                                <th className="px-4 md:px-6 py-4 text-center cursor-pointer hover:text-brand-600 transition-colors" onClick={() => { playClickSound(); handleSort('ahtMinutes'); }}>
                                    <div className="flex items-center justify-center gap-1">AHT <SortIcon field="ahtMinutes" /></div>
                                </th>
                                <th className="px-4 md:px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/40">
                            <AnimatePresence>
                                {sortedData.map((agent, index) => {
                                    const { slStatus, frtStatus, artStatus, ahtStatus } = checkThresholds(agent);
                                    const issues = [];
                                    if (slStatus === 'warning') issues.push('SL');
                                    if (frtStatus === 'warning') issues.push('FRT');
                                    if (artStatus === 'warning') issues.push('ART');
                                    if (ahtStatus === 'warning') issues.push('AHT');

                                    return (
                                        <motion.tr
                                            key={agent.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.4, ease: "easeInOut", delay: index * 0.04 }}
                                            onClick={() => { playClickSound(); setSelectedAgent(agent); }}
                                            className="hover:bg-brand-50/40 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-4 md:px-6 py-4 text-center text-slate-300 font-medium group-hover:text-brand-400">{index + 1}</td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden border border-slate-100 shadow-sm">
                                                        {agent.imageUrl ? (
                                                            <img src={agent.imageUrl} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            agent.agentName.split(' ').map((n) => n[0]).join('').slice(0, 2)
                                                        )}
                                                    </div>
                                                    <span className="font-semibold text-slate-700 group-hover:text-brand-700 transition-colors">{agent.agentName}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <span className="font-mono text-slate-400 text-[10px] tracking-wide">
                                                    {agent.agentId}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 text-center font-bold text-slate-800">{agent.numberOfChats}</td>
                                            <td className={clsx("px-4 md:px-6 py-4 text-center font-medium", getStatusColor(agent.slPercentage, THRESHOLDS.sl, 'higherIsBetter'))}>
                                                {agent.slPercentage.toFixed(1)}%
                                            </td>
                                            <td className={clsx("px-4 md:px-6 py-4 text-center font-medium", getStatusColor(agent.frtSeconds, THRESHOLDS.frt))}>
                                                {agent.frtSeconds.toFixed(1)}
                                            </td>
                                            <td className={clsx("px-4 md:px-6 py-4 text-center font-medium", getStatusColor(agent.artSeconds, THRESHOLDS.art))}>
                                                {agent.artSeconds.toFixed(1)}
                                            </td>
                                            <td className={clsx("px-4 md:px-6 py-4 text-center font-medium", getStatusColor(agent.ahtMinutes, THRESHOLDS.aht))}>
                                                {agent.ahtMinutes.toFixed(1)}
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <button
                                                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 rounded-full"
                                                >
                                                    {issues.length === 0 ? (
                                                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">Good</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 hover:bg-amber-100 transition-colors">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">Review</span>
                                                        </div>
                                                    )}
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {sortedData.length === 0 && (
                    <div className="px-6 py-12 text-center text-slate-400 bg-white/50">
                        No agents found matching the current filters.
                    </div>
                )}
            </motion.div>
        </>
    );
};
