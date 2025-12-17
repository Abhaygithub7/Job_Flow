import { Edit2, Trash2, MapPin, DollarSign, Calendar, Sparkles, BookOpen } from 'lucide-react';
import type { Job } from '../types/types';
import { StatusBadge } from './StatusBadge';

interface JobCardProps {
    job: Job;
    onEdit: (job: Job) => void;
    onDelete: (id: string) => void;
    onGenerateCoverLetter: (job: Job) => void;
    onGenerateInterviewGuide: (job: Job) => void;
}

export function JobCard({ job, onEdit, onDelete, onGenerateCoverLetter, onGenerateInterviewGuide }: JobCardProps) {
    const showInterviewGuide = job.origin === 'offer' || job.status === 'Offer' || job.status === 'Interview';

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 truncate">{job.role}</h3>
                        <StatusBadge status={job.status} />
                    </div>
                    <p className="text-emerald-600 font-medium mb-3">{job.company}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        {job.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                            </span>
                        )}
                        {job.salary && (
                            <span className="flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4" />
                                {job.salary}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(job.dateApplied).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </div>

                    {job.description && (
                        <p className="mt-3 text-sm text-slate-600 line-clamp-2">{job.description}</p>
                    )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(job)}
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(job.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* AI Actions */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                    onClick={() => onGenerateCoverLetter(job)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    {job.coverLetter ? 'Regenerate Cover Letter' : 'Generate Cover Letter'}
                </button>

                {showInterviewGuide && (
                    <button
                        onClick={() => onGenerateInterviewGuide(job)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        {job.interviewGuide ? 'Regenerate Interview Guide' : 'Generate Interview Guide'}
                    </button>
                )}
            </div>

            {/* Show Cover Letter if exists */}
            {job.coverLetter && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-2">Cover Letter</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-4">{job.coverLetter}</p>
                </div>
            )}

            {/* Show Interview Guide if exists */}
            {job.interviewGuide && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-xs font-medium text-blue-500 mb-2">Interview Guide</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-4">{job.interviewGuide}</p>
                </div>
            )}
        </div>
    );
}
