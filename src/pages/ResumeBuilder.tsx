import { useState, useRef } from 'react';
import { User, GraduationCap, Briefcase, Code, Sparkles, Download, Eye, Loader2 } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { useJobs } from '../context/JobContext';
import { analyzeResume, generateHeadshot } from '../services/resumeGenerators';
// @ts-ignore
import html2pdf from 'html2pdf.js';


type Tab = 'personal' | 'experience' | 'education' | 'projects';

export function ResumeBuilder() {
    const { resume, updateResume, addExperience, updateExperience, removeExperience, addEducation, updateEducation, removeEducation, addProject, updateProject, removeProject } = useResume();
    const { settings } = useJobs();
    const [activeTab, setActiveTab] = useState<Tab>('personal');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingHeadshot, setIsGeneratingHeadshot] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const resumeRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = () => {
        const element = resumeRef.current;
        if (!element) return;

        const opt = {
            margin: 0,
            filename: `${resume.fullName || 'resume'}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        html2pdf().set(opt).from(element).save();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!settings.geminiApiKey) {
            alert('Please add your Gemini API key in Settings first');
            return;
        }

        setIsAnalyzing(true);
        try {
            const analyzedData = await analyzeResume(file, settings.geminiApiKey);
            updateResume(analyzedData);
        } catch (err) {
            console.error(err);
            alert('Failed to analyze resume');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!settings.geminiApiKey) {
            alert('Please add your Gemini API key in Settings first');
            return;
        }

        setIsGeneratingHeadshot(true);
        try {
            const headshotUrl = await generateHeadshot(file, settings.geminiApiKey);
            updateResume({ avatar: headshotUrl });
        } catch (err) {
            console.error(err);
            alert('Failed to generate headshot');
        } finally {
            setIsGeneratingHeadshot(false);
        }
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'personal':
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>

                        <div className="flex gap-6 items-start">
                            <div className="w-32">
                                <div
                                    className="w-32 h-32 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                                    onClick={() => avatarInputRef.current?.click()}
                                >
                                    {resume.avatar ? (
                                        <img src={resume.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-2">
                                            {isGeneratingHeadshot ? (
                                                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                                            ) : (
                                                <>
                                                    <User className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                                                    <span className="text-xs text-slate-500">Upload Selfie</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">Change</span>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={avatarInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                />
                                {resume.avatar && (
                                    <button
                                        onClick={() => updateResume({ avatar: '' })}
                                        className="mt-2 text-xs text-rose-500 hover:text-rose-600 w-full text-center"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={resume.fullName}
                                        onChange={(e) => updateResume({ fullName: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input
                                            type="text"
                                            value={resume.email || ''}
                                            onChange={(e) => updateResume({ email: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                        <input
                                            type="text"
                                            value={resume.phone || ''}
                                            onChange={(e) => updateResume({ phone: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={resume.location || ''}
                                        onChange={(e) => updateResume({ location: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                        placeholder="San Francisco, CA"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Professional Headline</label>
                                    <input
                                        type="text"
                                        value={resume.skills}
                                        onChange={(e) => updateResume({ skills: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                        placeholder="Senior Frontend Engineer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Professional Summary</label>
                            <textarea
                                value={resume.summary}
                                onChange={(e) => updateResume({ summary: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                                placeholder="Brief overlap of your career highlights..."
                            />
                        </div>
                    </div>
                );

            case 'experience':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-800">Experience</h3>
                            <button
                                onClick={() => addExperience({ title: '', content: '', date: '' })}
                                className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1"
                            >
                                <code className="text-lg">+</code> Add Position
                            </button>
                        </div>

                        {resume.experience.map((exp) => (
                            <div key={exp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 relative group">
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <code className="text-lg">×</code>
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Role & Company</label>
                                        <input
                                            type="text"
                                            value={exp.title}
                                            onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                            placeholder="Senior Developer at Tech Co"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Date Range</label>
                                        <input
                                            type="text"
                                            value={exp.date}
                                            onChange={(e) => updateExperience(exp.id, { date: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                            placeholder="Jan 2020 - Present"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Description</label>
                                    <textarea
                                        value={exp.content}
                                        onChange={(e) => updateExperience(exp.id, { content: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"
                                        placeholder="Key responsibilities and achievements..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'education':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-800">Education</h3>
                            <button
                                onClick={() => addEducation({ title: '', content: '', date: '' })}
                                className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1"
                            >
                                <code className="text-lg">+</code> Add Education
                            </button>
                        </div>

                        {resume.education.map((edu) => (
                            <div key={edu.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 relative group">
                                <button
                                    onClick={() => removeEducation(edu.id)}
                                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <code className="text-lg">×</code>
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Degree & School</label>
                                        <input
                                            type="text"
                                            value={edu.title}
                                            onChange={(e) => updateEducation(edu.id, { title: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                            placeholder="BS Computer Science, University"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500">Date</label>
                                        <input
                                            type="text"
                                            value={edu.date}
                                            onChange={(e) => updateEducation(edu.id, { date: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                            placeholder="2016 - 2020"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'projects':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-800">Projects</h3>
                            <button
                                onClick={() => addProject({ name: '', description: '', tech: [] })}
                                className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1"
                            >
                                <code className="text-lg">+</code> Add Project
                            </button>
                        </div>
                        {resume.projects.map((proj) => (
                            <div key={proj.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 relative group">
                                <button
                                    onClick={() => removeProject(proj.id)}
                                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <code className="text-lg">×</code>
                                </button>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Project Name</label>
                                    <input
                                        type="text"
                                        value={proj.name}
                                        onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                        placeholder="JobFlow"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Description</label>
                                    <textarea
                                        value={proj.description}
                                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none"
                                        placeholder="A job tracking application..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500">Technologies (comma separated)</label>
                                    <input
                                        type="text"
                                        value={proj.tech.join(', ')}
                                        onChange={(e) => updateProject(proj.id, { tech: e.target.value.split(',').map(t => t.trim()) })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                        placeholder="React, Tailwind, TypeScript"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-6 overflow-hidden">
            {/* Left Panel: Editor */}
            <div className="w-1/2 flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-500" />}
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleFileUpload}
                        />
                    </div>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
                    >
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'personal' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <User className="w-4 h-4 mx-auto mb-1" />
                        Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('experience')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'experience' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Briefcase className="w-4 h-4 mx-auto mb-1" />
                        Experience
                    </button>
                    <button
                        onClick={() => setActiveTab('education')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'education' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <GraduationCap className="w-4 h-4 mx-auto mb-1" />
                        Education
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'projects' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Code className="w-4 h-4 mx-auto mb-1" />
                        Projects
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderForm()}
                </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="w-1/2 h-full bg-slate-500/10 rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Live Preview
                    </span>
                    <span className="text-xs text-slate-400">A4 Format</span>
                </div>
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100">
                    {/* A4 Paper */}
                    <div ref={resumeRef} className="w-[210mm] min-h-[297mm] bg-white shadow-lg p-[20mm] text-slate-800 text-sm">
                        {/* Header */}
                        <div className="flex items-start gap-6 border-b border-slate-200 pb-6 mb-6">
                            {resume.avatar && (
                                <img src={resume.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-slate-100" />
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{resume.fullName || 'Your Name'}</h1>
                                <p className="text-emerald-600 font-medium mt-1">{resume.skills || 'Professional Title'}</p>
                                <p className="text-slate-500 text-xs mt-2">
                                    {resume.email || 'email@example.com'} • {resume.phone || '(555) 123-4567'} • {resume.location || 'Location'}
                                </p>
                            </div>
                        </div>

                        {/* Summary */}
                        {resume.summary && (
                            <div className="mb-6">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">Profile</h2>
                                <p className="text-slate-600 leading-relaxed text-xs">{resume.summary}</p>
                            </div>
                        )}

                        {/* Experience */}
                        {resume.experience.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">Experience</h2>
                                <div className="space-y-4">
                                    {resume.experience.map(exp => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-slate-800">{exp.title}</h3>
                                                <span className="text-xs text-slate-500">{exp.date}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 whitespace-pre-wrap">{exp.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {resume.projects.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">Projects</h2>
                                <div className="space-y-3">
                                    {resume.projects.map(proj => (
                                        <div key={proj.id}>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <h3 className="font-bold text-slate-800">{proj.name}</h3>
                                                <span className="text-xs text-emerald-600 font-medium">
                                                    {proj.tech.join(' • ')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {resume.education.length > 0 && (
                            <div>
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">Education</h2>
                                <div className="space-y-3">
                                    {resume.education.map(edu => (
                                        <div key={edu.id} className="flex justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-800">{edu.title}</h3>
                                                <p className="text-xs text-slate-600">{edu.content}</p>
                                            </div>
                                            <span className="text-xs text-slate-500">{edu.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
