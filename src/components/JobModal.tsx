import { useState, useEffect } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import type { Job, JobStatus, JobOrigin } from '../types/types';
import { useJobs } from '../context/JobContext';
import { generateCoverLetter } from '../services/gemini';

interface JobModalProps {
    isOpen: boolean;
    onClose: () => void;
    job?: Job | null;
    defaultOrigin?: JobOrigin;
}

const statusOptions: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];

export function JobModal({ isOpen, onClose, job, defaultOrigin = 'application' }: JobModalProps) {
    const { addJob, updateJob, settings } = useJobs();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        company: '',
        role: '',
        status: 'Applied' as JobStatus,
        salary: '',
        location: '',
        dateApplied: new Date().toISOString().split('T')[0],
        description: '',
        coverLetter: '',
        interviewGuide: '',
        origin: defaultOrigin,
    });

    useEffect(() => {
        if (job) {
            setFormData({
                company: job.company,
                role: job.role,
                status: job.status,
                salary: job.salary,
                location: job.location,
                dateApplied: job.dateApplied,
                description: job.description,
                coverLetter: job.coverLetter,
                interviewGuide: job.interviewGuide || '',
                origin: job.origin,
            });
        } else {
            setFormData({
                company: '',
                role: '',
                status: defaultOrigin === 'offer' ? 'Offer' : 'Applied',
                salary: '',
                location: '',
                dateApplied: new Date().toISOString().split('T')[0],
                description: '',
                coverLetter: '',
                interviewGuide: '',
                origin: defaultOrigin,
            });
        }
        setError('');
    }, [job, defaultOrigin, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.company || !formData.role) {
            setError('Company and Role are required');
            return;
        }

        if (job) {
            updateJob(job.id, formData);
        } else {
            addJob(formData);
        }
        onClose();
    };

    const handleGenerateCoverLetter = async () => {
        if (!settings.geminiApiKey) {
            setError('Please add your Gemini API key in Settings first');
            return;
        }

        if (!settings.resume.skills) {
            setError('Please add your skills in Settings first');
            return;
        }

        if (!formData.company || !formData.role) {
            setError('Please enter Company and Role first');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            const coverLetter = await generateCoverLetter(
                formData.role,
                formData.company,
                settings.resume.skills,
                settings.geminiApiKey
            );
            setFormData((prev) => ({ ...prev, coverLetter }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate cover letter');
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {job ? 'Edit Job' : defaultOrigin === 'offer' ? 'Add Offer' : 'Add Application'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Company *
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                                placeholder="e.g., Google"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Role *
                            </label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                                placeholder="e.g., Senior Frontend Engineer"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as JobStatus }))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-white"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Salary
                            </label>
                            <input
                                type="text"
                                value={formData.salary}
                                onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                                placeholder="e.g., $150k-$200k"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                                placeholder="e.g., Remote, NYC"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Date {defaultOrigin === 'offer' ? 'Received' : 'Applied'}
                        </label>
                        <input
                            type="date"
                            value={formData.dateApplied}
                            onChange={(e) => setFormData((prev) => ({ ...prev, dateApplied: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Job Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Paste the job description here..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">
                                Cover Letter
                            </label>
                            <button
                                type="button"
                                onClick={handleGenerateCoverLetter}
                                disabled={isGenerating}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-3.5 h-3.5" />
                                )}
                                {isGenerating ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        <textarea
                            value={formData.coverLetter}
                            onChange={(e) => setFormData((prev) => ({ ...prev, coverLetter: e.target.value }))}
                            placeholder="Your cover letter will appear here..."
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all"
                        >
                            {job ? 'Update Job' : 'Add Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
