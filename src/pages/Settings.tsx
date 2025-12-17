import { useState } from 'react';
import { Save, Sparkles, Key, User } from 'lucide-react';
import { useJobs } from '../context/JobContext';

export function Settings() {
    const { settings, updateSettings } = useJobs();
    const [fullName, setFullName] = useState(settings.resume.fullName);
    const [skills, setSkills] = useState(settings.resume.skills);
    const [apiKey, setApiKey] = useState(settings.geminiApiKey);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        updateSettings({
            resume: {
                ...settings.resume,
                fullName,
                skills,
            },
            geminiApiKey: apiKey,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="animate-fade-in max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Configure your profile and AI features</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
                        <p className="text-sm text-slate-500">Your personal information for cover letters</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-2">
                            Skills & Experience
                        </label>
                        <textarea
                            id="skills"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="e.g., 5 years of React development, Node.js, TypeScript, team leadership experience, passion for building user-centric products..."
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                        />
                        <p className="text-xs text-slate-400 mt-2">
                            This information will be used by AI to generate personalized cover letters and interview guides
                        </p>
                    </div>
                </div>
            </div>

            {/* AI Configuration */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">AI Configuration</h2>
                        <p className="text-sm text-slate-500">Connect your Gemini API for AI features</p>
                    </div>
                </div>

                <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Gemini API Key
                        </div>
                    </label>
                    <input
                        type="password"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                        Get your API key from{' '}
                        <a
                            href="https://aistudio.google.com/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline"
                        >
                            Google AI Studio
                        </a>
                    </p>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 ${saved
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25'
                    }`}
            >
                <Save className="w-5 h-5" />
                {saved ? 'Saved!' : 'Save Settings'}
            </button>
        </div>
    );
}
