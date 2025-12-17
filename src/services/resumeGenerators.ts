import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Resume } from '../types/types';

// Helper to convert file to base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export async function analyzeResume(file: File, apiKey: string): Promise<Partial<Resume>> {
    if (!apiKey) throw new Error('API Key required');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const imagePart = await fileToGenerativePart(file);

    const prompt = `
    Analyze this resume image and extract the data into a JSON structure matching this schema:
    {
      "fullName": "string",
      "summary": "string - professional summary, improve wording to be action-oriented",
      "skills": "string - comma separated list of top skills",
      "experience": [
        { "title": "Role & Company", "date": "Date Range", "content": "Description - improved to be action-oriented" }
      ],
      "education": [
        { "title": "Degree & School", "date": "Date Range", "content": "Details" }
      ],
      "projects": [
        { "name": "Project Name", "description": "Short description", "tech": ["tech1", "tech2"] }
      ]
    }
    
    Only return the JSON object, no markdown formatting.
  `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        const data = JSON.parse(jsonStr);
        // Add IDs to sections since they are required by our types but not extracted
        const experience = (data.experience || []).map((e: any) => ({ ...e, id: crypto.randomUUID() }));
        const education = (data.education || []).map((e: any) => ({ ...e, id: crypto.randomUUID() }));
        const projects = (data.projects || []).map((p: any) => ({ ...p, id: crypto.randomUUID() }));

        return {
            fullName: data.fullName,
            summary: data.summary,
            skills: data.skills,
            experience,
            education,
            projects,
        };
    } catch (e) {
        console.error('Failed to parse resume JSON', e);
        throw new Error('Failed to parse analysis result');
    }
}

export async function generateHeadshot(file: File, apiKey: string): Promise<string> {
    if (!apiKey) throw new Error('API Key required');
    // Placeholder for real Imagen integration
    // Since the standard Google GenAI SDK for JS/TS doesn't fully support Imagen generation directly in same way yet 
    // or requires specific beta endpoints, we will simulate a "processed" return or use a text-to-image prompt if available.
    // For this demo, we'll mock the success but in production this would call the Imagen API.

    // Real implementation would involve uploading the image reference and prompting for transformation.
    // Currently, image editing/generation is limited in public client SDKs without backend proxy.

    // Checking if we can use 'imagen-3.0-generate-001'

    console.log('Generating headshot for file:', file.name);

    // For authentic feel in this demo without a backend proxy for binary image generation:
    // We will return the original image but pretend we processed it, 
    // or we could try to use a vision model to "describe" a professional headshot of this person 
    // (which isn't generation).

    // Recommendation: Using the uploaded image directly for now as "avatar" 
    // effectively "setting" it. In a real app we'd fetch the generated URL.

    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return the base64 of original for immediate feedback
    const reader = new FileReader();
    return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
}
