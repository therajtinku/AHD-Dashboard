import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';

export const TopPerformers = ({ agents }) => {
    if (!agents || agents.length < 3) return null;

    const top3 = agents.slice(0, 3);
    const [first, second, third] = [top3[0], top3[1], top3[2]];

    const podiumVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: custom * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        })
    };

    const PodiumSpot = ({ agent, rank, delay }) => (
        <motion.div
            custom={delay}
            variants={podiumVariant}
            initial="hidden"
            animate="visible"
            className={`flex flex-col items-center justify-end ${rank === 1 ? '-mt-12 z-10' : ''}`}
        >
            <div className="relative group cursor-pointer flex flex-col items-center">

                {/* Crown for #1 - Centered Alignment */}
                {/* Crown Removed */}

                {/* Avatar Ring */}
                <div className={`rounded-full p-1.5 transition-all duration-300 ${rank === 1 ? 'bg-gradient-to-b from-yellow-300 to-amber-500 shadow-xl shadow-amber-500/30' :
                    rank === 2 ? 'bg-gradient-to-b from-slate-300 to-slate-400 shadow-lg' :
                        'bg-gradient-to-b from-orange-300 to-orange-400 shadow-lg'}`}>
                    <div className={`rounded-full overflow-hidden bg-white border-2 border-white ${rank === 1 ? 'w-24 h-24 md:w-32 md:h-32' : 'w-20 h-20 md:w-24 md:h-24'}`}>
                        {agent.imageUrl ? (
                            <img src={agent.imageUrl} alt={agent.agentName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center font-bold text-slate-300 ${rank === 1 ? 'text-4xl' : 'text-2xl'}`}>
                                {agent.agentName.substring(0, 2)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Rank Badge */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white lg:w-10 lg:h-10 text-white font-bold shadow-md z-20
                    ${rank === 1 ? 'bg-amber-500' : rank === 2 ? 'bg-slate-400' : 'bg-orange-400'}`}>
                    {rank}
                </div>
            </div>

            {/* Content Card with Enhanced Stats */}
            <div className={`mt-8 text-center bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl p-3 shadow-sm w-40 md:w-56 group-hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
                <h3 className="font-bold text-slate-900 truncate px-2 text-md md:text-lg">{agent.agentName}</h3>

                <div className="flex items-center justify-center gap-1.5 mb-3">
                    {rank === 1 ? <Trophy className="w-3.5 h-3.5 text-amber-500" /> : <Medal className={`w-3.5 h-3.5 ${rank === 2 ? 'text-slate-400' : 'text-orange-400'}`} />}
                    <span className="font-bold font-mono text-slate-700 text-lg">{agent.slPercentage.toFixed(1)}%</span>
                </div>

                {/* Detailed Stats Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2">
                    <div className="bg-slate-50 rounded p-1">
                        <span className="block text-slate-400 font-medium text-[10px] uppercase">Chats</span>
                        <span className="font-bold text-slate-700">{agent.numberOfChats}</span>
                    </div>
                    <div className="bg-slate-50 rounded p-1">
                        <span className="block text-slate-400 font-medium text-[10px] uppercase">FRT</span>
                        <span className="font-bold text-slate-700">{agent.frtSeconds}s</span>
                    </div>
                    <div className="bg-slate-50 rounded p-1">
                        <span className="block text-slate-400 font-medium text-[10px] uppercase">ART</span>
                        <span className="font-bold text-slate-700">{agent.artSeconds}s</span>
                    </div>
                    <div className="bg-slate-50 rounded p-1">
                        <span className="block text-slate-400 font-medium text-[10px] uppercase">AHT</span>
                        <span className="font-bold text-slate-700">{agent.ahtMinutes}m</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="relative w-full max-w-5xl mx-auto mb-20 px-4 mt-16">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-48 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

            <div className="relative flex flex-wrap justify-center items-end gap-x-4 gap-y-12 md:gap-x-12 pb-8">
                {/* Order: 2, 1, 3 for visual pyramid */}
                <div className="order-2 md:order-1"><PodiumSpot agent={second} rank={2} delay={0.2} /></div>
                <div className="order-1 md:order-2"><PodiumSpot agent={first} rank={1} delay={0.4} /></div>
                <div className="order-3 md:order-3"><PodiumSpot agent={third} rank={3} delay={0.6} /></div>
            </div>
        </div>
    );
};
