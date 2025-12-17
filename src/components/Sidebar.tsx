import { LayoutDashboard, Briefcase, Settings, Sparkles, FileText } from 'lucide-react';

import type { Page } from '../types/types';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs' as const, label: 'Jobs', icon: Briefcase },
    { id: 'resume' as const, label: 'Resume Builder', icon: FileText },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">JobFlow</h1>
                        <p className="text-xs text-slate-400">Track your career</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {navItems.map(({ id, label, icon: Icon }) => {
                        const isActive = currentPage === id;
                        return (
                            <li key={id}>
                                <button
                                    onClick={() => onNavigate(id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                <div className="px-4 py-3 rounded-xl bg-slate-800/50">
                    <p className="text-xs text-slate-400">Powered by</p>
                    <p className="text-sm font-medium text-emerald-400">Gemini AI</p>
                </div>
            </div>
        </aside>
    );
}
