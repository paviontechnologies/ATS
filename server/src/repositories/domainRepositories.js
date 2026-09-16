import { BaseRepository } from './BaseRepository.js';
import {
  Jobs,
  Candidates,
  Applications,
  Interviews,
  Scorecards,
  Offers,
  AuditLogs,
  TalentPools
} from '../models/allModels.js';

export class JobRepository extends BaseRepository {
  constructor() {
    super(Jobs);
  }

  async findActiveByTenant(tenantId) {
    return this.find({ tenantId, status: 'PUBLISHED' }, { sort: { publishedAt: -1 } });
  }
}

export class CandidateRepository extends BaseRepository {
  constructor() {
    super(Candidates);
  }

  async findByEmail(email, tenantId) {
    return this.findOne({ email: email.toLowerCase().trim(), tenantId });
  }

  async searchCandidates(query, tenantId) {
    const all = await this.find({ tenantId });
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(c =>
      (c.firstName && c.firstName.toLowerCase().includes(q)) ||
      (c.lastName && c.lastName.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.skills && c.skills.some(s => s.toLowerCase().includes(q)))
    );
  }
}

export class ApplicationRepository extends BaseRepository {
  constructor() {
    super(Applications);
  }

  async findByJob(jobId, tenantId) {
    return this.find({ jobId, tenantId });
  }

  async updateStage(applicationId, newStage, userId) {
    return this.collection.updateById(applicationId, {
      $set: { stageId: newStage, updatedAt: new Date().toISOString() },
      $push: {
        stageHistory: { fromStage: 'current', toStage: newStage, changedById: userId, changedAt: new Date().toISOString() }
      }
    });
  }
}

export class InterviewRepository extends BaseRepository {
  constructor() {
    super(Interviews);
  }

  async findUpcoming(tenantId) {
    return this.find({ tenantId }, { sort: { scheduledStartTime: 1 } });
  }
}

export class ScorecardRepository extends BaseRepository {
  constructor() {
    super(Scorecards);
  }

  async findByInterview(interviewId) {
    return this.find({ interviewId });
  }
}

export class OfferRepository extends BaseRepository {
  constructor() {
    super(Offers);
  }
}

export class AuditLogRepository extends BaseRepository {
  constructor() {
    super(AuditLogs);
  }
}

export const jobRepo = new JobRepository();
export const candidateRepo = new CandidateRepository();
export const applicationRepo = new ApplicationRepository();
export const interviewRepo = new InterviewRepository();
export const scorecardRepo = new ScorecardRepository();
export const offerRepo = new OfferRepository();
export const auditLogRepo = new AuditLogRepository();
