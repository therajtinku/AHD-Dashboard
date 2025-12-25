import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAggregatedData } from '../hooks/useAggregatedData';
import { useClickSound } from '../hooks/useClickSound';
import { getStatusColor, checkThresholds, isEligibleForTopPerformer } from '../utils/scoring';
import { THRESHOLDS } from '../utils/constants';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { TopPerformers } from './TopPerformers';
import { ToastNotification } from './ToastNotification';

export const LeaderboardTable = () => {
    const { filters } = useDashboard();
    const aggregatedData = useAggregatedData();
    const { playClickSound } = useClickSound();
    const [sortField, setSortField] = useState('numberOfChats');
    const [sortDirection, setSortDirection] = useState('desc');

    // Toast State
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

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

    const handleRowClick = (agent) => {
        playClickSound();
        const { slStatus, frtStatus, artStatus, ahtStatus } = checkThresholds(agent);
        const issues = [];

        if (slStatus === 'warning') issues.push('SL% is below target');
        if (frtStatus === 'warning') issues.push('First Response Time is too high');
        if (artStatus === 'warning') issues.push('Avg Response Time is too high');
        if (ahtStatus === 'warning') issues.push('Handling Time needs improvement');

        if (issues.length > 0) {
            setToast({
                isVisible: true,
                type: 'warning',
                message: issues.join(', ') + '.'
            });
        } else {
            setToast({
                isVisible: true,
                type: 'success',
                message: 'All metrics are on track! Great job keeping up the performance.'
            });
        }
    };

    return (
        <>
            <ToastNotification
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            {/* Top Performers Podium */}
            <TopPerformers agents={sortedData} />

            <div className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h3 className="font-bold text-xl text-slate-900 tracking-tight">Leaderboard</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Real-time performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
                        {sortedData.length} Agents
                    </span>
                </div>
            </div>

            {/* Modern List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-100/50 rounded-xl mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider border border-slate-200/50">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-3">Agent</div>
                <div className="col-span-1 text-center cursor-pointer hover:text-indigo-600 transition-colors flex items-center justify-center gap-1" onClick={() => handleSort('numberOfChats')}>
                    CHATS
                    {/* Arrow Removed as requested */}
                </div>
                <div className="col-span-1 text-center cursor-pointer hover:text-indigo-600 transition-colors flex items-center justify-center gap-1" onClick={() => handleSort('slPercentage')}>
                    SL% <SortIcon field="slPercentage" />
                </div>
                <div className="col-span-1 text-center cursor-pointer hover:text-indigo-600 transition-colors flex items-center justify-center gap-1" onClick={() => handleSort('frtSeconds')}>
                    FRT <SortIcon field="frtSeconds" />
                </div>
                <div className="col-span-1 text-center cursor-pointer hover:text-indigo-600 transition-colors flex items-center justify-center gap-1" onClick={() => handleSort('artSeconds')}>
                    ART <SortIcon field="artSeconds" />
                </div>
                <div className="col-span-1 text-center cursor-pointer hover:text-indigo-600 transition-colors flex items-center justify-center gap-1" onClick={() => handleSort('ahtMinutes')}>
                    AHT <SortIcon field="ahtMinutes" />
                </div>
                <div className="col-span-2 text-center">Status</div>
            </div>

            {/* Modern List Content */}
            <div className="space-y-3">
                <AnimatePresence mode='popLayout'>
                    {sortedData.map((agent, index) => {
                        const { slStatus, frtStatus, artStatus, ahtStatus } = checkThresholds(agent);
                        const issues = [];
                        if (slStatus === 'warning') issues.push('SL');
                        if (frtStatus === 'warning') issues.push('FRT');
                        if (artStatus === 'warning') issues.push('ART');
                        if (ahtStatus === 'warning') issues.push('AHT');

                        return (
                            <motion.div
                                layout
                                key={agent.id}
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30, delay: index * 0.05 }}
                                onClick={() => handleRowClick(agent)}
                                className="group relative bg-white border border-slate-200 rounded-2xl p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                {/* Mobile Label */}
                                <div className="md:hidden absolute top-4 right-4 text-xs font-bold text-slate-300">#{index + 1}</div>

                                {/* Rank */}
                                <div className="hidden md:flex col-span-1 items-center justify-center">
                                    <span className={`text-lg font-bold ${index < 3 ? 'text-amber-500' : 'text-slate-400'}`}>
                                        {index + 1}
                                    </span>
                                </div>

                                {/* Agent Info */}
                                <div className="col-span-3 flex items-center gap-4 mb-4 md:mb-0">
                                    <div className="relative">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 overflow-hidden border-2 border-slate-100 group-hover:border-indigo-100 transition-colors shadow-sm">
                                            {agent.imageUrl ? (
                                                <img src={agent.imageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                agent.agentName.substring(0, 2)
                                            )}
                                        </div>
                                        {index < 3 && (
                                            <div className="absolute -top-1 -right-1 bg-amber-400 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm border border-white">
                                                {index + 1}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">{agent.agentName}</span>
                                        <span className="text-xs font-mono text-slate-400">{agent.agentId}</span>
                                    </div>
                                </div>

                                {/* Stats Grid (Mobile Adapted) */}
                                <div className="grid grid-cols-2 gap-4 md:contents">
                                    <div className="md:col-span-1 text-center md:flex md:justify-center md:items-center">
                                        <div className="md:hidden text-xs text-slate-400 mb-1">CHATS</div>
                                        <span className="font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg md:bg-transparent">{agent.numberOfChats}</span>
                                    </div>
                                    <div className="md:col-span-1 text-center md:flex md:justify-center md:items-center">
                                        <div className="md:hidden text-xs text-slate-400 mb-1">SL%</div>
                                        <span className={clsx("font-mono font-bold px-2 py-1 rounded-lg", getStatusColor(agent.slPercentage, THRESHOLDS.sl, 'higherIsBetter'))}>
                                            {agent.slPercentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="md:col-span-1 text-center md:flex md:justify-center md:items-center">
                                        <div className="md:hidden text-xs text-slate-400 mb-1">FRT</div>
                                        <span className={clsx("font-mono font-bold px-2 py-1 rounded-lg", getStatusColor(agent.frtSeconds, THRESHOLDS.frt))}>
                                            {agent.frtSeconds.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="md:col-span-1 text-center md:flex md:justify-center md:items-center">
                                        <div className="md:hidden text-xs text-slate-400 mb-1">ART</div>
                                        <span className={clsx("font-mono font-bold px-2 py-1 rounded-lg", getStatusColor(agent.artSeconds, THRESHOLDS.art))}>
                                            {agent.artSeconds.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="md:col-span-1 text-center md:flex md:justify-center md:items-center">
                                        <div className="md:hidden text-xs text-slate-400 mb-1">AHT</div>
                                        <span className={clsx("font-mono font-bold px-2 py-1 rounded-lg", getStatusColor(agent.ahtMinutes, THRESHOLDS.aht))}>
                                            {agent.ahtMinutes.toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="mt-4 md:mt-0 md:col-span-2 flex justify-center md:justify-center">
                                    {issues.length === 0 ? (
                                        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">On Track</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm animate-pulse">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{issues.length} Review</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
            {sortedData.length === 0 && (
                <div className="px-6 py-12 text-center text-slate-400 bg-white/50">
                    No agents found matching the current filters.
                </div>
            )}
        </>
    );
};
