import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { JobController } from '../controllers/jobController';
import { CandidateController } from '../controllers/candidateController';
import { EmailController } from '../controllers/emailController';
import { GmailController } from '../controllers/gmailController';
import { CareerAgentController } from '../controllers/careerAgentController';
import { authMiddleware } from '../middleware/authMiddleware';

const apiRouter = Router();

// 1. AUTHENTICATION ROUTING
apiRouter.post('/auth/register', AuthController.register);
apiRouter.post('/auth/login', AuthController.login);
apiRouter.get('/auth/profile', authMiddleware as any, AuthController.getProfile as any);

// 2. JOB OPERATIONS ROUTING
apiRouter.get('/jobs', JobController.listJobs);
apiRouter.post('/jobs', authMiddleware as any, JobController.createJob);

// 3. CANDIDATE BOARD ROUTING
apiRouter.get('/candidates', CandidateController.listCandidates);
apiRouter.put('/candidates/:id/status', CandidateController.updateCandidateStatus);
apiRouter.post('/candidates', CandidateController.createCandidate);
apiRouter.post('/candidates/:id/screen', CandidateController.runScreeningAgent);

// 4. WORKSPACE EMAIL ROUTING
apiRouter.get('/emails', EmailController.listEmails);
apiRouter.post('/emails/shortcut', EmailController.sendEmailShortcut);
apiRouter.post('/emails/:threadId/reply', EmailController.respondToThread);
apiRouter.post('/emails/:threadId/draft', EmailController.generateAIDraft);

// 4b. REAL GMAIL API INTEGRATION ROUTING
apiRouter.get('/gmail', GmailController.listGmailEmails);
apiRouter.post('/gmail/:threadId/reply', GmailController.replyToGmailEmail);

// 5. AI CAREER AGENT ROUTING
apiRouter.post('/agent/analyze-resume', CareerAgentController.analyzeResume);
apiRouter.post('/agent/match-jobs', CareerAgentController.matchJobs);
apiRouter.post('/agent/auto-apply', CareerAgentController.autoApply);
apiRouter.post('/agent/classify-email', CareerAgentController.classifyEmail);
apiRouter.post('/agent/generate-reply', CareerAgentController.generateReply);

export default apiRouter;
