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
      email: body.email || 'recruiter@techcorp.com',
      role: 'RECRUITER',
      tenantId: 'tenant_techcorp_global'
    };
    return jsonResponse({
      token: 'jwt_mock_token_' + Date.now(),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    });
  }

  // 2. JOBS
  if (path === '/jobs') {
    if (method === 'GET') return jsonResponse(db.jobs || []);
    if (method === 'POST') {
      const newJob = {
        _id: 'job_' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'PUBLISHED',
        ...body
      };
      db.jobs.unshift(newJob);
      return jsonResponse(newJob, 201);
    }
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

  // 8. ANALYTICS
  if (path === '/analytics/funnel') {
    return jsonResponse({
      applied: 248,
      screening: 142,
      interview: 52,
      offer: 18,
      hired: 14,
      velocityDays: 13.8,
      offerAcceptanceRate: 88.9
    });
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
      if (promptLower.includes('shortlist') || promptLower.includes('verahire') || promptLower.includes('rank')) {
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

  // Fallback for any other API endpoints
  return jsonResponse({
    status: 'ok',
    message: `Enterprise ATS Cloudflare Worker handled ${method} ${path}`,
    timestamp: new Date().toISOString()
  });
}
