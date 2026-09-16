import { logger } from '../middleware/logger.js';
import { AIService } from './aiService.js';
import { candidateRepo, applicationRepo } from '../repositories/domainRepositories.js';

class BackgroundQueueManager {
  constructor() {
    this.queues = {
      resumeParsing: [],
      candidateScoring: [],
      notifications: []
    };
    this.isProcessing = false;
  }

  async addResumeParsingJob(data) {
    logger.info(`[QUEUE] Enqueued resume parsing task for ${data.filename || 'resume'}`);
    this.queues.resumeParsing.push(data);
    this.processNext();
    return { jobId: `job_parse_${Date.now()}`, status: 'QUEUED' };
  }

  async addCandidateScoringJob(data) {
    logger.info(`[QUEUE] Enqueued candidate scoring task for candidate ${data.candidateId}`);
    this.queues.candidateScoring.push(data);
    this.processNext();
    return { jobId: `job_score_${Date.now()}`, status: 'QUEUED' };
  }

  async processNext() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      while (this.queues.resumeParsing.length > 0) {
        const item = this.queues.resumeParsing.shift();
        logger.info(`[WORKER] Processing async resume parsing for ${item.filename}`);
        const parsed = await AIService.parseResumeText(item.rawText, item.filename);
        if (item.onComplete) item.onComplete(parsed);
      }

      while (this.queues.candidateScoring.length > 0) {
        const item = this.queues.candidateScoring.shift();
        logger.info(`[WORKER] Processing async scoring for candidate ${item.candidateId}`);
        const candidate = await candidateRepo.findById(item.candidateId);
        if (candidate && item.job) {
          const matchScore = AIService.calculateCandidateJobMatch(candidate, item.job);
          await applicationRepo.update(item.applicationId, { aiMatchScore: matchScore });
        }
      }
    } catch (err) {
      logger.error('[WORKER] Background queue job error:', { error: err.message });
    } finally {
      this.isProcessing = false;
    }
  }
}

export const queueManager = new BackgroundQueueManager();
