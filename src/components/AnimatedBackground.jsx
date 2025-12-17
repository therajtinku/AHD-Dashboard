import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const AnimatedBackground = () => {
    const { scrollY } = useScroll();

    // Parallax transforms for different layers
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
    const rotate1 = useTransform(scrollY, [0, 1000], [0, 45]);
    const rotate2 = useTransform(scrollY, [0, 1000], [0, -45]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Gradient Mesh Base - Increased opacity for visibility */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-200/40 via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent opacity-80" />

            {/* Floating Blob 1 - Top Left */}
            <motion.div
                style={{ y: y1, rotate: rotate1 }}
                className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-brand-300/40 to-purple-400/40 rounded-full blur-3xl mix-blend-multiply filter"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5], // Increased opacity
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Floating Blob 2 - Top Center/Right */}
            <motion.div
                style={{ y: y2, x: 100 }}
                className="absolute top-40 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-pink-300/40 to-brand-400/40 rounded-full blur-3xl mix-blend-multiply filter"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4], // Increased opacity
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            {/* Floating Blob 3 - Bottom Left */}
            <motion.div
                style={{ y: y1 }}
                className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-gradient-to-tr from-blue-300/40 to-cyan-300/40 rounded-full blur-3xl mix-blend-multiply filter"
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.5, 0.7, 0.5], // Increased opacity
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

            {/* Floating Blob 4 - Bottom Right */}
            <motion.div
                style={{ y: y2, rotate: rotate2 }}
                className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-tl from-indigo-300/40 to-purple-300/40 rounded-full blur-3xl mix-blend-multiply filter"
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, -30, 0],
                }}
                transition={{
                    duration: 11,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
            />
        </div>
    );
};
