import React, { type ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-brand-50/50 font-sans pb-12">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 relative z-10">
                {children}
            </main>
            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} Raju Goud
            </footer>
        </div>
    );
};
