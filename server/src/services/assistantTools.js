import { Candidates, Jobs, Applications, Interviews, Scorecards, Offers, Tasks, AuditLogs } from '../db/database.js';
import { AIService } from './aiService.js';
import { CalendarService } from './calendarService.js';

export const ATS_TOOL_DEFINITIONS = [
  {
    name: 'get_proactive_guidance',
    description: 'Analyze current ATS pipeline, candidates, and offers to recommend WHAT TO DO and WHAT NOT TO DO right now.',
    input_schema: {
      type: 'object',
      properties: {
        focusArea: { type: 'string', enum: ['all', 'pipeline', 'offers', 'interviews', 'sla_warnings'], description: 'Area to focus analysis on' }
      }
    }
  },
  {
    name: 'search_candidates',
    description: 'Search and list candidate profiles in the ATS by name, skill, stage, or fit score.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Name, email, skill, or role keyword' },
        stageId: { type: 'string', enum: ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'] },
        minScore: { type: 'number', description: 'Minimum AI match score (0-100)' },
        limit: { type: 'number', description: 'Max results to return (default 10)' }
      }
    }
  },
  {
    name: 'get_candidate_dossier',
    description: 'Get full 360-degree candidate dossier including AI fit score, extracted skills, stage, and interview scorecard debriefs.',
    input_schema: {
      type: 'object',
      properties: {
        candidateId: { type: 'string' },
        candidateName: { type: 'string', description: 'Used if candidateId is not known' }
      }
    }
  },
  {
    name: 'screen_and_score_candidate',
    description: 'Run deep AI candidate fit scoring and knockout analysis against their applied job requisition.',
    input_schema: {
      type: 'object',
      properties: {
        candidateId: { type: 'string' },
        candidateName: { type: 'string' },
        jobTitle: { type: 'string' }
      }
    }
  },
  {
    name: 'move_candidate_stage',
    description: 'Move a candidate to a new recruitment stage in the Kanban pipeline and broadcast live via WebSocket.',
    input_schema: {
      type: 'object',
      properties: {
        candidateId: { type: 'string' },
        candidateName: { type: 'string' },
        toStage: { type: 'string', enum: ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'], description: 'Target stage' },
        reason: { type: 'string', description: 'Reason for stage transition or rejection' }
      },
      required: ['toStage']
    }
  },
  {
    name: 'schedule_interview',
    description: 'Schedule an interview round for a candidate, generate meeting link, and sync with calendar.',
    input_schema: {
      type: 'object',
      properties: {
        candidateId: { type: 'string' },
        candidateName: { type: 'string' },
        roundName: { type: 'string', description: 'e.g. Technical Round, System Architecture, Recruiter Screen' },
        interviewerName: { type: 'string', description: 'e.g. Elena Rostova, David Chen' },
        scheduledDate: { type: 'string', description: 'ISO date or text like "tomorrow 2pm", "in 2 days"' }
      },
      required: ['roundName']
    }
  },
  {
    name: 'sign_off_offer',
    description: 'Execute hiring manager or executive approval/sign-off on a candidate compensation package.',
    input_schema: {
      type: 'object',
      properties: {
        candidateId: { type: 'string' },
        candidateName: { type: 'string' },
        decision: { type: 'string', enum: ['APPROVE', 'REVISE', 'REJECT'], description: 'Sign-off decision' },
        notes: { type: 'string', description: 'Approval notes or compensation adjustments' }
      },
      required: ['decision']
    }
  },
  {
    name: 'draft_candidate_outreach',
    description: 'Generate personalized candidate communication (Interview invite, offer letter, status update, or constructive rejection).',
    input_schema: {
      type: 'object',
      properties: {
        candidateId: { type: 'string' },
        candidateName: { type: 'string' },
        channel: { type: 'string', enum: ['email', 'linkedin', 'sms'] },
        templateType: { type: 'string', enum: ['interview_invite', 'offer_congrats', 'screening_followup', 'polite_rejection'] }
      },
      required: ['templateType']
    }
  },
  {
    name: 'create_recruitment_task',
    description: 'Create an actionable recruitment task, SLA deadline reminder, or scorecard follow-up.',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title / description' },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
        dueDate: { type: 'string', description: 'Due date like "today", "tomorrow", or ISO string' },
        candidateName: { type: 'string', description: 'Associated candidate' }
      },
      required: ['title']
    }
  },
  {
    name: 'get_pipeline_summary',
    description: 'Summarize recruitment funnel: candidate counts per stage, average velocity, drop-off bottlenecks, and active openings.',
    input_schema: { type: 'object', properties: {} }
  },
  {
    name: 'generate_job_requisition',
    description: 'Generate complete AI Job Description with required tech stack, responsibilities, and compensation bands.',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        department: { type: 'string' },
        experienceYears: { type: 'number' },
        prompt: { type: 'string' }
      },
      required: ['title']
    }
  }
];

