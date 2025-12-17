export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted';

export type JobOrigin = 'application' | 'offer';

export type Page = 'dashboard' | 'jobs' | 'settings' | 'resume';

export interface Job {
    id: string;
    company: string;
    role: string;
    status: JobStatus;
    salary: string;
    location: string;
    dateApplied: string;
    description: string;
    coverLetter: string;
    interviewGuide: string;
    origin: JobOrigin;
}

export interface Section {
    id: string;
    title: string;
    content: string;
    date: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    tech: string[];
}

export interface Resume {
    fullName: string;
    summary: string;
    experience: Section[];
    education: Section[];
    projects: Project[];
    skills: string;
    avatar: string; // Base64 or URL
    // Legacy fields for backward compatibility if needed
    email?: string;
    phone?: string;
    location?: string;
}

export interface AppSettings {
    resume: Resume;
    geminiApiKey: string;
}

export interface JobContextType {
    jobs: Job[];
    settings: AppSettings;
    addJob: (job: Omit<Job, 'id'>) => void;
    updateJob: (id: string, job: Partial<Job>) => void;
    deleteJob: (id: string) => void;
    updateSettings: (settings: Partial<AppSettings>) => void;
}
