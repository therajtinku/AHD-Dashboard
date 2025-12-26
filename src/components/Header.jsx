import React from 'react';
import { BarChart3, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="sticky top-2 md:top-4 z-50 px-2 md:px-8 mb-6 md:mb-8"
        >
            <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-lg shadow-indigo-500/5 backdrop-blur-xl bg-white/80 border border-white/40">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            AHD Dashboard
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                        <Activity className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Live Tracking</span>
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
