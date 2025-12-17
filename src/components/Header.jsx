import React from 'react';
import { BarChart3, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 mb-8"
        >
            <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative p-2.5 bg-brand-600/10 rounded-xl group overflow-hidden border border-brand-500/20">
                        <BarChart3 className="w-6 h-6 text-brand-600 relative z-10" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            AHD Dashboard
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-700">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Live Performance Tracking</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="text-xs font-medium text-slate-500">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>
        </motion.header>
    );
};
