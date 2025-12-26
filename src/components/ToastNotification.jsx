import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const ToastNotification = ({ message, type = 'info', isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 10000); // 10 seconds duration
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-sm"
                >
                    <div className={`rounded-xl shadow-2xl p-4 border flex items-start gap-3 backdrop-blur-md
                        ${type === 'success' ? 'bg-emerald-50/90 border-emerald-100 text-emerald-900' :
                            type === 'warning' ? 'bg-amber-50/90 border-amber-100 text-amber-900' :
                                'bg-indigo-50/90 border-indigo-100 text-indigo-900'}`}
                    >
                        {type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        )}

                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-1">
                                {type === 'success' ? 'Great Performance!' : 'Areas to Improve'}
                            </h4>
                            <p className="text-sm opacity-90 leading-relaxed font-medium">
                                {message}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className={`p-1 rounded-full bg-white/50 hover:bg-white/80 transition-colors 
                                ${type === 'success' ? 'text-emerald-700' : 'text-amber-700'}`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
