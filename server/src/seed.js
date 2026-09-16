import bcrypt from 'bcryptjs';
import {
  Companies,
  Users,
  Jobs,
  Candidates,
  Applications,
  Interviews,
  Scorecards,
  Offers,
  TalentPools,
  AuditLogs,
  dbManager
} from './db/database.js';
import { AIService } from './services/aiService.js';

export const TEST_CREDENTIALS = [
  {
    role: 'SUPER_ADMIN',
    name: 'Marcus Vance',
    email: 'superadmin@enterprise-ats.io',
    password: 'SuperAdmin@2026',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    description: 'Platform Owner: Full access to all tenant fleets, global subscriptions & system metrics.'
  },
  {
    role: 'COMPANY_ADMIN',
    name: 'Sarah Connor',
    email: 'admin@techcorp.com',
    password: 'Admin@2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    description: 'Tenant Administrator: Company branding, departments, user RBAC, and audit logs.'
  },
  {
    role: 'RECRUITER',
    name: 'Alex Morgan',
    email: 'recruiter@techcorp.com',
    password: 'Recruiter@2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Talent Acquisition Lead: Job requisitions, Kanban pipeline, candidate CRM, and offer drafting.'
  },
  {
    role: 'HIRING_MANAGER',
    name: 'David Chen',
    email: 'manager@techcorp.com',
    password: 'Manager@2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: 'Engineering Director: Shortlisting review, scorecard review, and offer sign-offs.'
  },
  {
    role: 'INTERVIEWER',
    name: 'Elena Rostova',
    email: 'interviewer@techcorp.com',
    password: 'Interviewer@2026',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    description: 'Technical Lead: Scheduled interviews, Google Meet links, and blind 1-5 scorecards.'
  },
  {
    role: 'AGENCY_PARTNER',
    name: 'Jessica Reed',
    email: 'agency@apexrecruiting.com',
    password: 'Agency@2026',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    description: 'External Headhunter: Submit candidates to assigned requisitions with duplicate prevention.'
  },
  {
    role: 'CANDIDATE',
    name: 'Jordan Miller',
    email: 'candidate@example.com',
    password: 'Candidate@2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    description: 'Job Applicant: Application tracking, self-scheduling slot picker, digital offer sign-off.'
  }
];

export async function seedDatabase() {
  await dbManager.init();

  let company = await Companies.findOne({});
  if (!company) {
    company = await Companies.insertOne({
      name: 'TechCorp Global Solutions',
      subdomain: 'techcorp',
      branding: {
        primaryColor: '#2563EB',
        accentColor: '#10B981',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60'
      },
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        retentionDays: 365
      }
    });
  }

  const tenantId = company._id;

  // Seed or update all 7 user roles with clean credentials
  for (const cred of TEST_CREDENTIALS) {
    const existing = await Users.findOne({ email: cred.email });
    const passwordHash = await bcrypt.hash(cred.password, 10);
    const [firstName, ...lastParts] = cred.name.split(' ');
    const lastName = lastParts.join(' ');

    if (!existing) {
      await Users.insertOne({
        tenantId,
        firstName,
        lastName,
        email: cred.email,
        passwordHash,
        plainPasswordForDemo: cred.password,
        role: cred.role,
        avatarUrl: cred.avatar,
        isActive: true
      });
    } else {
      await Users.updateById(existing._id, {
        passwordHash,
        plainPasswordForDemo: cred.password,
        role: cred.role,
        avatarUrl: cred.avatar
      });
    }
  }

  // Seed default jobs if none exist
  const existingJob = await Jobs.findOne({});
  if (!existingJob) {
    const recruiterUser = await Users.findOne({ role: 'RECRUITER' });
    const managerUser = await Users.findOne({ role: 'HIRING_MANAGER' });

    await Jobs.insertOne({
      tenantId,
      title: 'Senior Full-Stack Engineer (React / Node.js)',
      departmentId: 'Engineering',
      locationId: 'San Francisco, CA (Hybrid)',
      workplaceType: 'HYBRID',
      employmentType: 'FULL_TIME',
      hiringManagerId: managerUser ? managerUser._id : 'usr_manager',
      recruiterId: recruiterUser ? recruiterUser._id : 'usr_recruiter',
      minExperienceYears: 5,
      requiredSkills: ['react', 'node.js', 'typescript', 'mongodb', 'docker'],
      preferredSkills: ['next.js', 'aws', 'graphql'],
      salaryRange: { min: 145000, max: 185000, currency: 'USD', isPublic: true },
      descriptionHtml: '<p>Lead end-to-end development of customer-facing React & Node.js features.</p>',
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString()
    });

    await Jobs.insertOne({
      tenantId,
      title: 'Senior AI / NLP Engineer (Python & LLMs)',
      departmentId: 'AI & Data Intelligence',
      locationId: 'New York, NY (Remote)',
      workplaceType: 'REMOTE',
      employmentType: 'FULL_TIME',
      hiringManagerId: managerUser ? managerUser._id : 'usr_manager',
      recruiterId: recruiterUser ? recruiterUser._id : 'usr_recruiter',
      minExperienceYears: 4,
      requiredSkills: ['python', 'fastapi', 'nlp', 'llm', 'pytorch', 'docker'],
      preferredSkills: ['langchain', 'vector search', 'spacy'],
      salaryRange: { min: 160000, max: 210000, currency: 'USD', isPublic: true },
      descriptionHtml: '<p>Build next-generation resume intelligence, vector matching, and copilots.</p>',
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString()
    });
  }

  console.log('✅ Enterprise ATS Database verified with 7 distinct role credentials.');
}

if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
}
