import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import type { Page } from '../types/types';

interface LayoutProps {
    children: ReactNode;
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
            <main className="ml-64 min-h-screen">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
