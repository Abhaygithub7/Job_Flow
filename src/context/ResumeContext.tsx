import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Resume, Section, Project } from '../types/types';

const STORAGE_KEY = 'jobflow_resume';

const defaultResume: Resume = {
    fullName: '',
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: '',
    avatar: '',
};

interface ResumeContextType {
    resume: Resume;
    updateResume: (updates: Partial<Resume>) => void;
    addExperience: (section: Omit<Section, 'id'>) => void;
    updateExperience: (id: string, updates: Partial<Section>) => void;
    removeExperience: (id: string) => void;
    addEducation: (section: Omit<Section, 'id'>) => void;
    updateEducation: (id: string, updates: Partial<Section>) => void;
    removeEducation: (id: string) => void;
    addProject: (project: Omit<Project, 'id'>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    removeProject: (id: string) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function useResume() {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
}

interface ResumeProviderProps {
    children: ReactNode;
}

export function ResumeProvider({ children }: ResumeProviderProps) {
    const [resume, setResume] = useState<Resume>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...defaultResume, ...JSON.parse(stored) } : defaultResume;
        } catch {
            return defaultResume;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    }, [resume]);

    const updateResume = (updates: Partial<Resume>) => {
        setResume((prev) => ({ ...prev, ...updates }));
    };

    // Experience Helpers
    const addExperience = (section: Omit<Section, 'id'>) => {
        const newSection = { ...section, id: crypto.randomUUID() };
        setResume((prev) => ({ ...prev, experience: [...prev.experience, newSection] }));
    };

    const updateExperience = (id: string, updates: Partial<Section>) => {
        setResume((prev) => ({
            ...prev,
            experience: prev.experience.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)),
        }));
    };

    const removeExperience = (id: string) => {
        setResume((prev) => ({
            ...prev,
            experience: prev.experience.filter((ex) => ex.id !== id),
        }));
    };

    // Education Helpers
    const addEducation = (section: Omit<Section, 'id'>) => {
        const newSection = { ...section, id: crypto.randomUUID() };
        setResume((prev) => ({ ...prev, education: [...prev.education, newSection] }));
    };

    const updateEducation = (id: string, updates: Partial<Section>) => {
        setResume((prev) => ({
            ...prev,
            education: prev.education.map((ed) => (ed.id === id ? { ...ed, ...updates } : ed)),
        }));
    };

    const removeEducation = (id: string) => {
        setResume((prev) => ({
            ...prev,
            education: prev.education.filter((ed) => ed.id !== id),
        }));
    };

    // Project Helpers
    const addProject = (project: Omit<Project, 'id'>) => {
        const newProject = { ...project, id: crypto.randomUUID() };
        setResume((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        setResume((prev) => ({
            ...prev,
            projects: prev.projects.map((pr) => (pr.id === id ? { ...pr, ...updates } : pr)),
        }));
    };

    const removeProject = (id: string) => {
        setResume((prev) => ({
            ...prev,
            projects: prev.projects.filter((pr) => pr.id !== id),
        }));
    };

    const value = {
        resume,
        updateResume,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addProject,
        updateProject,
        removeProject,
    };

    return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}
