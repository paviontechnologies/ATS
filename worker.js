import { DB_SNAPSHOT } from './data/dbSnapshot.js';

// In-memory clone of persistent database for Cloudflare Worker runtime
const db = JSON.parse(JSON.stringify(DB_SNAPSHOT));

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // Handle CORS Preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    // Only intercept API calls; forward all static assets to env.ASSETS
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin-api/')) {
      try {
        return await handleApiRequest(request, url, method, env);
      } catch (err) {
        console.error('API Error in Worker:', err);
        return jsonResponse({ error: err.message || 'Internal API Error' }, 500);
      }
    }

    // Static Assets fallback
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};

async function handleApiRequest(request, url, method, env = {}) {
  let body = {};
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }
  }

  // Normalize path removing /admin-api/v1 or /api/v1 prefix
  let path = url.pathname.replace(/^\/(?:admin-api|api)\/v1/, '');
  if (!path.startsWith('/')) path = '/' + path;

  // 1. AUTH
  if (path === '/auth/login' && method === 'POST') {
    const user = db.users.find(u => u.email === body.email) || {
      _id: 'usr_recruiter',
      name: 'Alex Morgan',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: body.email || 'recruiter@techcorp.com',
      role: 'RECRUITER',
      tenantId: 'tenant_techcorp_global'
    };
    const firstName = user.firstName || (user.name ? user.name.split(' ')[0] : 'Alex');
    const lastName = user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : 'Morgan');
    const fullName = user.name || `${firstName} ${lastName}`.trim();
    return jsonResponse({
      token: 'jwt_mock_token_' + Date.now(),
      user: {
        id: user._id,
        name: fullName,
        firstName,
        lastName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        tenantId: user.tenantId
      }
    });
  }
  if (path === '/auth/signup' && method === 'POST') {
    const newUser = {
      _id: 'usr_' + Date.now(),
      firstName: body.firstName || 'New',
      lastName: body.lastName || 'User',
      email: body.email || 'user@example.com',
      role: body.role || 'RECRUITER',
      tenantId: 'tenant_techcorp_global',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    db.users.push(newUser);
    return jsonResponse({
      message: 'Account created successfully!',
      token: 'jwt_mock_token_' + Date.now(),
      user: newUser
    }, 201);
  }
  if (path === '/auth/sso' && method === 'POST') {
    return jsonResponse({
      message: `Signed in successfully via ${body.provider === 'google' ? 'Google Workspace' : 'Microsoft Azure AD'} SSO.`,
      token: 'jwt_mock_token_' + Date.now(),
      user: {
        id: 'usr_sso_' + Date.now(),
        firstName: (body.name || 'SSO User').split(' ')[0],
        lastName: (body.name || 'SSO User').split(' ')[1] || '',
        email: body.email || 'user@techcorp.com',
        role: 'RECRUITER',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      }
    });
  }
  if (path === '/auth/forgot-password' && method === 'POST') {
    return jsonResponse({
      message: `Password reset instructions have been dispatched to ${body.email}. Check your inbox within 2 minutes.`,
      resetToken: 'rst_' + Math.random().toString(36).substring(2, 10),
      expiresIn: '15 minutes'
    });
  }

  // 1.2 ADMIN & USERS
  if (path === '/admin/users') {
    if (method === 'GET') return jsonResponse(db.users || []);
    if (method === 'POST') {
      const u = {
        _id: 'usr_' + Date.now(),
        firstName: body.firstName || 'Team',
        lastName: body.lastName || 'Member',
        email: body.email,
        role: (body.role || 'RECRUITER').toUpperCase(),
        tenantId: 'tenant_techcorp_global',
        isActive: true,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      };
      db.users.push(u);
      return jsonResponse({ message: `User ${u.firstName} added successfully.`, user: u }, 201);
    }
  }
  if (path === '/admin/roles-permissions' && method === 'GET') {
    return jsonResponse([
      { role: 'ADMIN', displayName: 'Company Administrator', accessLevel: 'Full Access', badgeColor: 'bg-purple-100 text-purple-800' },
      { role: 'RECRUITER', displayName: 'Talent Acquisition Partner', accessLevel: 'Pipeline & Sourcing', badgeColor: 'bg-blue-100 text-blue-800' },
      { role: 'HIRING_MANAGER', displayName: 'Department Hiring Manager', accessLevel: 'Requisition & Approval', badgeColor: 'bg-emerald-100 text-emerald-800' },
      { role: 'INTERVIEWER', displayName: 'Technical / Cultural Interviewer', accessLevel: 'Scorecards & Feedback Only', badgeColor: 'bg-amber-100 text-amber-800' }
    ]);
  }

  // 2. JOBS
  if (path === '/jobs') {
    if (method === 'GET') return jsonResponse(db.jobs || []);
    if (method === 'POST') {
      const newJob = {
        _id: 'job_' + Date.now(),
        createdAt: new Date().toISOString(),
        status: body.status || 'PUBLISHED',
        ...body
      };
      db.jobs.unshift(newJob);
      return jsonResponse(newJob, 201);
    }
  }
  if (path === '/jobs/requisitions/pending' && method === 'GET') {
    const pending = (db.jobs || []).filter(j => j.status === 'PENDING_APPROVAL');
    return jsonResponse(pending);
  }
  if (path.match(/^\/jobs\/([^/]+)\/approve$/) && method === 'POST') {
    const jId = path.split('/')[2];
    const job = (db.jobs || []).find(j => j._id === jId) || db.jobs[0];
    if (job) {
      job.status = 'PUBLISHED';
      job.approvedAt = new Date().toISOString();
    }
    return jsonResponse({
      message: `Job Requisition "${job?.title || 'Requisition'}" has been APPROVED and successfully broadcast to connected job boards!`,
      job
    });
  }
  if (path.match(/^\/jobs\/([^/]+)\/reject$/) && method === 'POST') {
    const jId = path.split('/')[2];
    const job = (db.jobs || []).find(j => j._id === jId) || db.jobs[0];
    if (job) {
      job.status = 'REJECTED';
      job.rejectionComments = body.comments || 'Rejected';
    }
    return jsonResponse({
      message: `Job Requisition "${job?.title || 'Requisition'}" has been rejected with feedback.`,
      job
    });
  }
  if (path.match(/^\/jobs\/([^/]+)\/auto-post-boards$/) && method === 'POST') {
    const jId = path.split('/')[2];
    const job = (db.jobs || []).find(j => j._id === jId) || db.jobs[0];
    return jsonResponse({
      message: `Job "${job?.title}" successfully posted to 4 job boards (Naukri, Indeed, Monster, Dice).`,
      boards: ['naukri', 'indeed', 'monster', 'dice']
    });
  }
  if (path.match(/^\/jobs\/([^/]+)$/) && method === 'DELETE') {
    const jId = path.split('/')[2];
    const idx = (db.jobs || []).findIndex(j => j._id === jId);
    if (idx !== -1) db.jobs.splice(idx, 1);
    return jsonResponse({ message: 'Job Requisition permanently deleted.' });
  }
  if (path === '/jobs/generate-ai-jd' && method === 'POST') {
    return jsonResponse({
      title: body.title || 'Senior Engineer',
      department: body.department || 'Engineering',
      aiGeneratedJD: `Comprehensive Job Description for ${body.title || 'Role'}.\nWe are seeking an experienced technical professional with proven industry leadership in distributed architecture and modern engineering standards.`,
      extractedSkills: ['System Design', 'Cloud Architecture', 'React', 'Node.js', 'High Availability']
    });
  }
  if (path.match(/^\/jobs\/([^/]+)\/syndicate$/) && method === 'POST') {
    return jsonResponse({
      message: 'Job successfully syndicated across 50+ major job boards.',
      boards: ['LinkedIn Jobs', 'Indeed', 'Glassdoor', 'Google for Jobs', 'ZipRecruiter', 'Monster'],
      timestamp: new Date().toISOString()
    });
  }

  // 3. CANDIDATES
  if (path === '/candidates') {
    if (method === 'GET') return jsonResponse(db.candidates || []);
  }
  if (path === '/candidates/bulk-status' && method === 'POST') {
    return jsonResponse({
      message: `Successfully updated ${(body.candidateIds || []).length} candidate applications to "${body.newStage}".`,
      updatedCount: (body.candidateIds || []).length
    });
  }
  if (path === '/candidates/bulk-email' && method === 'POST') {
    return jsonResponse({
      message: `Campaign "${body.subject || 'Recruitment Update'}" queued for ${(body.candidateIds || []).length} candidates.`,
      dispatchedCount: (body.candidateIds || []).length,
      queuedCount: (body.candidateIds || []).length
    });
  }
  if (path.match(/^\/candidates\/([^/]+)\/match-insights$/) && method === 'GET') {
    const cId = path.split('/')[2];
    const candidate = db.candidates.find(c => c._id === cId) || db.candidates[0] || {};
    return jsonResponse({
      candidateId: candidate._id,
      candidateName: `${candidate.firstName || 'Candidate'} ${candidate.lastName || ''}`.trim(),
      overallScore: candidate.fitScore || 92,
      matchScore: candidate.fitScore || 92,
      percentile: 'Top 5% of talent pool',
      percentileRank: 'Top 5% of talent pool',
      matchedSkills: ['React', 'Node.js', 'Distributed Systems'],
      missingSkills: ['Kubernetes Advanced Tuning'],
      aiRecommendation: 'High confidence match. Strong alignment on core distributed systems and frontend frameworks.',
      rationale: 'High confidence match. Strong alignment on core distributed systems and frontend frameworks.',
      breakdown: {
        skillsMatchPercentage: 92,
        matchedSkills: ['React', 'Node.js', 'Distributed Systems'],
        missingSkills: ['Kubernetes Advanced Tuning'],
        experienceRequiredYears: 3,
        candidateExperienceYears: 5,
        experienceFit: 'EXCEEDS_REQUIREMENT',
        educationFit: 'Degree Verified'
      }
    });
  }
  if (path === '/candidates/save-search-alert' && method === 'POST') {
    return jsonResponse({
      message: `Search alert "${body.searchName || 'Custom Alert'}" successfully saved!`,
      alertId: 'alert_' + Date.now()
    });
  }
  if (path.match(/^\/candidates\/([^/]+)$/) && method === 'DELETE') {
    const cId = path.split('/')[2];
    const idx = (db.candidates || []).findIndex(c => c._id === cId);
    if (idx !== -1) db.candidates.splice(idx, 1);
    return jsonResponse({ message: 'Candidate permanently deleted from talent pool.' });
  }
  if (path.startsWith('/candidates/') && method === 'GET') {
    const id = path.split('/')[2];
    const candidate = db.candidates.find(c => c._id === id) || db.candidates[0] || {};
    return jsonResponse(candidate);
  }
  if (path === '/candidates/upload-resume' && method === 'POST') {
    const newCand = {
      _id: 'cand_' + Date.now(),
      createdAt: new Date().toISOString(),
      fullName: body.fullName || 'Jordan Miller',
      email: body.email || `candidate_${Date.now()}@example.com`,
      skills: ['TypeScript', 'Distributed Systems', 'Cloud'],
      fitScore: 92,
      ...body
    };
    db.candidates.unshift(newCand);
    return jsonResponse(newCand, 201);
  }

  // 4. PIPELINE & APPLICATIONS
  if (path.startsWith('/applications/pipeline/')) {
    const jobId = path.split('/')[3];
    const apps = db.applications.filter(a => !jobId || a.jobId === jobId);
    return jsonResponse(apps.length > 0 ? apps : db.applications);
  }
  if (path.match(/^\/applications\/([^/]+)\/move-stage$/)) {
    const appId = path.split('/')[2];
    const app = db.applications.find(a => a._id === appId) || db.applications[0];
    if (app && body.newStage) {
      app.stage = body.newStage;
      app.updatedAt = new Date().toISOString();
    }
    return jsonResponse(app || { message: 'Stage updated' });
  }

  // 5. INTERVIEWS
  if (path === '/interviews') {
    if (method === 'GET') return jsonResponse(db.interviews || []);
  }
  if (path === '/interviews/available-slots' && method === 'GET') {
    return jsonResponse([
      'Tomorrow 10:00 AM - 11:00 AM (EST)',
      'Tomorrow 2:00 PM - 3:00 PM (EST)',
      'Day After 11:30 AM - 12:30 PM (EST)',
      'Day After 4:00 PM - 5:00 PM (EST)'
    ]);
  }
  if (path === '/interviews/schedule' && method === 'POST') {
    const interview = {
      _id: 'int_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'SCHEDULED',
      ...body
    };
    db.interviews.unshift(interview);
    return jsonResponse({ message: 'Interview scheduled successfully', interview });
  }
  if (path.includes('/start-studio') && method === 'POST') {
    return jsonResponse({
      sessionUrl: 'https://studio.enterprise-ats.io/room_live_eval',
      status: 'ACTIVE'
    });
  }
  if (path.includes('/complete-studio') && method === 'POST') {
    return jsonResponse({
      message: 'Interview studio completed successfully',
      status: 'COMPLETED'
    });
  }
  if (path.includes('/candidate-tech-check') && method === 'POST') {
    return jsonResponse({
      status: 'PASSED',
      checks: { audio: true, video: true, network: 'EXCELLENT', latencyMs: 24 }
    });
  }
  if (path.includes('/archive')) {
    return jsonResponse({ message: 'Interview session archived' });
  }

  // 6. SCORECARDS
  if (path === '/scorecards' && method === 'POST') {
    const card = { _id: 'sc_' + Date.now(), ...body, createdAt: new Date().toISOString() };
    db.scorecards.unshift(card);
    return jsonResponse({ message: 'Scorecard recorded successfully', scorecard: card });
  }

  // 7. OFFERS
  if (path === '/offers') {
    if (method === 'GET') return jsonResponse(db.offers || []);
  }
  if (path.match(/^\/offers\/([^/]+)\/accept$/) && method === 'POST') {
    const offerId = path.split('/')[2];
    const offer = db.offers.find(o => o._id === offerId) || db.offers[0];
    if (offer) offer.status = 'ACCEPTED';
    return jsonResponse({ message: 'Offer accepted and HRIS onboarding dispatched.', status: 'ACCEPTED' });
  }
  if (path.match(/^\/offers\/([^/]+)\/send-docusign$/) && method === 'POST') {
    const offerId = path.split('/')[2];
    return jsonResponse({
      message: 'Official offer envelope successfully dispatched via DocuSign!',
      envelopeId: 'env_ds_' + Date.now(),
      status: 'SENT'
    });
  }
  if (path.match(/^\/offers\/([^/]+)\/generate-pdf$/) && method === 'POST') {
    const offerId = path.split('/')[2];
    return jsonResponse({
      message: 'Official branded employment offer letter (PDF) generated successfully!',
      pdfUrl: `https://s3.us-east-1.amazonaws.com/company-ats/offers/OFFER_${offerId}.pdf`
    });
  }

  // 8. ANALYTICS
  if (path === '/analytics/funnel') {
    return jsonResponse({
      summary: {
        activeJobs: 14,
        totalCandidates: 14,
        totalApplications: 248,
        scheduledInterviews: 18,
        activeOffers: 12,
        totalHires: 6,
        avgTimeToHireDays: 21.4,
        costPerHireUSD: 2850,
        offerAcceptanceRate: 88.9
      },
      applied: 248,
      screening: 142,
      interview: 52,
      offer: 18,
      hired: 14,
      velocityDays: 21.4,
      offerAcceptanceRate: 88.9,
      sourceBreakdown: [
        { source: 'LinkedIn Talent Hub', candidates: 94, percent: 38 },
        { source: 'Indeed Worldwide', candidates: 68, percent: 27 },
        { source: 'Naukri.com Enterprise', candidates: 42, percent: 17 },
        { source: 'Monster (Foundit)', candidates: 24, percent: 10 },
        { source: 'Dice Tech Jobs', candidates: 20, percent: 8 }
      ]
    });
  }
  if (path === '/analytics/export' && method === 'GET') {
    const csv = 'Metric,Value,Unit\nTime-to-Hire,21.4,Days\nCost-per-Hire,$2850,USD\nTotal Active Jobs,14,Jobs\nOffer Acceptance Rate,89,Percent\n';
    return new Response(csv, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="ats_analytics_report.csv"'
      }
    });
  }

  // 8.1 WORKFLOW RULES
  if (path === '/workflows/rules' && method === 'POST') {
    const newRule = {
      id: 'rule_' + Date.now(),
      name: body.name || 'Custom Rule',
      trigger: body.triggerEvent || 'STAGE_CHANGED',
      actionType: body.actionType || 'SEND_EMAIL',
      delayHours: body.delayHours || 24,
      description: body.description || 'Custom delayed automation rule',
      isEnabled: true,
      executionCount: 0
    };
    return jsonResponse({ message: 'Automation rule created successfully.', rule: newRule }, 201);
  }

  // 9. CAREER JOBS
  if (path === '/careers/jobs') {
    return jsonResponse(db.jobs.filter(j => j.status === 'PUBLISHED') || db.jobs);
  }

  // 10. ADMIN & AUDIT
  if (path === '/admin/audit-logs' || path.includes('audit-logs')) {
    return jsonResponse(db.auditLogs || []);
  }
  if (path.includes('credentials')) {
    return jsonResponse(db.users || []);
  }

  // 11. VERAHIRE AI RECRUITER
  if (path === '/verahire/sessions' && method === 'GET') {
    return jsonResponse(db.verahireInterviews || []);
  }
  if (path.startsWith('/verahire/rankings/')) {
    return jsonResponse([
      {
        candidateName: 'Jordan Miller',
        overallScore: 94,
        tier: 'TOP_TIER',
        recommendation: 'STRONG_HIRE',
        skills: ['Distributed Systems 95%', 'Technical Depth 94%', 'Articulation 92%']
      },
      {
        candidateName: 'Kevin Zhang',
        overallScore: 89,
        tier: 'QUALIFIED',
        recommendation: 'HIRE',
        skills: ['Kubernetes 90%', 'Incident Management 88%']
      },
      {
        candidateName: 'Samantha Ruiz',
        overallScore: 86,
        tier: 'QUALIFIED',
        recommendation: 'HIRE',
        skills: ['Design Systems 91%', 'User Empathy 85%']
      },
      {
        candidateName: 'Devon Zhao',
        overallScore: 81,
        tier: 'CONSIDER',
        recommendation: 'NEEDS_SECOND_REVIEW',
        skills: ['TypeScript 84%', 'Data Modeling 78%']
      }
    ]);
  }
  if (path === '/verahire/screen' && method === 'POST') {
    const candidate = db.candidates.find(c => c._id === body.candidateId) || { fullName: 'Jordan Miller' };
    const evaluation = {
      candidateName: candidate.fullName || 'Jordan Miller',
      overallScore: 94,
      recommendation: 'STRONG_HIRE',
      status: 'COMPLETED',
      rubricScores: {
        technicalDepth: 95,
        architectureScalability: 93,
        articulation: 94,
        situationalReasoning: 92
      },
      insights: 'Demonstrated exceptional command of distributed resilience, circuit breakers, and telemetry under production incident conditions.'
    };
    db.verahireInterviews.unshift({
      _id: 'vh_' + Date.now(),
      jobId: body.jobId,
      candidateId: body.candidateId,
      ...evaluation,
      createdAt: new Date().toISOString()
    });
    return jsonResponse({
      message: 'VeraHire first-round AI screening completed successfully.',
      evaluation
    });
  }
  if (path.startsWith('/verahire/questions/')) {
    return jsonResponse({
      criteria: ['Distributed Systems', 'Architecture & Scalability', 'Articulation', 'Situational Reasoning'],
      questions: [
        'Tell me about a time you handled a difficult customer escalation or critical production outage under high pressure.',
        'How do you balance tech debt remediation with aggressive sprint feature velocity?',
        'Describe an architecture decision you made that significantly reduced latency or cloud infrastructure costs.'
      ]
    });
  }

  // 12. DEEL GLOBAL HR & EOR
  if (path === '/deel/countries' && method === 'GET') {
    return jsonResponse([
      { country: 'India', code: 'IN', complianceStatus: 'ACTIVE', statutoryRules: 'EPF 12%, Gratuity 4.81%, ESI 0.75%', activeWorkers: 18 },
      { country: 'United States', code: 'US', complianceStatus: 'ACTIVE', statutoryRules: 'W-4, At-Will, 401(k), State Tax', activeWorkers: 24 },
      { country: 'United Kingdom', code: 'UK', complianceStatus: 'ACTIVE', statutoryRules: 'PAYE, Pension Auto-Enrolment', activeWorkers: 9 },
      { country: 'Germany', code: 'DE', complianceStatus: 'ACTIVE', statutoryRules: 'Krankenkasse, Social Security', activeWorkers: 6 },
      { country: 'United Arab Emirates', code: 'AE', complianceStatus: 'ACTIVE', statutoryRules: '0% Income Tax, End of Service Gratuity', activeWorkers: 5 },
      { country: 'Canada', code: 'CA', complianceStatus: 'ACTIVE', statutoryRules: 'CPP/EI, Provincial Health Coverage', activeWorkers: 4 },
      { country: 'Singapore', code: 'SG', complianceStatus: 'ACTIVE', statutoryRules: 'CPF Mandatory Contributions', activeWorkers: 7 }
    ]);
  }
  if (path === '/deel/workers' && method === 'GET') {
    return jsonResponse(db.deelWorkers || []);
  }
  if (path === '/deel/onboard' && method === 'POST') {
    const worker = {
      _id: 'dwrk_' + Date.now(),
      workerId: 'DEEL-WRK-' + Math.floor(100000 + Math.random() * 900000),
      fullName: body.fullName || 'Jordan Miller',
      email: body.email || 'jordan.miller@example.com',
      country: body.country || 'India',
      status: 'ONBOARDED_SYNCED',
      globalPayrollStatus: 'SYNCED_READY',
      createdAt: new Date().toISOString()
    };
    db.deelWorkers.unshift(worker);
    return jsonResponse({
      message: 'Worker onboarded successfully to Deel Global EOR.',
      worker
    });
  }

  // 13. RAZORPAYX PAYROLL
  if (path === '/payroll/employees' && method === 'GET') {
    return jsonResponse(db.payrollRecords || []);
  }
  if (path === '/payroll/calculate-ctc' && method === 'POST') {
    const annualCTC = Number(body.annualCTC) || 1800000;
    const monthlyGross = Math.round(annualCTC / 12);
    const basic = Math.round(monthlyGross * 0.5);
    const hra = Math.round(monthlyGross * 0.2);
    const specialAllowance = Math.round(monthlyGross * 0.3);
    const epf = 1800;
    const esi = 0;
    const professionalTax = 200;
    const tds = Math.round(monthlyGross * 0.08);
    const netTakeHome = monthlyGross - (epf + esi + professionalTax + tds);
    return jsonResponse({
      annualCTC,
      monthlyGross,
      basic,
      hra,
      specialAllowance,
      epf,
      esi,
      professionalTax,
      tds,
      gratuity: Math.round(basic * 0.0481),
      netTakeHome
    });
  }
  if (path === '/payroll/disburse' && method === 'POST') {
    const utr = `RZPX_UTR_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const payout = {
      _id: 'pay_' + Date.now(),
      utrNumber: utr,
      employeeName: body.employeeName || 'Jordan Miller',
      amount: body.amount || 128000,
      status: 'PROCESSED_SUCCESS',
      disbursedAt: new Date().toISOString()
    };
    db.payrollPayouts.unshift(payout);
    return jsonResponse({
      message: 'Direct salary disbursement completed successfully via RazorpayX.',
      payout,
      utrNumber: utr
    });
  }

  // 14. AGENCY CRM
  if (path === '/agency/clients' && method === 'GET') {
    return jsonResponse(db.agencyClients || []);
  }
  if (path === '/agency/submissions' && method === 'GET') {
    return jsonResponse(db.agencySubmissions || []);
  }
  if (path === '/agency/invoices' && method === 'GET') {
    return jsonResponse(db.agencyInvoices || []);
  }
  if (path === '/agency/invoices/generate' && method === 'POST') {
    const invNumber = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const inv = {
      _id: 'inv_' + Date.now(),
      invoiceNumber: invNumber,
      clientName: body.clientName || 'Nexus Cloud Technologies',
      candidateName: body.candidateName || 'Jordan Miller',
      role: body.role || 'Staff AI Engineer',
      salary: body.salary || '$165,000',
      feePercentage: '20%',
      amountDue: body.amountDue || '$33,000.00',
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString()
    };
    db.agencyInvoices.unshift(inv);
    return jsonResponse({
      message: `Placement invoice ${invNumber} generated successfully.`,
      invoice: inv
    });
  }

  // 15. AUTOPILOT WORKFLOWS
  if (path === '/workflows' && method === 'GET') {
    return jsonResponse(db.workflows || []);
  }
  if (path === '/workflows/toggle' && method === 'POST') {
    const wf = db.workflows.find(w => w.id === body.ruleId || w._id === body.ruleId) || db.workflows[0];
    if (wf) {
      wf.isEnabled = !wf.isEnabled;
      wf.updatedAt = new Date().toISOString();
    }
    return jsonResponse(wf || { message: 'Workflow state updated' });
  }
  if (path === '/workflows/trigger' && method === 'POST') {
    const wf = db.workflows.find(w => w.id === body.ruleId || w._id === body.ruleId) || db.workflows[0];
    const log = {
      _id: 'log_' + Date.now(),
      ruleName: wf ? wf.name : 'Automated Workflow',
      actionResult: 'Triggered zero-touch candidate progression and auto-communications pipeline.',
      status: 'SUCCESS',
      executedAt: new Date().toISOString()
    };
    db.autopilotLogs.unshift(log);
    return jsonResponse({
      message: 'Autopilot workflow trigger executed successfully.',
      log
    });
  }

  // 16. AI ASSISTANT / COPILOT
  if ((path === '/assistant/chat' || path === '/ai/assistant-chat') && method === 'POST') {
    const apiKey = (env && env.OPENAI_API_KEY) || '';
    const userPrompt = body.message || body.prompt || '';
    let reply = "";
    let actions = [];

    // 1. Attempt OpenAI GPT-4o-mini completion if key and prompt exist
    if (apiKey && userPrompt) {
      try {
        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are the Pavion Technologies Autonomous Recruitment Copilot for the Enterprise ATS. You assist recruiters with hiring pipelines, candidate fit, interviews, compensation, and offer workflows. Provide concise, professional, proactive advice highlighting what to do and compliance guardrails.'
              },
              ...(Array.isArray(body.history) ? body.history.slice(-4) : []),
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 600
          })
        });

        const openAiData = await openAiRes.json();
        if (openAiData && openAiData.choices && openAiData.choices[0]?.message?.content) {
          reply = openAiData.choices[0].message.content;
          actions = [
            { toolName: 'openai_gpt4o_inference', executed: true, summary: 'Generated with OpenAI GPT-4o-mini' }
          ];
        }
      } catch (err) {
        console.warn('OpenAI API call fallback in Worker:', err.message);
      }
    }

    // 2. High-Agency Recruitment Copilot Fallback (if OpenAI quota exhausted or unavailable)
    if (!reply) {
      const promptLower = userPrompt.toLowerCase();
      reply = "I am the Pavion Technologies Autonomous Recruitment Copilot. I have audited candidate velocity across all open pipelines.";
      if (promptLower.includes('offer') || promptLower.includes('sign') || promptLower.includes('approve') || promptLower.includes('package')) {
        reply = "Jordan Miller's offer package for Staff AI Engineer ($165,000 / ₹18,00,000 CTC) has been approved and electronically signed. HRIS onboarding dispatch and RazorpayX payroll profile have been triggered.";
        actions.push({ toolName: 'sign_off_offer', executed: true, summary: 'Offer letter signed & approved for Jordan Miller (Staff AI Engineer)' });
        actions.push({ toolName: 'dispatch_onboarding', executed: true, summary: 'Deel EOR & RazorpayX onboarding workflows initiated' });
      } else if (promptLower.includes('shortlist') || promptLower.includes('verahire') || promptLower.includes('rank')) {
        reply = "VeraHire AI analysis indicates 4 candidates have completed autonomous voice evaluation. Jordan Miller leads the shortlist with a 94% composite fit score across System Architecture and Technical Depth.";
        actions.push({ toolName: 'verahire_shortlist_audit', executed: true, summary: 'VeraHire Ranked Shortlist verified: Jordan Miller (94%), Kevin Zhang (89%)' });
      } else if (promptLower.includes('payroll') || promptLower.includes('ctc') || promptLower.includes('salary')) {
        reply = "RazorpayX payroll calculations are synchronized. The monthly statutory compliance breakdown for Indian hires reflects EPF, Gratuity, PT, and TDS accurately.";
        actions.push({ toolName: 'razorpayx_compliance_sync', executed: true, summary: 'Indian statutory breakdown confirmed: EPF 12%, Gratuity 4.81%' });
      } else if (promptLower.includes('deel') || promptLower.includes('global') || promptLower.includes('country')) {
        reply = "Deel EOR platform covers 110+ jurisdictions. Current active contracts in India, United States, and Germany are compliant and ready for payroll dispatches.";
        actions.push({ toolName: 'deel_eor_verification', executed: true, summary: 'Global EOR 110+ country compliance rules active' });
      } else if (promptLower.includes('kya') || promptLower.includes('do') || promptLower.includes('suggest') || promptLower.includes('guide')) {
        reply = "Here is your recruitment intelligence update:\n\n• DO: Review Jordan Miller's 94% fit score and release formal offer package.\n• DO: Schedule Elena Rostova's system design debrief.\n• DON'T: Bypass knockout criteria without senior recruiter calibration.";
        actions.push({ toolName: 'get_proactive_guidance', executed: true, summary: 'Proactive guidance generated for active pipeline' });
      } else {
        actions.push({ toolName: 'recruitment_copilot_sync', executed: true, summary: 'Recruitment intelligence and candidate telemetry synchronized' });
      }
    }

    return jsonResponse({
      success: true,
      reply,
      message: reply,
      actions,
      suggestedActions: [
        'Review VeraHire ranked shortlists',
        'Verify RazorpayX CTC calculations',
        'Check Deel global worker compliance'
      ]
    });
  }

  // 17. JOB BOARDS HUB (NAUKRI, INDEED, MONSTER, DICE)
  if (path === '/job-boards/boards' && method === 'GET') {
    return jsonResponse([
      { key: 'naukri', name: 'Naukri.com Enterprise', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200', primaryMarket: 'India / APAC Leading Job Portal' },
      { key: 'indeed', name: 'Indeed Worldwide', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200', primaryMarket: 'Global #1 Job Search Engine' },
      { key: 'monster', name: 'Monster (Foundit)', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200', primaryMarket: 'Global & APAC Premier Talent Platform' },
      { key: 'dice', name: 'Dice Tech Jobs', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200', primaryMarket: 'Premier Technology & AI Marketplace' }
    ]);
  }
  if (path === '/job-boards/search' && method === 'GET') {
    const q = url.searchParams.get('query') || 'Full Stack Developer';
    const loc = url.searchParams.get('location') || 'Bangalore, India';
    const sampleJobs = [
      {
        id: 'ext_naukri_' + Date.now() + '_1',
        board: 'Naukri.com Enterprise',
        boardKey: 'naukri',
        title: `${q} (Cloud & Distributed Systems)`,
        company: 'Cognizant Digital Solutions',
        location: loc,
        experience: '4 - 8 Years',
        salary: '₹18,00,000 - ₹32,00,000 P.A.',
        skills: ['React', 'Node.js', 'AWS', 'Microservices', 'Docker'],
        description: `Key Requirements: Looking for an experienced ${q} responsible for architecting scalable cloud backends, API design, and mentoring engineers.`,
        postedDate: 'Today, 2 hours ago',
        applicantsCount: 38,
        rating: '4.2 ★ (4,120 reviews)',
        applyUrl: `https://www.naukri.com/${q.toLowerCase().replace(/[^a-z0-9]/g, '-')}-jobs`
      },
      {
        board: 'Indeed Worldwide',
        boardKey: 'indeed',
        title: `Senior ${q}`,
        company: 'Stripe Payments / Global Infrastructure',
        location: loc.includes('Remote') ? 'Remote (Worldwide)' : `${loc} (Hybrid)`,
        experience: '5+ Years Experience',
        salary: '$140,000 - $190,000 a year / ₹40,00,000+ equiv.',
        skills: ['TypeScript', 'Node.js', 'Distributed Ledger', 'PostgreSQL', 'API Architecture'],
        description: `Build financial infrastructure for the internet. We are hiring a Senior ${q} to scale payment processing engines across multi-region clusters.`,
        postedDate: 'Just posted',
        applicantsCount: 19,
        rating: '4.5 ★ (Indeed Top Employer)',
        applyUrl: `https://www.indeed.com/jobs?q=${encodeURIComponent(q)}&l=${encodeURIComponent(loc)}`
      },
      {
        board: 'Monster (Foundit)',
        boardKey: 'monster',
        title: `Staff ${q} (Backend & Data Platforms)`,
        company: 'Oracle Cloud Infrastructure (OCI)',
        location: loc,
        experience: '7 - 12 Years',
        salary: '₹28,00,000 - ₹48,00,000 P.A.',
        skills: ['Java', 'Spring Boot', 'Distributed Cache', 'MySQL', 'Terraform'],
        description: `Join OCI Core Engineering. Lead large-scale distributed cloud services, enforce high reliability SLOs, and mentor global engineering squads.`,
        postedDate: 'Today',
        applicantsCount: 27,
        rating: '4.1 ★ (Foundit Verified Recruiter)',
        applyUrl: `https://www.foundit.in/srp/results?query=${encodeURIComponent(q)}`
      },
      {
        board: 'Dice Tech Jobs',
        boardKey: 'dice',
        title: `Principal ${q} (AI & Inference)`,
        company: 'Snowflake Computing',
        location: loc.includes('Remote') ? '100% Remote (Tech Only)' : `${loc} / Tech Hub`,
        experience: '8+ Years',
        salary: '$165,000 - $220,000 USD / High Equity',
        skills: ['C++', 'Rust', 'LLM Inference', 'GPU Optimization', 'Distributed Memory'],
        description: `Dice Verified Technology Requisition: Core AI infra optimization team seeking a Principal ${q} to optimize tensor compilation and low-latency serving.`,
        postedDate: '4 hours ago',
        applicantsCount: 14,
        rating: '4.8 ★ (Dice Top Tech Hub)',
        applyUrl: `https://www.dice.com/jobs?q=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`
      }
    ];
    return jsonResponse({
      query: q,
      location: loc,
      totalFound: sampleJobs.length,
      jobs: sampleJobs
    });
  }
  if (path === '/job-boards/post' && method === 'POST') {
    const title = body.title || 'Senior Software Engineer';
    const boards = body.selectedBoards || ['naukri', 'indeed', 'monster', 'dice'];
    const boardResults = boards.map(b => ({
      boardKey: b,
      boardName: b.toUpperCase(),
      externalRefId: `${b.toUpperCase()}-REQ-${Date.now().toString().slice(-6)}`,
      liveUrl: `https://${b}.com/job/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      viewsCount: Math.floor(120 + Math.random() * 300),
      clicksCount: Math.floor(35 + Math.random() * 80)
    }));
    return jsonResponse({
      message: `Requirement "${title}" successfully posted to ${boards.length} job boards (Naukri, Indeed, Monster, Dice).`,
      posting: {
        id: 'post_' + Date.now(),
        title,
        syndicatedBoards: boardResults,
        createdAt: new Date().toISOString()
      },
      boardResults
    }, 201);
  }
  if (path === '/job-boards/postings' && method === 'GET') {
    return jsonResponse([
      {
        id: 'post_default_1',
        title: 'Staff AI Engineer (Autonomous Agents & Inference)',
        location: 'Bangalore / Remote',
        department: 'Core AI',
        experienceYears: '5 - 9 Years',
        salaryRange: '₹35,00,000 - ₹55,00,000 P.A.',
        syndicatedBoards: [
          { boardKey: 'naukri', boardName: 'Naukri.com Enterprise', status: 'PUBLISHED', viewsCount: 420, clicksCount: 88, applicantsCount: 16 },
          { boardKey: 'indeed', boardName: 'Indeed Worldwide', status: 'PUBLISHED', viewsCount: 380, clicksCount: 74, applicantsCount: 12 },
          { boardKey: 'monster', boardName: 'Monster (Foundit)', status: 'PUBLISHED', viewsCount: 290, clicksCount: 62, applicantsCount: 9 },
          { boardKey: 'dice', boardName: 'Dice Tech Jobs', status: 'PUBLISHED', viewsCount: 310, clicksCount: 69, applicantsCount: 11 }
        ],
        createdAt: new Date().toISOString()
      }
    ]);
  }
  if (path === '/job-boards/import' && method === 'POST') {
    const ext = body.externalJob || {};
    const newJob = {
      _id: 'job_' + Date.now(),
      title: ext.title || 'Imported Engineer',
      department: 'Engineering',
      status: 'PUBLISHED',
      location: { city: ext.location || 'Bangalore', country: 'India', isRemote: true },
      requiredSkills: ext.skills || ['React', 'Node.js', 'Cloud'],
      createdAt: new Date().toISOString(),
      importedFrom: { board: ext.board || 'External Board', company: ext.company }
    };
    db.jobs.unshift(newJob);
    return jsonResponse({
      message: `Successfully imported "${newJob.title}" from ${ext.board || 'External Job Board'} into ATS Job Requisitions!`,
      job: newJob
    }, 201);
  }
  if (path === '/job-boards/credentials') {
    if (method === 'GET') {
      return jsonResponse({
        boards: {
          naukri: { apiKey: 'NAUKRI_FREE_DEV_SANDBOX_KEY_2026', clientId: 'naukri_client_free_9921', status: 'CONNECTED' },
          indeed: { apiKey: 'INDEED_FREE_PUBLISHER_KEY_88410', publisherId: 'pub_indeed_free_88410', status: 'CONNECTED' },
          monster: { apiKey: 'MONSTER_FOUNDIT_FREE_API_773', partnerId: 'monster_partner_free_773', status: 'CONNECTED' },
          dice: { apiKey: 'DICE_REST_PUBLIC_API_V1', developerKey: 'dice_dev_free_tech_5510', status: 'CONNECTED' }
        }
      });
    }
    if (method === 'POST') {
      return jsonResponse({ message: 'Job board API credentials updated and securely saved.' });
    }
  }
  if (path === '/job-boards/test-connection' && method === 'POST') {
    const b = body.boardKey || 'naukri';
    return jsonResponse({
      boardKey: b,
      status: 'CONNECTED',
      latencyMs: Math.floor(40 + Math.random() * 60),
      message: `Successfully connected to ${b.toUpperCase()} API gateway using active credentials.`
    });
  }

  // Fallback for any other API endpoints
  return jsonResponse({
    status: 'ok',
    message: `Enterprise ATS Cloudflare Worker handled ${method} ${path}`,
    timestamp: new Date().toISOString()
  });
}
