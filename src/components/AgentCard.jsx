import React from 'react';
import { getStatusColor } from '../utils/scoring';
import { THRESHOLDS } from '../utils/constants';
import { Trophy, Medal, MessageSquare, Zap } from 'lucide-react';
import clsx from 'clsx';

export const AgentCard = ({ agent, rank }) => {

    // Simplified rank styling - uniform professional look
    const rankColors = {
        1: 'border-brand-200 bg-gradient-to-b from-yellow-50 via-orange-50/30 to-white ring-4 ring-brand-50 shadow-xl shadow-brand-900/5',
        2: 'border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white ring-4 ring-slate-50 shadow-xl shadow-slate-900/5',
        3: 'border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white ring-4 ring-slate-50 shadow-xl shadow-slate-900/5',
    };

    const rankIcons = {
        1: <Trophy className="w-8 h-8 text-yellow-600 drop-shadow-sm" />,
        2: <Medal className="w-8 h-8 text-sky-500 drop-shadow-sm" />,
        3: <Medal className="w-8 h-8 text-orange-600 drop-shadow-sm" />,
    };

    const rankLabels = {
        1: '1st Place',
        2: '2nd Place',
        3: '3rd Place',
    };

    return (
        <div className={clsx(
            "relative rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
            rankColors[rank] || 'border-slate-200 bg-white hover:border-brand-200'
        )}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                <div className="bg-white p-3 rounded-full shadow-lg border border-slate-100 mb-1">
                    {rankIcons[rank]}
                </div>
                {/* Rank Label Removed as requested */}
            </div>

            <div className="mt-16 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 mb-4 border-4 border-white shadow-lg ring-1 ring-slate-100">
                    {agent.imageUrl ? (
                        <img src={agent.imageUrl} alt={agent.agentName} className="w-full h-full object-cover" />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br ${rank === 1 ? 'from-yellow-400 to-orange-500' : 'from-brand-400 to-brand-600'}`}>
                            {agent.agentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-xl text-slate-900 tracking-tight">{agent.agentName}</h3>
                <span className="text-xs font-semibold px-3 py-1 bg-brand-50 text-brand-700 rounded-full border border-brand-100 mt-2">
                    {agent.role}
                </span>

                <div className="mt-6 w-full grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                        <div className="text-slate-500 text-xs mb-1 flex items-center justify-center gap-1 font-medium uppercase tracking-wider">
                            <MessageSquare className="w-3 h-3" /> Chats
                        </div>
                        <div className="font-black text-xl text-slate-800">{agent.numberOfChats}</div>
                    </div>
                    <div className="bg-brand-50/80 p-3 rounded-2xl border border-brand-100">
                        <div className="text-brand-600 text-xs mb-1 flex items-center justify-center gap-1 font-medium uppercase tracking-wider">
                            <Zap className="w-3 h-3" /> Service Level
                        </div>
                        <div className="font-black text-xl text-brand-700">{agent.slPercentage.toFixed(1)}%</div>
                    </div>
                </div>

                <div className="mt-4 w-full space-y-3 text-sm bg-white/50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-center items-center border-b border-slate-100 pb-3 mb-3">
                        <span className={clsx(
                            "font-bold text-lg",
                            rank === 1 ? "text-yellow-700" : "text-slate-700"
                        )}>
                            {rankLabels[rank] || `${rank}th Place`}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-500 text-xs font-medium">First Response Time</span>
                        <span className={clsx("font-bold font-mono", getStatusColor(agent.frtSeconds, THRESHOLDS.frt))}>
                            {agent.frtSeconds.toFixed(1)}s
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-500 text-xs font-medium">Avg Response Time</span>
                        <span className={clsx("font-bold font-mono", getStatusColor(agent.artSeconds, THRESHOLDS.art))}>
                            {agent.artSeconds}s
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-500 text-xs font-medium">Avg Handling Time</span>
                        <span className={clsx("font-bold font-mono", getStatusColor(agent.ahtMinutes, THRESHOLDS.aht))}>
                            {agent.ahtMinutes}m
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
