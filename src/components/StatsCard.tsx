import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

interface StatsCardProps {
    title: string;
    value: number;
    icon: ComponentType<LucideProps>;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple';
}

const colorClasses = {
    emerald: {
        bg: 'bg-emerald-50',
        icon: 'bg-emerald-100 text-emerald-600',
        trend: 'text-emerald-600',
    },
    blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-100 text-blue-600',
        trend: 'text-blue-600',
    },
    amber: {
        bg: 'bg-amber-50',
        icon: 'bg-amber-100 text-amber-600',
        trend: 'text-amber-600',
    },
    rose: {
        bg: 'bg-rose-50',
        icon: 'bg-rose-100 text-rose-600',
        trend: 'text-rose-600',
    },
    purple: {
        bg: 'bg-purple-50',
        icon: 'bg-purple-100 text-purple-600',
        trend: 'text-purple-600',
    },
};

export function StatsCard({ title, value, icon: Icon, trend, trendValue, color }: StatsCardProps) {
    const classes = colorClasses[color];

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${classes.icon}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && trendValue && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-400'
                        }`}>
                        <TrendIcon className="w-4 h-4" />
                        {trendValue}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-3xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500 mt-1">{title}</p>
            </div>
        </div>
    );
}
