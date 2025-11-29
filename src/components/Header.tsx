import React from 'react';
import { BarChart3, Activity, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-[#7c3aed] via-[#3b82f6] to-[#22d3ee] text-white shadow-xl border-b border-brand-500/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="relative p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <BarChart3 className="w-8 h-8 text-white relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                AHD Dashboard <Sparkles className="w-5 h-5 text-brand-300 animate-pulse" />
                            </h1>
                            <p className="text-brand-100 text-sm font-medium flex items-center gap-2 mt-1">
                                <Activity className="w-3 h-3" /> Weekly & Monthly Agent Performance
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
};
