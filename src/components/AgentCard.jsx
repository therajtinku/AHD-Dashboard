import React from 'react';
import { getStatusColor } from '../utils/scoring';
import { THRESHOLDS } from '../utils/constants';
import { Trophy, Medal, MessageSquare, Zap } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export const AgentCard = ({ agent, rank }) => {

    const rankColors = {
        1: 'from-amber-100/80 via-amber-50/50 to-white border-amber-200 ring-4 ring-amber-100/50 shadow-xl shadow-amber-900/10', // Gold
        2: 'from-slate-200/80 via-slate-50/50 to-white border-slate-300 ring-4 ring-slate-200/50 shadow-xl shadow-slate-900/10', // Silver (Darker for contrast)
        3: 'from-orange-100/80 via-orange-50/50 to-white border-orange-200 ring-4 ring-orange-100/50 shadow-xl shadow-orange-900/10', // Bronze
    };

    const rankTextColors = {
        1: 'text-amber-800',
        2: 'text-slate-700',
        3: 'text-orange-800',
    };

    const rankIcons = {
        1: <Trophy className="w-6 h-6 text-amber-600 drop-shadow-sm" />,
        2: <Medal className="w-6 h-6 text-slate-500 drop-shadow-sm" />,
        3: <Medal className="w-6 h-6 text-orange-600 drop-shadow-sm" />,
    };

    return (
        <motion.div
            // Optimization: Use a "softer" spring for comfort, and hint GPU acceleration
            whileHover={{
                y: -6,
                transition: { type: "spring", stiffness: 200, damping: 25 }
            }}
            className={clsx(
                "relative rounded-3xl border p-6 transition-colors duration-300 bg-gradient-to-b will-change-transform backface-hidden",
                rankColors[rank] || 'from-white to-white border-white/60 hover:border-brand-200/60 shadow-lg shadow-slate-900/5'
            )}
        >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="bg-white p-2.5 rounded-full shadow-md border border-slate-100"
                >
                    {rankIcons[rank]}
                </motion.div>
            </div>

            <div className="mt-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 mb-3 border-2 border-white shadow-md relative group">
                    {agent.imageUrl ? (
                        <img src={agent.imageUrl} alt={agent.agentName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br ${rank === 1 ? 'from-amber-400 to-orange-400' : 'from-brand-400 to-brand-500'}`}>
                            {agent.agentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-lg text-slate-900 tracking-tight">{agent.agentName}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full mt-1.5 border border-slate-200/50">
                    {agent.role}
                </span>

                <div className="mt-5 w-full grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/60">
                        <div className="text-slate-400 text-[10px] mb-0.5 flex items-center justify-center gap-1 font-semibold uppercase tracking-wider">
                            Chat Vol
                        </div>
                        <div className="font-bold text-lg text-slate-700">{agent.numberOfChats}</div>
                    </div>
                    <div className="bg-brand-50/50 p-2.5 rounded-xl border border-brand-100/60">
                        <div className="text-brand-600/80 text-[10px] mb-0.5 flex items-center justify-center gap-1 font-semibold uppercase tracking-wider">
                            S. Level
                        </div>
                        <div className="font-bold text-lg text-brand-700">{agent.slPercentage.toFixed(1)}%</div>
                    </div>
                </div>

                <div className="mt-4 w-full space-y-2.5 text-sm">
                    <div className="flex justify-center items-center pb-2 mb-2 border-b border-slate-100/50">
                        <span className={clsx(
                            "font-bold text-sm uppercase tracking-widest",
                            rankTextColors[rank] || "text-slate-400"
                        )}>
                            {rank === 1 ? 'Top Performer' : `#${rank} Ranked`}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-medium">response time</span>
                        <span className={clsx("font-bold font-mono text-xs", getStatusColor(agent.frtSeconds, THRESHOLDS.frt))}>
                            {agent.frtSeconds.toFixed(1)}s
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-medium">avg response</span>
                        <span className={clsx("font-bold font-mono text-xs", getStatusColor(agent.artSeconds, THRESHOLDS.art))}>
                            {agent.artSeconds}s
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-medium">handle time</span>
                        <span className={clsx("font-bold font-mono text-xs", getStatusColor(agent.ahtMinutes, THRESHOLDS.aht))}>
                            {agent.ahtMinutes}m
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
