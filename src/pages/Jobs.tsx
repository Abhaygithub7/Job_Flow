import { useState, useMemo } from 'react';
import { Plus, Briefcase, Gift, Search, Loader2 } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import type { Job, JobStatus } from '../types/types';
import { generateCoverLetter, generateInterviewGuide } from '../services/gemini';

type TabType = 'applications' | 'offers';
type StatusFilter = 'all' | JobStatus;

export function Jobs() {
    const { jobs, updateJob, deleteJob, settings } = useJobs();
    const [activeTab, setActiveTab] = useState<TabType>('applications');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [generatingJobId, setGeneratingJobId] = useState<string | null>(null);
    const [generationType, setGenerationType] = useState<'cover' | 'interview' | null>(null);

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            // Filter by origin (tab)
            if (activeTab === 'applications' && job.origin !== 'application') return false;
            if (activeTab === 'offers' && job.origin !== 'offer') return false;

            // Filter by status
            if (statusFilter !== 'all' && job.status !== statusFilter) return false;

            // Filter by search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    job.company.toLowerCase().includes(query) ||
                    job.role.toLowerCase().includes(query) ||
                    job.location.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [jobs, activeTab, statusFilter, searchQuery]);

    const handleAddJob = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const handleEditJob = (job: Job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleDeleteJob = (id: string) => {
        if (confirm('Are you sure you want to delete this job?')) {
            deleteJob(id);
        }
    };

    const handleGenerateCoverLetter = async (job: Job) => {
        if (!settings.geminiApiKey) {
            alert('Please add your Gemini API key in Settings first');
            return;
        }

        if (!settings.resume.skills) {
            alert('Please add your skills in Settings first');
            return;
        }

        setGeneratingJobId(job.id);
        setGenerationType('cover');

        try {
            const coverLetter = await generateCoverLetter(
                job.role,
                job.company,
                settings.resume.skills,
                settings.geminiApiKey
            );
            updateJob(job.id, { coverLetter });
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to generate cover letter');
        } finally {
            setGeneratingJobId(null);
            setGenerationType(null);
        }
    };

    const handleGenerateInterviewGuide = async (job: Job) => {
        if (!settings.geminiApiKey) {
            alert('Please add your Gemini API key in Settings first');
            return;
        }

        if (!settings.resume.skills) {
            alert('Please add your skills in Settings first');
            return;
        }

        setGeneratingJobId(job.id);
        setGenerationType('interview');

        try {
            const interviewGuide = await generateInterviewGuide(
                job.role,
                job.company,
                settings.resume.skills,
                settings.geminiApiKey
            );
            updateJob(job.id, { interviewGuide });
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to generate interview guide');
        } finally {
            setGeneratingJobId(null);
            setGenerationType(null);
        }
    };

    const statusOptions: StatusFilter[] = ['all', 'Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
                    <p className="text-slate-500 mt-1">Manage your applications and offers</p>
                </div>
                <button
                    onClick={handleAddJob}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add {activeTab === 'offers' ? 'Offer' : 'Application'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => {
                        setActiveTab('applications');
                        setStatusFilter('all');
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'applications'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-slate-500 hover:bg-slate-100'
                        }`}
                >
                    <Briefcase className="w-4 h-4" />
                    My Applications
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'applications' ? 'bg-emerald-200' : 'bg-slate-200'
                        }`}>
                        {jobs.filter((j) => j.origin === 'application').length}
                    </span>
                </button>
                <button
                    onClick={() => {
                        setActiveTab('offers');
                        setStatusFilter('all');
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'offers'
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-slate-500 hover:bg-slate-100'
                        }`}
                >
                    <Gift className="w-4 h-4" />
                    Offers Received
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'offers' ? 'bg-amber-200' : 'bg-slate-200'
                        }`}>
                        {jobs.filter((j) => j.origin === 'offer').length}
                    </span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by company, role, or location..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-white text-sm"
                >
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status === 'all' ? 'All Statuses' : status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading Overlay */}
            {generatingJobId && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-4">
                        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                        <p className="text-slate-700 font-medium">
                            Generating {generationType === 'cover' ? 'cover letter' : 'interview guide'}...
                        </p>
                    </div>
                </div>
            )}

            {/* Job List */}
            {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        {activeTab === 'applications' ? (
                            <Briefcase className="w-8 h-8 text-slate-400" />
                        ) : (
                            <Gift className="w-8 h-8 text-slate-400" />
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {searchQuery || statusFilter !== 'all'
                            ? 'No matching jobs found'
                            : activeTab === 'applications'
                                ? 'No applications yet'
                                : 'No offers yet'}
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {searchQuery || statusFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : activeTab === 'applications'
                                ? 'Start tracking your job applications by adding your first one'
                                : 'Track any job offers you receive here'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                        <button
                            onClick={handleAddJob}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Add {activeTab === 'offers' ? 'Offer' : 'Application'}
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onEdit={handleEditJob}
                            onDelete={handleDeleteJob}
                            onGenerateCoverLetter={handleGenerateCoverLetter}
                            onGenerateInterviewGuide={handleGenerateInterviewGuide}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            <JobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                job={editingJob}
                defaultOrigin={activeTab === 'offers' ? 'offer' : 'application'}
            />
        </div>
    );
}
