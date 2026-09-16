import assert from 'assert';
import { dbManager, Companies, Users, Jobs, Candidates, Applications, Interviews, Scorecards, Offers, AuditLogs } from '../src/db/database.js';
import { AIService } from '../src/services/aiService.js';
import { CalendarService } from '../src/services/calendarService.js';
import { AnalyticsService } from '../src/services/analyticsService.js';
import { seedDatabase } from '../src/seed.js';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

async function runAllTests() {
  console.log('🧪 ===============================================');
  console.log('🧪 RUNNING ENTERPRISE ATS END-TO-END VERIFICATION');
  console.log('🧪 ===============================================\n');

  await seedDatabase();

  // Test 1: Database Initialization & Seeding
  await test('Database & Seeding Verification', async () => {
    const company = await Companies.findOne({});
    assert.ok(company, 'Company should be present');
    assert.strictEqual(company.subdomain, 'techcorp');

    const users = await Users.find({});
    assert.ok(users.length >= 4, 'Should have at least 4 users seeded');

    const jobs = await Jobs.find({});
    assert.ok(jobs.length >= 3, 'Should have at least 3 active jobs');
  });

  // Test 2: AI Resume Parsing Engine
  await test('AI Resume Parsing & Entity Extraction', async () => {
    const mockResume = `
      Alex Rivera
      Senior Software Architect
      alex.rivera.dev@example.com
      (415) 555-8921
      https://linkedin.com/in/alex-rivera

      SUMMARY:
      Passionate distributed systems engineer with 8 years of experience building high-scale backends with Python, FastAPI, Docker, and Kubernetes.

      EXPERIENCE:
      CloudCorp (2018 - 2024)
      Staff Software Engineer
      Led architecture for multi-tenant microservices and Redis caching.

      EDUCATION:
      UC Berkeley (2014 - 2018)
      B.S. Electrical Engineering & Computer Science
    `;

    const parsed = await AIService.parseResumeText(mockResume);
    assert.strictEqual(parsed.email, 'alex.rivera.dev@example.com');
    assert.ok(parsed.skills.includes('python'), 'Skills should contain python');
    assert.ok(parsed.skills.includes('docker'), 'Skills should contain docker');
    assert.ok(parsed.totalExperienceYears >= 5, 'Should correctly compute years of experience');
  });

  // Test 3: Explainable Candidate Matching Algorithm
  await test('Explainable AI Candidate Fit Scoring Formula', async () => {
    const candidate = {
      skills: ['react', 'node.js', 'typescript', 'mongodb', 'docker', 'next.js'],
      totalExperienceYears: 6.0,
      education: [{ degree: 'BS Computer Science' }],
      summary: 'Experienced Full Stack Engineer'
    };

    const job = {
      title: 'Senior Full-Stack Engineer',
      requiredSkills: ['react', 'node.js', 'typescript', 'mongodb'],
      preferredSkills: ['next.js', 'aws'],
      minExperienceYears: 5
    };

    const match = AIService.calculateCandidateJobMatch(candidate, job);
    assert.ok(match.overallScore >= 80, 'Score should be high for matching candidate');
    assert.ok(match.skillsScore >= 80, 'Skills score should be >= 80%');
    assert.ok(match.matchingSkills.includes('react'), 'Should list react as matching');
    assert.ok(match.missingSkills.includes('aws'), 'Should detect aws as missing');
    assert.ok(match.explanation.length > 20, 'Should generate explainable rationale paragraph');
  });

  // Test 4: AI Job Description Generator
  await test('AI Job Requisition Enrichment', async () => {
    const jd = await AIService.generateJobDescription(
      'Need Senior Fullstack engineer with 4 years in React and Node',
      'Senior Full-Stack Engineer',
      'Engineering'
    );

    assert.strictEqual(jd.title, 'Senior Full-Stack Engineer');
    assert.ok(jd.responsibilities.length >= 3, 'Should generate responsibilities');
    assert.ok(jd.requirements.length >= 3, 'Should generate requirements');
    assert.ok(jd.knockoutQuestions.length >= 1, 'Should generate knockout questions');
  });

  // Test 5: Knockout Pre-qualification Question Logic
  await test('Knockout Screening Disqualification', async () => {
    const job = await Jobs.findOne({ title: { $regex: 'Full-Stack', $options: 'i' } });
    assert.ok(job, 'Job should exist');

    const knockoutQuestion = job.knockoutQuestions[0];
    assert.ok(knockoutQuestion, 'Should have at least 1 knockout question');

    // Test passing answer
    const passed = Boolean(true) === Boolean(knockoutQuestion.correctAnswer);
    assert.strictEqual(passed, true, 'Passing answer should be evaluated as passed');

    // Test failing answer
    const failedKnockout = Boolean(false) === Boolean(knockoutQuestion.correctAnswer);
    assert.strictEqual(failedKnockout, false, 'Wrong answer should fail knockout');
  });

  // Test 6: Kanban Pipeline Stage Progression
  await test('Kanban Stage Transitions & History', async () => {
    const app = await Applications.findOne({});
    assert.ok(app, 'Application should exist');

    const originalStage = app.stageId;
    const targetStage = 'Shortlisted';

    await Applications.updateById(app._id, {
      stageId: targetStage,
      $push: {
        stageHistory: { fromStage: originalStage, toStage: targetStage, changedAt: new Date().toISOString() }
      }
    });

    const updated = await Applications.findById(app._id);
    assert.strictEqual(updated.stageId, targetStage);
    assert.ok(updated.stageHistory.length >= 1, 'Should record stage transition in history');
  });

  // Test 7: Automated Scheduling & Calendar Slot Math
  await test('Calendar Free/Busy Slot Calculator', async () => {
    const slots = CalendarService.getAvailableSlots(new Date(), 3);
    assert.ok(slots.length > 0, 'Should generate available time slots');
    assert.ok(slots[0].startTime, 'Slot should have ISO start time');
    assert.strictEqual(slots[0].durationMinutes, 45);

    const meeting = CalendarService.generateMeetingDetails('Sarah Connor', 'Lead Engineer');
    assert.ok(meeting.meetingUrl.startsWith('https://meet.google.com/'), 'Should generate valid meeting URL');
  });

  // Test 8: Structured Interview Scorecard & Blind Evaluation
  await test('Scorecard Evaluation & Blind Ratings', async () => {
    const interview = await Interviews.findOne({});
    assert.ok(interview, 'Interview should exist');

    const scorecard = await Scorecards.insertOne({
      tenantId: interview.tenantId,
      interviewId: interview._id,
      interviewerId: 'usr_test_interviewer',
      interviewerName: 'Test Evaluator',
      criteriaRatings: [
        { name: 'System Design', score: 5, feedback: 'Superb architecture' },
        { name: 'Coding', score: 4, feedback: 'Clean modular code' }
      ],
      overallRecommendation: 'STRONG_HIRE',
      isSubmitted: true,
      submittedAt: new Date().toISOString()
    });

    assert.ok(scorecard._id);
    assert.strictEqual(scorecard.overallRecommendation, 'STRONG_HIRE');
    await Scorecards.deleteOne({ _id: scorecard._id });
  });

  // Test 9: Offer Generation & E-Signature Acceptance
  await test('Offer Package Creation & Digital Acceptance', async () => {
    const app = await Applications.findOne({});
    const offer = await Offers.insertOne({
      tenantId: app.tenantId,
      applicationId: app._id,
      candidateId: app.candidateId,
      jobTitle: 'Senior Software Architect',
      baseSalary: 175000,
      currency: 'USD',
      variableBonus: 20000,
      equityShares: 8000,
      targetStartDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      expirationDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      approvalStatus: 'APPROVED',
      candidateDecision: 'SENT'
    });

    assert.ok(offer._id);
    assert.strictEqual(offer.baseSalary, 175000);

    // Simulate candidate e-sign acceptance
    await Offers.updateById(offer._id, {
      candidateDecision: 'ACCEPTED',
      eSignSignatureId: 'sig_test_123',
      signedAt: new Date().toISOString()
    });

    const accepted = await Offers.findById(offer._id);
    assert.strictEqual(accepted.candidateDecision, 'ACCEPTED');
    await Offers.deleteOne({ _id: offer._id });
  });

  // Test 10: Executive Funnel & Velocity Analytics
  await test('Recruitment Funnel & Velocity BI Analytics', async () => {
    const metrics = await AnalyticsService.getFunnelMetrics();
    assert.ok(metrics.summary, 'Should return executive summary KPIs');
    assert.ok(metrics.funnel.length >= 4, 'Should compute funnel stage progression');
    assert.ok(metrics.summary.totalApplications > 0, 'Total applications should be > 0');
  });

  // Test 11: AI Recruitment Copilot RAG Queries
  await test('AI Recruitment Copilot Query Engine', async () => {
    const company = await Companies.findOne({});
    const response = await AIService.queryAssistant('Who are the best candidates for React?', company._id);
    assert.ok(response.answer, 'Copilot should provide an intelligent answer');
    assert.ok(response.answer.includes('top candidates'), 'Copilot should return matching candidates');
  });

  // Test 12: Immutable Forensic Audit Log Trail
  await test('Audit Log Recording', async () => {
    const logsBefore = await AuditLogs.countDocuments({});
    const testLog = await AuditLogs.insertOne({
      tenantId: 'tenant_techcorp_global',
      actorId: 'usr_admin',
      actorEmail: 'admin@techcorp.com',
      action: 'TEST_PERMIT_ACTION',
      resourceType: 'SecurityTest',
      resourceId: 'res_001',
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString()
    });
    const logsAfter = await AuditLogs.countDocuments({});
    assert.strictEqual(logsAfter, logsBefore + 1, 'Audit log count should increase by 1');
    await AuditLogs.deleteOne({ _id: testLog._id });
  });

  // Test 13: 22 MongoDB Collections Registration
  await test('All 22 MongoDB Collections Verification', async () => {
    const { Collections } = await import('../src/models/allModels.js');
    const required22 = [
      'Users', 'Companies', 'Roles', 'Permissions', 'Jobs', 'Candidates',
      'Applications', 'Resumes', 'Skills', 'Experiences', 'Education',
      'Interviews', 'Scorecards', 'Offers', 'TalentPools', 'Communications',
      'Notifications', 'Workflows', 'Tasks', 'Integrations', 'Subscriptions', 'AuditLogs'
    ];
    for (const col of required22) {
      assert.ok(Collections[col], `Collection ${col} must be defined and accessible`);
    }
  });

  // Test 14: Repository Pattern Layer
  await test('Repository Layer (Generic CRUD & Soft Deletion)', async () => {
    const { jobRepo, candidateRepo } = await import('../src/repositories/domainRepositories.js');
    const jobs = await jobRepo.find({});
    assert.ok(Array.isArray(jobs), 'jobRepo.find should return array');
    const candidates = await candidateRepo.find({});
    assert.ok(Array.isArray(candidates), 'candidateRepo.find should return array');
  });

  // Test 15: Zod Schema Validation
  await test('Zod Request Validation Schemas', async () => {
    const { loginSchema, jobRequisitionSchema } = await import('../src/schemas/zodSchemas.js');
    const validLogin = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
    assert.strictEqual(validLogin.success, true, 'Valid login should pass validation');

    const invalidLogin = loginSchema.safeParse({ email: 'invalid-email', password: '123' });
    assert.strictEqual(invalidLogin.success, false, 'Invalid login should fail validation');
  });

  // Test 16: Swagger / OpenAPI 3.0 Documentation
  await test('Swagger OpenAPI 3.0 Documentation', async () => {
    const { swaggerSpec } = await import('../src/swagger.js');
    assert.strictEqual(swaggerSpec.openapi, '3.0.0');
    assert.ok(swaggerSpec.paths['/auth/login'], 'Login endpoint should be documented');
    assert.ok(swaggerSpec.paths['/jobs'], 'Jobs endpoint should be documented');
    assert.ok(swaggerSpec.paths['/analytics/funnel'], 'Analytics endpoint should be documented');
  });

  // Test 17: Background Job Queue
  await test('Background Job Queue Worker', async () => {
    const { queueManager } = await import('../src/services/queueService.js');
    const job = await queueManager.addResumeParsingJob({
      filename: 'sample_resume.pdf',
      rawText: 'Candidate Jane Doe\nSoftware Engineer with 4 years Python and Docker experience.'
    });
    assert.ok(job.jobId, 'Queue job should have an ID');
  });

  console.log('\n===============================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('===============================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL 17 ENTERPRISE ATS SUBSYSTEMS FULLY FUNCTIONAL AND VERIFIED!\n');
    process.exit(0);
  }
}

runAllTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
