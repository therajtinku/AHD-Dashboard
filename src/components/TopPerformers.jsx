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

    const MobileWinnerCard = ({ agent }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 bg-gradient-to-br from-amber-50/90 to-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl p-4 shadow-lg shadow-amber-500/10 flex items-center gap-4 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <Crown size={64} className="text-amber-500" />
            </div>

            <div className="relative">
                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-b from-yellow-300 to-amber-500 shadow-md">
                    <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                        {agent.imageUrl ? (
                            <img src={agent.imageUrl} alt={agent.agentName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-amber-300 text-xl">
                                {agent.agentName.substring(0, 2)}
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-6 h-6 rounded-full border-2 border-white text-white font-bold shadow-sm z-20 text-xs bg-amber-500">
                    1
                </div>
            </div>

            <div className="flex-1 relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">{agent.agentName}</h3>
                        <div className="flex items-center gap-1.5 text-amber-600 font-bold font-mono text-sm">
                            <Trophy size={14} />
                            <span>SL {agent.slPercentage.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-amber-100">
                    <div className="text-center">
                        <div className="text-[9px] text-amber-700/60 uppercase font-bold tracking-wider">Chats</div>
                        <div className="font-bold text-amber-900 text-xs">{agent.numberOfChats}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] text-amber-700/60 uppercase font-bold tracking-wider">FRT</div>
                        <div className="font-bold text-amber-900 text-xs">{agent.frtSeconds}s</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] text-amber-700/60 uppercase font-bold tracking-wider">ART</div>
                        <div className="font-bold text-amber-900 text-xs">{agent.artSeconds}s</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] text-amber-700/60 uppercase font-bold tracking-wider">AHT</div>
                        <div className="font-bold text-amber-900 text-xs">{agent.ahtMinutes}m</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const MobileRunnerUpCard = ({ agent, rank }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * rank }}
            className="col-span-1 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col items-center text-center relative"
        >
            <div className="relative mb-2">
                <div className="w-12 h-12 rounded-full p-1 bg-gradient-to-b from-slate-200 to-slate-300">
                    <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                        {agent.imageUrl ? (
                            <img src={agent.imageUrl} alt={agent.agentName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-sm">
                                {agent.agentName.substring(0, 2)}
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center w-5 h-5 rounded-full border-2 border-white text-white font-bold shadow-sm z-20 text-[10px] bg-slate-400">
                    {rank}
                </div>
            </div>

            <h3 className="font-bold text-slate-900 text-xs truncate w-full mb-1">{agent.agentName}</h3>
            <div className="flex items-center gap-1 text-slate-500 font-bold font-mono text-[10px] mb-2">
                <Medal size={10} />
                <span>SL {agent.slPercentage.toFixed(1)}%</span>
            </div>

            <div className="grid grid-cols-2 gap-1 w-full text-[9px] bg-slate-50 rounded-lg p-1.5">
                <div>
                    <span className="text-slate-400 block pb-0.5">CHATS</span>
                    <span className="font-bold text-slate-700">{agent.numberOfChats}</span>
                </div>
                <div>
                    <span className="text-slate-400 block pb-0.5">FRT</span>
                    <span className="font-bold text-slate-700">{agent.frtSeconds}</span>
                </div>
                <div>
                    <span className="text-slate-400 block pb-0.5">ART</span>
                    <span className="font-bold text-slate-700">{agent.artSeconds}</span>
                </div>
                <div>
                    <span className="text-slate-400 block pb-0.5">AHT</span>
                    <span className="font-bold text-slate-700">{agent.ahtMinutes}</span>
                </div>
            </div>
        </motion.div>
    );

    const PodiumSpot = ({ agent, rank, delay }) => (
        <motion.div
            custom={delay}
            variants={podiumVariant}
            initial="hidden"
            animate="visible"
            className={`flex flex-col items-center justify-end ${rank === 1 ? '-mt-12 z-10' : 'z-0'}`}
        >
            <div className="relative group cursor-pointer flex flex-col items-center">

                {/* Avatar Ring */}
                <div className={`rounded-full p-1.5 transition-all duration-300 ${rank === 1 ? 'bg-gradient-to-b from-yellow-300 to-amber-500 shadow-xl shadow-amber-500/30' :
                    'bg-gradient-to-b from-slate-300 to-slate-400 shadow-lg'}`}>
                    <div className={`rounded-full overflow-hidden bg-white border-2 border-white ${rank === 1 ? 'w-32 h-32' : 'w-24 h-24'}`}>
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
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white font-bold shadow-md z-20 text-base
                    ${rank === 1 ? 'bg-amber-500' : 'bg-slate-400'}`}>
                    {rank}
                </div>
            </div>

            {/* Content Card with Enhanced Stats */}
            <div className={`mt-8 text-center bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl p-3 shadow-sm w-56 group-hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
                <h3 className="font-bold text-slate-900 truncate px-1 text-lg">{agent.agentName}</h3>

                <div className="flex items-center justify-center gap-1 mb-3 mt-1">
                    {rank === 1 ? <Trophy className="w-3.5 h-3.5 text-amber-500" /> : <Medal className={`w-3.5 h-3.5 text-slate-400`} />}
                    <span className="font-bold font-mono text-slate-700 text-lg">SL {agent.slPercentage.toFixed(1)}%</span>
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
        <div className="relative w-full max-w-5xl mx-auto mb-10 md:mb-20 px-2 md:px-4 mt-4 md:mt-16">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 md:h-48 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

            {/* Mobile View: Grid Layout */}
            <div className="md:hidden grid grid-cols-2 gap-3">
                <MobileWinnerCard agent={first} />
                <MobileRunnerUpCard agent={second} rank={2} />
                <MobileRunnerUpCard agent={third} rank={3} />
            </div>

            {/* Desktop View: Podium Layout */}
            <div className="hidden md:flex relative justify-center items-end gap-x-12 pb-8">
                <div className="order-1"><PodiumSpot agent={second} rank={2} delay={0.2} /></div>
                <div className="order-2"><PodiumSpot agent={first} rank={1} delay={0.4} /></div>
                <div className="order-3"><PodiumSpot agent={third} rank={3} delay={0.6} /></div>
            </div>
        </div>
    );
};
