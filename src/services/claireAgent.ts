import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Job, Resume } from '../types/types';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export async function chatWithClaire(
    message: string,
    history: Message[],
    jobs: Job[],
    resume: Resume,
    apiKey: string
): Promise<string> {
    if (!apiKey) throw new Error('API Key required');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    // Job Stats Calculation
    const totalApplied = jobs.length;
    const interviews = jobs.filter(j => j.status === 'Interview').length;
    const offers = jobs.filter(j => j.status === 'Offer').length;
    const conversionRate = totalApplied > 0 ? ((interviews + offers) / totalApplied * 100).toFixed(1) : '0';

    // Context: Recent Activity
    const recentJobs = jobs.slice(0, 5).map(j => `- ${j.role} at ${j.company} (${j.status})`).join('\n');
    const upcomingInterviews = jobs.filter(j => j.status === 'Interview').map(j => `- ${j.role} at ${j.company}`).join('\n');

    // Context: Resume Highlights
    const currentRole = resume.experience[0] ? `${resume.experience[0].title} (${resume.experience[0].date})` : 'Not listed';
    const education = resume.education[0] ? `${resume.education[0].title} (${resume.education[0].date})` : 'Not listed';

    const systemInstruction = `
    You are Claire, a friendly, empathetic, and highly intelligent AI Career Coach.
    Your goal is to help the user navigate their job search, provide emotional support, and give strategic advice.
    
    User Identity:
    - Name: ${resume.fullName || 'User'}
    - Current Role: ${currentRole}
    - Education: ${education}
    - Top Skills: ${resume.skills || 'Not provided'}
    - Summary: ${resume.summary || 'Not provided'}
    
    Job Search Stats:
    - Total Applications: ${totalApplied}
    - Interviews: ${interviews}
    - Offers: ${offers}
    - Conversion Rate: ${conversionRate}%

    Recent Activity (Last 5):
    ${recentJobs || 'No recent applications'}

    Upcoming Interviews:
    ${upcomingInterviews || 'None scheduled'}
    
    Strategic Logic:
    1. If Conversion Rate < 10% and Total Applications > 10: Suggest resume improvements based on their current role.
    2. If user has an upcoming interview: Offer to roleplay for that specific role.
    3. If user got a rejection: Be empathetic and remind them of their skills.
    4. If user got an offer: Celebrate!
    
    Respond as Claire. Keep it concise, natural, and encouraging.
  `;

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemInstruction }],
            },
            ...history.map(m => ({
                role: m.role,
                parts: [{ text: m.content }],
            }))
        ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
}
