import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

const getModel = (apiKey: string) => {
    if (!genAI || !model) {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    }
    return model;
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

    const aiModel = getModel(apiKey);

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

    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
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

    const aiModel = getModel(apiKey);

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

    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
}
