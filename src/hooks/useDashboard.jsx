import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { parseCSVFromUrl } from '../utils/csvParser';

const DashboardContext = createContext(undefined);

// Removed STORAGE_KEY, SYNC_URL_KEY as we now use DB
const SYNC_URL_KEY = 'ahd_dashboard_sync_url'; // Keep sync url in local storage for convenience, or move to DB? 
// Let's keep sync URL in local storage for now as a user preference, 
// but the DATA itself is in the DB.

const API_BASE = import.meta.env.VITE_API_BASE || '/api'; // Use relative path for production (same domain), or env var for local dev if split


export const DashboardProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        periodType: 'Monthly',
        selectedPeriod: '',
        role: 'All',
        searchQuery: '',
    });

    // Sync State
    const [dataSourceUrl, setDataSourceUrlState] = useState(() => {
        return localStorage.getItem(SYNC_URL_KEY);
    });
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);

    // Initial Data Fetch
    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/records`);
            if (!response.ok) throw new Error('Failed to fetch records');
            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

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

    const addRecord = async (record) => {
        try {
            const res = await fetch(`${API_BASE}/records`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            });
            if (!res.ok) throw new Error('Failed to add record');
            const newRecord = await res.json();
            setData(prev => [...prev, newRecord]);
        } catch (err) {
            console.error(err);
            // Optionally set error state
        }
    };

    const updateRecord = async (record) => {
        try {
            const res = await fetch(`${API_BASE}/records/${record.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            });
            if (!res.ok) throw new Error('Failed to update record');
            const updated = await res.json();
            setData(prev => prev.map(item => item.id === record.id ? updated : item));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteRecord = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/records/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete record');
            setData(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Client-side processed import, then sync to server
    const importData = async (newData) => {
        // We will send this bulk data to the server to sync
        setIsSyncing(true);
        try {
            const res = await fetch(`${API_BASE}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
            if (!res.ok) throw new Error('Failed to sync data');
            const allRecords = await res.json();
            setData(allRecords);
        } catch (err) {
            console.error("Import failed", err);
        } finally {
            setIsSyncing(false);
        }
    };

    const resetData = async () => {
        if (confirm('Are you sure you want to delete all data from the database? This cannot be undone.')) {
            try {
                await fetch(`${API_BASE}/records`, { method: 'DELETE' });
                setData([]);
                disconnectSync();
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Sync Logic
    const syncData = useCallback(async () => {
        if (!dataSourceUrl) return;

        setIsSyncing(true);
        try {
            const newData = await parseCSVFromUrl(dataSourceUrl);

            // Send to backend
            const res = await fetch(`${API_BASE}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
            if (!res.ok) {
                let errorMessage = 'Sync failed';
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = `Sync failed: ${res.status} ${res.statusText}`;
                }
                throw new Error(errorMessage);
            }
            const allRecords = await res.json();
            setData(allRecords);

            setLastSyncedAt(new Date());
        } catch (error) {
            console.error("Sync failed:", error);
            setError("Sync failed: " + error.message);
        } finally {
            setIsSyncing(false);
        }
    }, [dataSourceUrl]);

    const setSyncUrl = async (url) => {
        setDataSourceUrlState(url);
        localStorage.setItem(SYNC_URL_KEY, url);
        // Trigger immediate sync
        setIsSyncing(true);
        try {
            const newData = await parseCSVFromUrl(url);
            const res = await fetch(`${API_BASE}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
            if (!res.ok) {
                let errorMessage = 'Initial sync failed';
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = `Initial sync failed: ${res.status} ${res.statusText}`;
                }
                throw new Error(errorMessage);
            }
            const allRecords = await res.json();
            setData(allRecords);
            setLastSyncedAt(new Date());
        } catch (error) {
            console.error("Initial sync failed:", error);
            throw error; // Propagate the specific error message
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
            dataSourceUrl, isSyncing, lastSyncedAt, setSyncUrl, syncData, disconnectSync,
            isLoading, error
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
