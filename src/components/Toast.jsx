import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000); // 10 seconds auto-dismiss as requested

        return () => clearTimeout(timer);
    }, [onClose]);

    const variants = {
        hidden: { y: 50, opacity: 0, scale: 0.9 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: {
            y: 20,
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2 }
        }
    };

    const isSuccess = type === 'success';

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-md px-4">
            <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md ${isSuccess
                        ? 'bg-emerald-50/90 border-emerald-100 text-emerald-900'
                        : 'bg-amber-50/90 border-amber-100 text-amber-900'
                    }`}
            >
                <div className={`mt-0.5 p-1 rounded-full ${isSuccess ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                    {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
                </div>

                <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">{isSuccess ? 'Great Performance' : 'Attention Needed'}</h4>
                    <p className="text-sm opacity-90 leading-relaxed font-medium">
                        {message}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className={`p-1 rounded-full hover:bg-black/5 transition-colors ${isSuccess ? 'text-emerald-500' : 'text-amber-500'}`}
                >
                    <X className="w-4 h-4" />
                </button>
            </motion.div>
        </div>
    );
};
