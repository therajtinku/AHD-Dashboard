import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const AnimatedBackground = () => {
    const { scrollY } = useScroll();

    // Parallax transforms - reduced distance for smoother 60fps
    const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

    // Removed rotation from scrolling to reduce paint costs
    // const rotate1 = useTransform(scrollY, [0, 1000], [0, 45]);
    // const rotate2 = useTransform(scrollY, [0, 1000], [0, -45]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Gradient Mesh Base */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-200/40 via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent opacity-80" />

            {/* Note: Removed 'mix-blend-multiply' and 'filter blur' which are very expensive.
                Using simple opacity and gradients is much lighter. */}

            {/* Floating Blob 1 - Top Left */}
            <motion.div
                style={{ y: y1 }} // Only animating transform
                className="absolute -top-20 -left-20 w-96 h-96 bg-brand-300/30 rounded-full blur-[100px] will-change-transform"
                animate={{
                    scale: [1, 1.05, 1], // Reduced scale range
                    opacity: [0.4, 0.6, 0.4],
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
                className="absolute top-40 right-0 w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[120px] will-change-transform"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
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
                className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-blue-300/30 rounded-full blur-[100px] will-change-transform"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
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
                style={{ y: y2 }}
                className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-300/30 rounded-full blur-[80px] will-change-transform"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
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
