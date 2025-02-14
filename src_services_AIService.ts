import { Configuration, OpenAIApi } from 'openai';
import { Document } from '@prisma/client';
import { CandidateAnalysis } from '../types';

export class AIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async analyzeCandidate(documents: Document[]): Promise<CandidateAnalysis> {
    const consolidatedContent = documents
      .map(doc => doc.content)
      .join('\n\n');

    const prompt = `
      Analyze the following candidate profile and provide a detailed assessment:
      
      ${consolidatedContent}
      
      Please provide a structured analysis including:
      1. Key strengths
      2. Potential areas of improvement
      3. Technical skills assessment
      4. Experience evaluation
      5. Educational background
      6. Key personality traits
      7. Overall assessment score (0-100)
      
      Format the response in JSON.
    `;

    try {
      const completion = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert AI recruiter analyzer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      });

      const response = completion.data.choices[0]?.message?.content;
      if (!response) throw new Error('No analysis generated');

      const analysis = JSON.parse(response);
      return this.formatAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing candidate:', error);
      throw error;
    }
  }

  private formatAnalysis(rawAnalysis: any): CandidateAnalysis {
    // Format and validate the AI response
    return {
      strengths: rawAnalysis.strengths || [],
      weaknesses: rawAnalysis.weaknesses || [],
      skills: this.formatSkills(rawAnalysis.skills || []),
      experience: rawAnalysis.experience || [],
      education: rawAnalysis.education || [],
      keyInsights: rawAnalysis.keyInsights || [],
      aiScore: rawAnalysis.overallScore || 0,
      personalityTraits: rawAnalysis.personalityTraits || [],
    };
  }

  private formatSkills(skills: any[]): Array<{name: string, level: string, yearsOfExperience: number}> {
    return skills.map(skill => ({
      name: skill.name,
      level: skill.level || 'intermediate',
      yearsOfExperience: skill.yearsOfExperience || 0
    }));
  }
}