import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Job, AppSettings, JobContextType } from '../types/types';

const STORAGE_KEYS = {
    JOBS: 'jobflow_jobs',
    SETTINGS: 'jobflow_settings',
};

const defaultSettings: AppSettings = {
    resume: {
        fullName: '',
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: '',
        avatar: '',
    },
    geminiApiKey: '',
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export function useJobs(): JobContextType {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useJobs must be used within a JobProvider');
    }
    return context;
}

interface JobProviderProps {
    children: ReactNode;
}

export function JobProvider({ children }: JobProviderProps) {
    const [jobs, setJobs] = useState<Job[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    // Persist jobs to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    }, [jobs]);

    // Persist settings to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }, [settings]);

    const addJob = (job: Omit<Job, 'id'>) => {
        const newJob: Job = {
            ...job,
            id: crypto.randomUUID(),
        };
        setJobs((prev) => [newJob, ...prev]);
    };

    const updateJob = (id: string, updates: Partial<Job>) => {
        setJobs((prev) =>
            prev.map((job) => (job.id === id ? { ...job, ...updates } : job))
        );
    };

    const deleteJob = (id: string) => {
        setJobs((prev) => prev.filter((job) => job.id !== id));
    };

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        setSettings((prev) => ({
            ...prev,
            ...newSettings,
            resume: {
                ...prev.resume,
                ...(newSettings.resume || {}),
            },
        }));
    };

    const value: JobContextType = {
        jobs,
        settings,
        addJob,
        updateJob,
        deleteJob,
        updateSettings,
    };

    return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}