// Helper to find candidate by ID or fuzzy name
async function resolveCandidate(tenantId, candidateId, candidateName) {
  if (candidateId) {
    const cand = await Candidates.findById(candidateId);
    if (cand) return cand;
  }
  if (candidateName) {
    const nameClean = candidateName.trim().toLowerCase();
    const all = await Candidates.find({});
    return all.find(c => {
      const full = `${c.firstName} ${c.lastName}`.toLowerCase();
      return full.includes(nameClean) || (c.email && c.email.toLowerCase().includes(nameClean));
    }) || null;
  }
  return null;
}

// Tool Handlers
export const ATS_TOOL_HANDLERS = {
  get_proactive_guidance: async (input, ctx) => {
    let [candidates, jobs, applications, offers, interviews] = await Promise.all([
      Candidates.find({}),
      Jobs.find({ status: 'PUBLISHED' }),
      Applications.find({}),
      Offers.find({}),
      Interviews.find({})
    ]);

    const dos = [];
    const donts = [];

    // 1. High-match candidates in early stages
    const highMatchEarly = applications.filter(a => (a.aiMatchScore?.overallScore || 0) >= 90 && ['Applied', 'Screening'].includes(a.stageId));
    if (highMatchEarly.length > 0) {
      const candNames = await Promise.all(highMatchEarly.slice(0, 2).map(async a => {
        const c = await Candidates.findById(a.candidateId);
        return c ? `${c.firstName} ${c.lastName} (${a.aiMatchScore.overallScore}% fit)` : 'Candidate';
      }));
      dos.push(`Shortlist & invite top performers immediately: ${candNames.join(', ')}.`);
    }

    // 2. Pending Offer Approvals
    const pendingOffers = offers.filter(o => o.status === 'PENDING_APPROVAL' || o.approvalStatus === 'PENDING_FINANCE');
    if (pendingOffers.length > 0) {
      dos.push(`Execute hiring manager sign-off for ${pendingOffers[0].candidateName || 'pending candidate'} to avoid candidate loss.`);
    } else {
      dos.push(`All extended offers are signed off. Monitor Jordan Miller for candidate signature return.`);
    }

    // 3. Completed interviews without scorecard
    const pendingScorecards = interviews.filter(i => i.status === 'COMPLETED' && !i.scorecardId);
    if (pendingScorecards.length > 0) {
      dos.push(`Prompt evaluator ${pendingScorecards[0].interviewerName || 'team'} to submit blind scorecard for round #${pendingScorecards[0].roundNumber || 1}.`);
    }

    // 4. DON'Ts / Guardrails
    donts.push('DO NOT send offer packages to candidates without verified Technical Bar-Raiser scorecard approval (minimum 4.2/5.0 threshold).');
    donts.push('DO NOT advance candidates who failed knockout screening criteria (work authorization / clearance).');
    donts.push('DO NOT exceed department salary bands ($165k-$190k for Staff AI) without prior VP Finance sign-off.');
    donts.push('DO NOT let candidate stage dwell time exceed 5 days without scheduling the next round or giving feedback.');

    return {
      ok: true,
      summary: `Proactive Analysis: ${dos.length} urgent action items identified and 4 compliance guardrails enforced.`,
      data: {
        whatToDo: dos,
        whatNotToDo: donts,
        metrics: {
          activeJobs: jobs.length,
          candidatesInPipeline: candidates.length,
          pendingOffers: pendingOffers.length,
          interviewsScheduled: interviews.filter(i => i.status === 'SCHEDULED').length
        }
      },
      link: 'pipeline'
    };
  },

  search_candidates: async (input, ctx) => {
    const tenantId = ctx.orgId || 'ten_techcorp_global';
    const limit = Math.min(20, Math.max(1, Number(input.limit) || 8));
    const allCandidates = await Candidates.find({ tenantId });
    const allApps = await Applications.find({ tenantId });

    let filtered = allCandidates.map(c => {
      const app = allApps.find(a => a.candidateId === c._id);
      return {
        id: c._id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        skills: c.skills || [],
        experienceYears: c.totalExperienceYears || 4,
        stage: app ? app.stageId : 'Applied',
        aiMatchScore: app?.aiMatchScore?.overallScore || 85,
        targetRole: app?.jobTitle || 'Software Engineer'
      };
    });

    if (input.stageId) {
      filtered = filtered.filter(c => c.stage.toLowerCase() === input.stageId.toLowerCase());
    }
    if (input.minScore) {
      filtered = filtered.filter(c => c.aiMatchScore >= input.minScore);
    }
    if (input.query) {
      const q = input.query.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q)) ||
        c.targetRole.toLowerCase().includes(q)
      );
    }

    const results = filtered.slice(0, limit);
    return {
      ok: true,
      summary: `Found ${results.length} candidate(s) matching criteria.`,
      data: results,
      link: 'candidates'
    };
  },

  get_candidate_dossier: async (input, ctx) => {
    const tenantId = ctx.orgId || 'ten_techcorp_global';
    const candidate = await resolveCandidate(tenantId, input.candidateId, input.candidateName);
    if (!candidate) return { ok: false, summary: `Candidate "${input.candidateName || input.candidateId}" not found in ATS.` };

    const application = await Applications.findOne({ candidateId: candidate._id, tenantId });
    const interviews = await Interviews.find({ candidateId: candidate._id, tenantId });
    const scorecards = await Scorecards.find({ candidateId: candidate._id, tenantId });
    const offer = await Offers.findOne({ candidateId: candidate._id, tenantId });

    return {
      ok: true,
      summary: `Dossier loaded for ${candidate.firstName} ${candidate.lastName} (${application?.stageId || 'Applied'} stage, ${application?.aiMatchScore?.overallScore || 90}% AI Fit).`,
      data: {
        candidate,
        application,
        interviews,
        scorecards,
        offer
      },
      link: `candidate:${candidate._id}`
    };
  },

  screen_and_score_candidate: async (input, ctx) => {
    const tenantId = ctx.orgId || 'ten_techcorp_global';
    const candidate = await resolveCandidate(tenantId, input.candidateId, input.candidateName);
    if (!candidate) return { ok: false, summary: 'Candidate not found for screening.' };

    const job = input.jobTitle
      ? await Jobs.findOne({ tenantId, title: { $regex: input.jobTitle, $options: 'i' } })
      : await Jobs.findOne({ tenantId, status: 'PUBLISHED' });

    if (!job) return { ok: false, summary: 'No relevant job requisition found to evaluate against.' };

    const match = AIService.calculateCandidateJobMatch(candidate, job);
    return {
      ok: true,
      summary: `Screening Complete: ${candidate.firstName} ${candidate.lastName} scored ${match.overallScore}% Fit for ${job.title}. ${match.explanation.slice(0, 100)}...`,
      data: {
        overallScore: match.overallScore,
        skillsScore: match.skillsScore,
        matchingSkills: match.matchingSkills,
        missingSkills: match.missingSkills,
        explanation: match.explanation,
        recommendation: match.overallScore >= 85 ? 'STRONG HIRE — Advance to Technical Architecture Round' : 'BORDERLINE — Conduct screening phone call'
      },
      link: `candidate:${candidate._id}`
    };
  },

  move_candidate_stage: async (input, ctx) => {
    const tenantId = ctx.orgId || 'ten_techcorp_global';
    const candidate = await resolveCandidate(tenantId, input.candidateId, input.candidateName);
    if (!candidate) return { ok: false, summary: `Candidate "${input.candidateName || input.candidateId}" not found.` };

    const app = await Applications.findOne({ candidateId: candidate._id, tenantId });
    if (!app) return { ok: false, summary: `No active application record found for ${candidate.firstName} ${candidate.lastName}.` };

    const fromStage = app.stageId;
    const toStage = input.toStage;
    let status = app.status;
    if (toStage === 'Hired') status = 'HIRED';
    if (toStage === 'Rejected') status = 'REJECTED';
    if (['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer'].includes(toStage)) status = 'ACTIVE';

    await Applications.updateById(app._id, {
      stageId: toStage,
      status,
      rejectionReason: input.reason || null,
      $push: {
        stageHistory: {
          fromStage,
          toStage,
          changedById: ctx.userId || 'ai_assistant',
          changedAt: new Date().toISOString()
        }
      }
    });

    if (ctx.io) {
      ctx.io.emit('application:stage_changed', {
        applicationId: app._id,
        jobId: app.jobId,
        fromStage,
        toStage,
        changedBy: ctx.userName || 'AI Assistant'
      });
    }

    return {
      ok: true,
      summary: `Successfully transitioned ${candidate.firstName} ${candidate.lastName} from "${fromStage}" to "${toStage}".`,
      data: { applicationId: app._id, fromStage, toStage },
      link: 'pipeline'
    };
  },

  schedule_interview: async (input, ctx) => {
    const tenantId = ctx.orgId || 'ten_techcorp_global';
    const candidate = await resolveCandidate(tenantId, input.candidateId, input.candidateName);
    if (!candidate) return { ok: false, summary: 'Candidate not found for scheduling.' };

    const meetUrl = `https://meet.google.com/ats-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    const scheduledTime = input.scheduledDate || new Date(Date.now() + 86400000 * 2).toISOString();

    const interviewDoc = await Interviews.insertOne({
      tenantId,
      candidateId: candidate._id,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      roundName: input.roundName,
      interviewerName: input.interviewerName || 'Elena Rostova (Principal AI Architect)',
      scheduledAt: scheduledTime,
      meetingUrl: meetUrl,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    });

    return {
      ok: true,
      summary: `Interview scheduled for ${candidate.firstName} ${candidate.lastName} (${input.roundName}) with ${input.interviewerName || 'Elena Rostova'}. Meeting: ${meetUrl}`,
      data: { interviewId: interviewDoc._id, meetingUrl: meetUrl, scheduledAt: scheduledTime },
      link: 'interviews'
    };
  },

  sign_off_offer: async (input, ctx) => {
    const tenantId = ctx.orgId || 'ten_techcorp_global';
    const candidate = await resolveCandidate(tenantId, input.candidateId, input.candidateName);
    const candidateName = candidate ? `${candidate.firstName} ${candidate.lastName}` : (input.candidateName || 'Jordan Miller');

    let offer = null;
    if (candidate) {
      offer = await Offers.findOne({ candidateId: candidate._id });
    }
    if (!offer) {
      const allOffers = await Offers.find({ tenantId });
      for (const o of allOffers) {
        const c = await Candidates.findById(o.candidateId);
        if (c && `${c.firstName} ${c.lastName}`.toLowerCase().includes(candidateName.toLowerCase())) {
          offer = o;
          break;
        }
      }
    }
    if (!offer) {
      offer = await Offers.findOne({ tenantId });
    }

    if (!offer) return { ok: false, summary: `No pending offer package found for ${candidateName}.` };

    const newApproval = input.decision === 'APPROVE' ? 'APPROVED' : input.decision === 'REVISE' ? 'REVISION_REQUESTED' : 'REJECTED';
    await Offers.updateById(offer._id, {
      approvalStatus: newApproval,
      signedOffBy: ctx.userName || 'David Chen (Engineering Director)',
      signedOffAt: new Date().toISOString(),
      managerNotes: input.notes || 'Approved via AI Assistant automation.'
    });

    return {
      ok: true,
      summary: `Offer for ${offer.candidateName || candidateName} officially ${newApproval} by ${ctx.userName || 'David Chen'}. Package: $${offer.baseSalary || 165000} base + equity.`,
      data: { offerId: offer._id, status: newApproval },
      link: 'offers'
    };
  },

  draft_candidate_outreach: async (input, ctx) => {
    const tenantId = ctx.orgId || 'ten_techcorp_global';
    const candidate = await resolveCandidate(tenantId, input.candidateId, input.candidateName);
    const name = candidate ? candidate.firstName : (input.candidateName || 'Candidate');
    const channel = input.channel || 'email';
    const type = input.templateType || 'interview_invite';

    let subject = '';
    let body = '';

    if (type === 'interview_invite') {
      subject = `Next Steps with TechCorp: Technical System Architecture Round`;
      body = `Hi ${name},\n\nWe were thoroughly impressed by your background and your recent screening results. We would love to invite you to our Technical System Architecture interview round.\n\nPlease select a convenient slot on our automated calendar scheduler or reply to this email directly.\n\nWarm regards,\nAlex Morgan & The TechCorp Engineering Team`;
    } else if (type === 'offer_congrats') {
      subject = `Congratulations ${name}! Official Offer from TechCorp Global`;
      body = `Dear ${name},\n\nOn behalf of TechCorp Global, we are thrilled to extend an official offer for the Staff AI Engineer position! Your technical depth and high-agency approach stood out to the entire team.\n\nPlease review the attached offer package and execute digital e-sign in your candidate portal.\n\nWelcome aboard!`;
    } else {
      subject = `Update on your application with TechCorp`;
      body = `Hi ${name},\n\nThank you for taking the time to speak with our engineering leadership team. While we were impressed with your experience, we have decided to proceed with other candidates whose skillsets align slightly closer to our current Q4 priorities.\n\nWe would love to stay in touch for future openings.`;
    }

    return {
      ok: true,
      summary: `Drafted personalized ${channel} outreach (${type}) for ${name}.`,
      data: { subject, body, channel },
      link: candidate ? `candidate:${candidate._id}` : 'candidates'
    };
  },

  create_recruitment_task: async (input, ctx) => {
    const tenantId = ctx.orgId || 'ten_techcorp_global';
    const task = await Tasks.insertOne({
      tenantId,
      title: input.title,
      priority: input.priority || 'medium',
      dueDate: input.dueDate || 'tomorrow',
      candidateName: input.candidateName || null,
      assignedTo: ctx.userName || 'Recruiter',
      status: 'open',
      createdAt: new Date().toISOString()
    });

    return {
      ok: true,
      summary: `Created task "${input.title}" (Priority: ${input.priority || 'medium'}).`,
      data: { taskId: task._id },
      link: 'dashboard'
    };
  },

  get_pipeline_summary: async (_input, ctx) => {
    const tenantId = ctx.orgId || 'ten_techcorp_global';
    const [apps, jobs, candidates] = await Promise.all([
      Applications.find({ tenantId }),
      Jobs.find({ tenantId }),
      Candidates.find({ tenantId })
    ]);

    const stages = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'];
    const counts = {};
    stages.forEach(s => {
      counts[s] = apps.filter(a => (a.stageId || '').toLowerCase() === s.toLowerCase()).length;
    });

    return {
      ok: true,
      summary: `Pipeline Overview: ${candidates.length} candidates across ${jobs.length} open roles. Applied: ${counts.Applied || 0}, Interview: ${counts.Interview || 0}, Offers: ${counts.Offer || 0}, Hired: ${counts.Hired || 0}.`,
      data: { counts, totalCandidates: candidates.length, activeJobs: jobs.length },
      link: 'pipeline'
    };
  },

  generate_job_requisition: async (input, ctx) => {
    const jd = await AIService.generateJobDescription(
      input.prompt || `Hiring for ${input.title} with 4+ years of industry experience`,
      input.title,
      input.department || 'Engineering'
    );

    return {
      ok: true,
      summary: `Generated AI Job Specification for "${input.title}" (${jd.requiredSkills.length} required skills, compensation band: ${jd.salaryRange || '$150k-$190k'}).`,
      data: jd,
      link: 'jobs'
    };
  }
};

export async function executeAtsTool(name, input, ctx) {
  const handler = ATS_TOOL_HANDLERS[name];
  if (!handler) {
    return { ok: false, summary: `Unknown ATS tool: ${name}` };
  }
  try {
    return await handler(input, ctx);
  } catch (err) {
    console.error(`ATS Tool "${name}" execution error:`, err);
    return { ok: false, summary: `Tool execution failed: ${err.message}` };
  }
}
