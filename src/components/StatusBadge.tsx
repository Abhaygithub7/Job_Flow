import type { JobStatus } from '../types/types';

const statusColors: Record<JobStatus, { bg: string; text: string; dot: string }> = {
    Applied: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    Interview: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    Offer: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Rejected: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
    Accepted: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
};

interface StatusBadgeProps {
    status: JobStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const colors = statusColors[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {status}
        </span>
    );
}
