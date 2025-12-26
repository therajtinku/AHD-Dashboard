import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useClickSound } from '../hooks/useClickSound';
import { Search, Calendar } from 'lucide-react';

export const FiltersBar = () => {
    const { filters, setFilters, data } = useDashboard();
    const { playClickSound } = useClickSound();

    // Extract available weeks and months
    const weeks = Array.from(new Set(data.map(d => d.week).filter(Boolean))).sort().reverse();
    const months = Array.from(new Set(data.map(d => d.month))).sort().reverse();

    const handlePeriodTypeChange = (e) => {
        const newType = e.target.value;
        // Reset selected period when type changes to avoid mismatch
        const newSelected = newType === 'Weekly' ? (weeks[0] || '') : (months[0] || '');
        setFilters({ ...filters, periodType: newType, selectedPeriod: newSelected });
    };

    const [searchTerm, setSearchTerm] = React.useState(filters.searchQuery);

    const handleSearch = () => {
        setFilters({ ...filters, searchQuery: searchTerm });
        // Scroll to leaderboard section
        const leaderboardElement = document.getElementById('leaderboard-section');
        if (leaderboardElement) {
            leaderboardElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 mb-10">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Period Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                            <select
                                className="bg-transparent border-none text-sm font-medium focus:ring-0 text-slate-700 cursor-pointer w-full"
                                value={filters.periodType}
                                onChange={handlePeriodTypeChange}
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Weekly">Weekly</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full sm:w-48">
                            <select
                                className="bg-transparent border-none text-sm font-medium focus:ring-0 text-slate-700 cursor-pointer w-full p-0"
                                value={filters.selectedPeriod}
                                onChange={(e) => setFilters({ ...filters, selectedPeriod: e.target.value })}
                            >
                                <option value="" disabled>Select Period</option>
                                {filters.periodType === 'Weekly'
                                    ? weeks.map(w => <option key={w} value={w}>{w}</option>)
                                    : months.map(m => <option key={m} value={m}>{m}</option>)
                                }
                            </select>
                        </div>
                    </div>
                </div>

                {/* Search and Role Filter */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search agents..."
                            className="w-full rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-brand-500 px-3 py-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={() => {
                                playClickSound();
                                handleSearch();
                            }}
                            className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm cursor-pointer"
                            title="Search"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};
