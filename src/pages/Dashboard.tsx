import { useMemo } from 'react';
import { Send, Users, Trophy, XCircle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatsCard } from '../components/StatsCard';
import { useJobs } from '../context/JobContext';

export function Dashboard() {
    const { jobs } = useJobs();

    const stats = useMemo(() => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const recentJobs = jobs.filter((job) => new Date(job.dateApplied) >= thirtyDaysAgo);
        const previousJobs = jobs.filter((job) => {
            const date = new Date(job.dateApplied);
            const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
            return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        });

        const getTrend = (current: number, previous: number): 'up' | 'down' | 'neutral' => {
            if (current > previous) return 'up';
            if (current < previous) return 'down';
            return 'neutral';
        };

        const applied = jobs.filter((j) => j.origin === 'application').length;
        const interviews = jobs.filter((j) => j.status === 'Interview').length;
        const offers = jobs.filter((j) => j.status === 'Offer' || j.origin === 'offer').length;
        const rejected = jobs.filter((j) => j.status === 'Rejected').length;
        const accepted = jobs.filter((j) => j.status === 'Accepted').length;

        const prevApplied = previousJobs.filter((j) => j.origin === 'application').length;
        const prevInterviews = previousJobs.filter((j) => j.status === 'Interview').length;
        const prevOffers = previousJobs.filter((j) => j.status === 'Offer' || j.origin === 'offer').length;

        return {
            applied: { value: applied, trend: getTrend(recentJobs.length, prevApplied) },
            interviews: { value: interviews, trend: getTrend(interviews, prevInterviews) },
            offers: { value: offers, trend: getTrend(offers, prevOffers) },
            rejected: { value: rejected },
            accepted: { value: accepted },
        };
    }, [jobs]);

    const chartData = useMemo(() => {
        const data: { date: string; applications: number }[] = [];
        const now = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const count = jobs.filter((job) => job.dateApplied === dateStr).length;

            data.push({
                date: displayDate,
                applications: count,
            });
        }

        return data;
    }, [jobs]);

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Track your job search progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatsCard
                    title="Total Applied"
                    value={stats.applied.value}
                    icon={Send}
                    trend={stats.applied.trend}
                    trendValue="30d"
                    color="emerald"
                />
                <StatsCard
                    title="Interviews"
                    value={stats.interviews.value}
                    icon={Users}
                    trend={stats.interviews.trend}
                    trendValue="30d"
                    color="blue"
                />
                <StatsCard
                    title="Offers"
                    value={stats.offers.value}
                    icon={Trophy}
                    trend={stats.offers.trend}
                    trendValue="30d"
                    color="amber"
                />
                <StatsCard
                    title="Rejected"
                    value={stats.rejected.value}
                    icon={XCircle}
                    color="rose"
                />
                <StatsCard
                    title="Accepted"
                    value={stats.accepted.value}
                    icon={CheckCircle}
                    color="purple"
                />
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Application Activity</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '12px 16px',
                                }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                itemStyle={{ color: '#10b981' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="applications"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorApplications)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Tips */}
            {jobs.length === 0 && (
                <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Welcome to JobFlow! 🎉</h3>
                    <p className="text-slate-600 mb-4">
                        Start tracking your job applications by clicking on "Jobs" in the sidebar and adding your first application.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Track applications and offers in one place
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Generate AI-powered cover letters
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Get interview preparation guides
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
