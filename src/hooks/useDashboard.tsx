import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import type { AgentPerformance, FilterState } from '../types';
import { parseCSVFromUrl } from '../utils/csvParser';

interface DashboardContextType {
    data: AgentPerformance[];
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    addRecord: (record: AgentPerformance) => void;
    updateRecord: (record: AgentPerformance) => void;
    deleteRecord: (id: string) => void;
    importData: (newData: AgentPerformance[]) => void;
    resetData: () => void;
    // Sync related
    dataSourceUrl: string | null;
    isSyncing: boolean;
    lastSyncedAt: Date | null;
    setSyncUrl: (url: string) => Promise<void>;
    syncData: () => Promise<void>;
    disconnectSync: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const STORAGE_KEY = 'ahd_dashboard_data';
const SYNC_URL_KEY = 'ahd_dashboard_sync_url';

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AgentPerformance[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    const [filters, setFilters] = useState<FilterState>({
        periodType: 'Monthly',
        selectedPeriod: '',
        role: 'All',
        searchQuery: '',
    });

    // Sync State
    const [dataSourceUrl, setDataSourceUrlState] = useState<string | null>(() => {
        return localStorage.getItem(SYNC_URL_KEY);
    });
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    // Initialize filters based on data if empty
    useEffect(() => {
        if (!filters.selectedPeriod && data.length > 0) {
            // Default to the most recent month found in data
            const months = Array.from(new Set(data.map(d => d.month))).sort().reverse();
            if (months.length > 0) {
                setFilters(prev => ({ ...prev, selectedPeriod: months[0], periodType: 'Monthly' }));
            }
        }
    }, [data, filters.selectedPeriod]);

    const addRecord = (record: AgentPerformance) => {
        setData(prev => [...prev, record]);
    };

    const updateRecord = (record: AgentPerformance) => {
        setData(prev => prev.map(item => item.id === record.id ? record : item));
    };

    const deleteRecord = (id: string) => {
        setData(prev => prev.filter(item => item.id !== id));
    };

    const importData = (newData: AgentPerformance[]) => {
        // When manually importing, we might want to disconnect sync if it was active?
        // Or just append. For now, let's keep it simple and just append/merge.
        // But if the user specifically asked for "Sync", that's handled by setSyncUrl.
        // Manual import usually implies ad-hoc addition.

        setData(prev => {
            const newIds = new Set(newData.map(d => `${d.agentId}-${d.week}-${d.month}`));
            const filteredPrev = prev.filter(d => !newIds.has(`${d.agentId}-${d.week}-${d.month}`));
            return [...filteredPrev, ...newData];
        });
    };

    const resetData = () => {
        setData([]);
        disconnectSync(); // Also clear sync when resetting
        localStorage.removeItem(STORAGE_KEY);
    };

    // Sync Logic
    const syncData = useCallback(async () => {
        if (!dataSourceUrl) return;

        setIsSyncing(true);
        try {
            const newData = await parseCSVFromUrl(dataSourceUrl);
            // In sync mode, we REPLACE the data to reflect deletions
            setData(newData);
            setLastSyncedAt(new Date());
        } catch (error) {
            console.error("Sync failed:", error);
            // Optionally handle error state here
        } finally {
            setIsSyncing(false);
        }
    }, [dataSourceUrl]);

    const setSyncUrl = async (url: string) => {
        setDataSourceUrlState(url);
        localStorage.setItem(SYNC_URL_KEY, url);
        // Trigger immediate sync
        // We need to use the url directly here because state update might not be immediate
        setIsSyncing(true);
        try {
            const newData = await parseCSVFromUrl(url);
            setData(newData);
            setLastSyncedAt(new Date());
        } catch (error) {
            console.error("Initial sync failed:", error);
            throw error; // Re-throw to let UI know
        } finally {
            setIsSyncing(false);
        }
    };

    const disconnectSync = () => {
        setDataSourceUrlState(null);
        localStorage.removeItem(SYNC_URL_KEY);
        setLastSyncedAt(null);
    };

    // Auto-sync interval
    useEffect(() => {
        if (!dataSourceUrl) return;

        // Initial sync on load if url exists
        syncData();

        const intervalId = setInterval(() => {
            syncData();
        }, 30000); // 30 seconds

        return () => clearInterval(intervalId);
    }, [dataSourceUrl, syncData]);

    return (
        <DashboardContext.Provider value={{
            data, filters, setFilters, addRecord, updateRecord, deleteRecord, importData, resetData,
            dataSourceUrl, isSyncing, lastSyncedAt, setSyncUrl, syncData, disconnectSync
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};
