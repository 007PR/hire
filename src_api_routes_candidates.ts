import express from 'express';
import { DocumentProcessor } from '../services/documentProcessor';
import { upload } from '../middleware/fileUpload';
import { CandidateRepository } from '../repositories/candidateRepository';

const router = express.Router();
const documentProcessor = new DocumentProcessor(process.env.OPENAI_API_KEY!);
const candidateRepository = new CandidateRepository();

router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const { linkedInUrl } = req.body;
    const resumeFile = req.file;

    if (!resumeFile && !linkedInUrl) {
      return res.status(400).json({ error: 'Either resume or LinkedIn URL is required' });
    }

    let profileText = '';

    if (resumeFile) {
      profileText += await documentProcessor.processResume(resumeFile.buffer);
    }

    if (linkedInUrl) {
      // Implement LinkedIn profile scraping
      // Note: This requires proper authorization and compliance with LinkedIn's terms
      const linkedInData = await fetchLinkedInProfile(linkedInUrl);
      profileText += linkedInData;
    }

    const analysis = await documentProcessor.analyzeProfile(profileText);
    const candidate = await candidateRepository.create({
      ...req.body,
      analysis,
      resumeUrl: resumeFile?.path,
      linkedInUrl
    });

    res.json(candidate);
  } catch (error) {
    console.error('Error processing candidate:', error);
    res.status(500).json({ error: 'Failed to process candidate profile' });
  }
});

export default router;