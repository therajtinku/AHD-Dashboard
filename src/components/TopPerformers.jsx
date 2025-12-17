import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAggregatedData } from '../hooks/useAggregatedData';
import { AgentCard } from './AgentCard';
import { isEligibleForTopPerformer } from '../utils/scoring';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const TopPerformers = () => {
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 border-dashed"
            >
                <p className="text-slate-500">No data available for the selected period.</p>
            </motion.div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3, // Increased stagger for better visibility
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 100, scale: 0.8 }, // More dramatic start
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 80, // Softer spring
                damping: 10
            }
        }
    };

    return (
        <div className="mb-16">
            <div className="text-center mb-12 relative z-20">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold text-brand-900 mb-2 flex items-center justify-center gap-3"
                >
                    <Trophy className="w-8 h-8 text-brand-500" />
                    Top Performers
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-500"
                >
                    Celebrating excellence in support delivery
                </motion.p>
            </div>

            {/* Podium Layout: 2nd, 1st, 3rd */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible" // Triggers when scrolled into view
                viewport={{ once: true, amount: 0.3 }} // Waits until 30% visible
                className="flex flex-col md:flex-row justify-center items-end gap-8 md:gap-12 px-4 mt-16"
            >
                {/* 2nd Place */}
                {top3[1] && (
                    <motion.div variants={itemVariants} className="w-full md:w-1/3 max-w-sm order-2 md:order-1">
                        <AgentCard agent={top3[1]} rank={2} />
                    </motion.div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                    <motion.div variants={itemVariants} className="w-full md:w-1/3 max-w-sm order-1 md:order-2 md:-mt-16 z-10 transform md:scale-110 mb-12 md:mb-0">
                        <AgentCard agent={top3[0]} rank={1} />
                    </motion.div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <motion.div variants={itemVariants} className="w-full md:w-1/3 max-w-sm order-3 md:order-3">
                        <AgentCard agent={top3[2]} rank={3} />
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};
