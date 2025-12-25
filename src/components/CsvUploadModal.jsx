import React, { useState, useRef } from 'react';
import { X, UploadCloud, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useClickSound } from '../hooks/useClickSound';
import { parseCSV, parseCSVFromUrl } from '../utils/csvParser';

export const CsvUploadModal = ({ onClose }) => {
    const { importData, setSyncUrl } = useDashboard();
    const { playClickSound } = useClickSound();
    const [activeTab, setActiveTab] = useState('file');
    const [url, setUrl] = useState('');
    const [keepSync, setKeepSync] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);
        try {
            const data = await parseCSV(file);
            importData(data);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to parse CSV');
        } finally {
            setLoading(false);
        }
    };

    const handleUrlImport = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        try {
            if (keepSync) {
                await setSyncUrl(url);
            } else {
                const data = await parseCSVFromUrl(url);
                importData(data);
            }
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to fetch or parse CSV from URL');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
                    <h3 className="font-bold text-lg text-slate-800">Import Data</h3>
                    <button onClick={() => { playClickSound(); onClose(); }} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${activeTab === 'file' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => { playClickSound(); setActiveTab('file'); }}
                        >
                            Upload File
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${activeTab === 'url' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => { playClickSound(); setActiveTab('url'); }}
                        >
                            From URL
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {activeTab === 'file' ? (
                        <div
                            className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group bg-slate-50/50"
                            onClick={() => { playClickSound(); fileInputRef.current?.click(); }}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv"
                                onChange={handleFileUpload}
                            />
                            <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            <p className="text-slate-700 font-medium mb-1">Click to upload CSV</p>
                            <p className="text-slate-400 text-sm">or drag and drop</p>
                        </div>
                    ) : (
                        <form onSubmit={handleUrlImport}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Google Sheet URL</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="url"
                                        className="w-full pl-9 rounded-lg border border-slate-300 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 placeholder:text-slate-400 focus:outline-none py-2.5 transition-all"
                                        placeholder="https://docs.google.com/spreadsheets/..."
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>

                            </div>

                            <div className="mb-4 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="keepSync"
                                    checked={keepSync}
                                    onChange={(e) => setKeepSync(e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <label htmlFor="keepSync" className="text-sm text-slate-600 cursor-pointer select-none">
                                    Keep in sync (auto-refresh every 30s)
                                </label>
                            </div>

                            <button
                                type="submit"
                                onClick={playClickSound}
                                disabled={loading || !url}
                                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm hover:shadow-indigo-500/25"
                            >
                                {loading ? 'Importing...' : (keepSync ? 'Sync Data' : 'Import Data')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
