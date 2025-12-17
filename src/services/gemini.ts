import { GoogleGenAI } from '@google/genai';

let genAI: GoogleGenAI | null = null;

const getGenAI = (apiKey: string): GoogleGenAI => {
    if (!genAI || apiKey) {
        genAI = new GoogleGenAI({ apiKey });
    }
    return genAI;
};

export async function generateCoverLetter(
    role: string,
    company: string,
    skills: string,
    apiKey: string
): Promise<string> {
    if (!apiKey) {
        throw new Error('Gemini API key is required. Please add it in Settings.');
    }

    const ai = getGenAI(apiKey);

    const prompt = `Write a passionate and professional cover letter for the position of ${role} at ${company}. 
  
The candidate has the following skills and experience:
${skills}

Guidelines:
- Keep it concise (3-4 paragraphs)
- Show genuine enthusiasm for the role and company
- Highlight relevant skills naturally
- Use a professional but warm tone
- End with a strong call to action

Write only the cover letter body, no subject line or addresses.`;

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
    });

    return response.text || 'Failed to generate cover letter. Please try again.';
}

export async function generateInterviewGuide(
    role: string,
    company: string,
    skills: string,
    apiKey: string
): Promise<string> {
    if (!apiKey) {
        throw new Error('Gemini API key is required. Please add it in Settings.');
    }

    const ai = getGenAI(apiKey);

    const prompt = `Create a comprehensive interview preparation guide for the position of ${role} at ${company}.

Candidate's skills and background:
${skills}

Please include:
1. **Company Research Tips** - Key areas to research about ${company}
2. **Common Interview Questions** - 5-7 likely questions for this role
3. **STAR Method Examples** - How to structure answers using the candidate's skills
4. **Technical Topics** - Key technical areas to review based on the role
5. **Questions to Ask** - 3-5 insightful questions to ask the interviewer
6. **Day-of Tips** - Practical advice for interview day

Format with clear headings and bullet points. Keep it actionable and specific to this role.`;

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
    });

    return response.text || 'Failed to generate interview guide. Please try again.';
}
