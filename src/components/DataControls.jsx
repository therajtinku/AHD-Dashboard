import React, { useState } from 'react';
import { Upload, Plus, Trash2, RefreshCw, Link2Off, CheckCircle2 } from 'lucide-react';

import { useDashboard } from '../hooks/useDashboard';
import { useClickSound } from '../hooks/useClickSound';
import { CsvUploadModal } from './CsvUploadModal';
import { AgentFormModal } from './AgentFormModal';

export const DataControls = () => {
    const { resetData, data, dataSourceUrl, isSyncing, lastSyncedAt, syncData, disconnectSync } = useDashboard();
    const { playClickSound } = useClickSound();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <div className="flex flex-wrap gap-3 mb-6 justify-end items-center">
            {dataSourceUrl && (
                <div className="flex items-center gap-3 mr-auto bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-blue-700">
                            <CheckCircle2 className="w-4 h-4" />
                            Synced with Google Sheet
                        </div>
                        {lastSyncedAt && (
                            <span className="text-xs text-blue-500 pl-5">
                                Last updated: {lastSyncedAt.toLocaleTimeString()}
                            </span>
                        )}
                    </div>

                    <div className="h-8 w-px bg-blue-200 mx-1" />

                    <button
                        onClick={() => {
                            playClickSound();
                            syncData();
                        }}
                        disabled={isSyncing}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        onClick={() => {
                            playClickSound();
                            if (window.confirm('Stop syncing with Google Sheet? Data will remain but will no longer update.')) {
                                disconnectSync();
                            }
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                        title="Disconnect Sync"
                    >
                        <Link2Off className="w-4 h-4" />
                    </button>
                </div>
            )}

            <button
                onClick={() => {
                    playClickSound();
                    setIsAddOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
            >
                <Plus className="w-4 h-4" />
                Add Record
            </button>

            <button
                onClick={() => {
                    playClickSound();
                    setIsUploadOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm cursor-pointer"
            >
                <Upload className="w-4 h-4" />
                Import CSV
            </button>

            {data.length > 0 && (
                <button
                    onClick={() => {
                        playClickSound();
                        if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                            resetData();
                            // Optional: Reload to ensure clean state if context doesn't update fast enough, 
                            // but React state update should be sufficient. 
                            // If reload is needed for some reason, do it after a tick.
                            setTimeout(() => window.location.reload(), 100);
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                    Reset Data
                </button>
            )}

            {isUploadOpen && <CsvUploadModal onClose={() => setIsUploadOpen(false)} />}
            {isAddOpen && <AgentFormModal onClose={() => setIsAddOpen(false)} />}
        </div>
    );
};
