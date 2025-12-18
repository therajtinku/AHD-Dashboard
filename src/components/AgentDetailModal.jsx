import React, { useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TrendChart } from './TrendChart';
import { generateMockHistory } from '../utils/mockHistory';
import { THRESHOLDS } from '../utils/constants';
import html2canvas from 'html2canvas';

// Simple Error Boundary to catch render crashes in the modal
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("AgentDetailModal Crash:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-12 text-center text-slate-500">
                    <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-700">Something went wrong</h3>
                    <p className="text-xs">Could not display agent details.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

// Internal content component to separate hooks from the AnimatePresence parent
const AgentDetailContent = ({ agent, onClose }) => {
    const reportRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imgBase64, setImgBase64] = useState(null);

    // Fetch image as blobs/base64 to bypass CORS in html2canvas
    React.useEffect(() => {
        if (agent?.imageUrl) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = agent.imageUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                setImgBase64(canvas.toDataURL('image/png'));
            };
            img.onerror = () => { setImgBase64(null); };
        } else {
            setImgBase64(null);
        }
    }, [agent?.imageUrl]);

    // Safe generation of history data
    const historyData = useMemo(() => {
        try {
            return agent ? generateMockHistory(agent) : [];
        } catch (e) {
            console.error("Failed to generate history", e);
            return [];
        }
    }, [agent]);

    const handleDownload = async () => {
        if (!reportRef.current) return;

        setIsGenerating(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true,
                onclone: (clonedDoc) => {
                    const content = clonedDoc.getElementById('printable-report-content');
                    if (content) {
                        content.style.overflow = 'visible';
                        content.style.height = 'auto';
                        content.style.maxHeight = 'none';
                    }
                }
            });

            const link = document.createElement('a');
            link.download = `${agent.agentName.replace(/\s+/g, '_')}_Performance_Report.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error("Failed to generate report card", err);
            alert("Could not generate the report image. Check console for details.");
        } finally {
            setIsGenerating(false);
        }
    };

    const getInsight = (value, threshold, isHigherBetter = false, label) => {
        const isGood = isHigherBetter ? value >= threshold : value <= threshold;
        return { label, value, target: threshold, isGood, isHigherBetter };
    };

    const insights = [
        getInsight(agent.slPercentage, THRESHOLDS.sl, true, 'Service Level'),
        getInsight(agent.frtSeconds, THRESHOLDS.frt, false, 'First Response'),
        getInsight(agent.artSeconds, THRESHOLDS.art, false, 'Avg Response'),
        getInsight(agent.ahtMinutes, THRESHOLDS.aht, false, 'Handle Time')
    ];

    const strengths = insights.filter(i => i.isGood);
    const weaknesses = insights.filter(i => !i.isGood);

    return (
        <div className="flex flex-col h-full bg-white max-h-[90vh]">
            <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100 shrink-0">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Agent Detail</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-brand-100 transition-colors disabled:opacity-50"
                    >
                        {!isGenerating ? <Download className="w-4 h-4" /> : <div className="animate-spin w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full" />}
                        {isGenerating ? 'Generating...' : 'Download Report'}
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div id="printable-report-content" ref={reportRef} className="p-4 md:p-8 bg-white overflow-y-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-6 md:mb-8 text-center md:text-left">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#f1f5f9] border-4 border-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden shrink-0 mx-auto md:mx-0">
                        {agent.imageUrl ? (
                            <img
                                src={imgBase64 || agent.imageUrl}
                                alt={agent.agentName}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#c4b5fd]">
                                {agent.agentName?.charAt(0) || '?'}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">{agent.agentName}</h1>
                        <p className="text-[#64748b] font-medium text-sm md:text-base">{agent.role} • {agent.agentId}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                            <span className="px-3 py-1 bg-[#f1f5f9] rounded-lg text-xs font-bold text-[#475569] uppercase tracking-wider">
                                {agent.numberOfChats} Total Chats
                            </span>
                            {strengths.length === 4 && (
                                <span className="px-3 py-1 bg-[#fef3c7] text-[#b45309] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> Top Performer
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="p-4 md:p-5 rounded-2xl bg-[#ecfdf5] border border-[#d1fae5]">
                        <h3 className="flex items-center gap-2 font-bold text-[#065f46] mb-3">
                            <CheckCircle2 className="w-5 h-5" /> Strengths
                        </h3>
                        {strengths.length > 0 ? (
                            <ul className="space-y-2">
                                {strengths.map((s, i) => (
                                    <li key={i} className="text-sm text-[#047857] flex justify-between">
                                        <span>{s.label}</span>
                                        <span className="font-bold">{s.value}{['Service Level'].includes(s.label) ? '%' : ''}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-[#059669] italic">No specific strengths identified this week.</p>
                        )}
                    </div>

                    <div className="p-4 md:p-5 rounded-2xl bg-[#fff1f2] border border-[#ffe4e6]">
                        <h3 className="flex items-center gap-2 font-bold text-[#9f1239] mb-3">
                            <AlertCircle className="w-5 h-5" /> Focus Areas
                        </h3>
                        {weaknesses.length > 0 ? (
                            <ul className="space-y-2">
                                {weaknesses.map((w, i) => (
                                    <li key={i} className="text-sm text-[#be123c] flex justify-between">
                                        <span>{w.label}</span>
                                        <span className="font-bold">Target: {w.isHigherBetter ? '>=' : '<='}{w.target}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-[#e11d48] italic">Great job! All metrics on target.</p>
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-bold text-[#1e293b] mb-4 px-1">Performance Trends (Last 4 Weeks)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { title: 'Service Level %', key: 'sl', color: '#10b981', suffix: '%', target: THRESHOLDS.sl },
                        { title: 'Avg Response Time', key: 'art', color: '#6366f1', suffix: 's', target: THRESHOLDS.art },
                        { title: 'Handle Time', key: 'aht', color: '#f59e0b', suffix: 'm', target: THRESHOLDS.aht },
                        { title: 'Chat Volume', key: 'chats', color: '#8b5cf6', suffix: '', target: null }
                    ].map((metric) => (
                        <div key={metric.key} className="p-4 rounded-2xl bg-white border border-[#f1f5f9] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] min-w-0">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">{metric.title}</span>
                                <span className="font-mono font-bold text-[#334155]">
                                    {historyData[3]?.[metric.key]}{metric.suffix}
                                </span>
                            </div>
                            <TrendChart
                                data={historyData}
                                dataKey={metric.key}
                                color={metric.color}
                                suffix={metric.suffix}
                                target={metric.target}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-[#cbd5e1] uppercase tracking-widest font-medium">Performance Report</p>
                </div>
            </div>
        </div>
    );
};

export const AgentDetailModal = ({ agent, onClose }) => {
    return (
        <AnimatePresence>
            {agent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <ErrorBoundary>
                            <AgentDetailContent agent={agent} onClose={onClose} />
                        </ErrorBoundary>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
