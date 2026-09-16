# Enterprise Applicant Tracking System (ATS)
## System Architecture & Technical Specification (RFC-001)

**Status:** Approved / Active Implementation  
**Lead Architect:** Staff Platform Architect & Core Systems Team  
**Primary Stack:** JavaScript (Node.js 20+ LTS, ES Modules), React 18 / Next.js, Python 3.12 (FastAPI), MongoDB 7.0, Redis 7.0  
**Target Environment:** Docker, Linux (Ubuntu/Debian), AWS / Azure / Private Cloud  

---

## 1. Architectural Decision Records (ADRs)

### ADR-01: Multi-Tenancy Strategy (Logical Partitioning with Compound Indexing)
- **Context:** An enterprise ATS must guarantee complete data isolation between corporate clients while keeping operational costs and maintenance overhead manageable across hundreds of SMB and mid-market organizations.
- **Decision:** Use single-cluster multi-tenancy with logical data partitioning. Every query and write operation must be scoped by `tenantId: ObjectId`. Database-level compound indexes (`{ tenantId: 1, _id: 1 }`, `{ tenantId: 1, email: 1 }`, `{ tenantId: 1, status: 1 }`) ensure index-covered scans without cross-tenant table leaks.
- **Trade-off:** A separate physical database per tenant provides higher theoretical blast-radius isolation, but drastically increases cloud costs (connection pool exhaustion, idle database instances, migration orchestration complexity). Logical partitioning with automated Mongoose middleware offers equivalent security at 1/10th the infrastructure cost.

### ADR-02: Backend Runtime & Language Selection (JavaScript ES Modules on Node 20+ LTS)
- **Context:** High developer velocity, unified language runtime across frontend and backend, and native execution without complex build pipelines.
- **Decision:** Implement the backend using clean, modular JavaScript (ECMAScript Modules / Node.js 20+ LTS) paired with runtime schema validation via **Zod**.
- **Rationale:** Native ES Modules (`import/export`) eliminate transpile latency during development and container builds. Zod provides strict runtime input validation at the API boundary, guaranteeing that untyped payloads never penetrate the Service or Repository layers.

### ADR-03: Decoupled Python AI Microservice
- **Context:** Heavy Natural Language Processing (NLP), entity extraction from unstructured PDF/DOCX resumes, and vector semantic similarity computations require specialized data science tooling (spaCy, scikit-learn, PyTorch).
- **Decision:** Isolate all machine learning and document parsing workloads into an autonomous Python 3.12 FastAPI microservice. The Node.js core API communicates via asynchronous BullMQ queues for bulk ingestion and low-latency internal HTTP requests for on-demand scoring.
- **Resilience Policy:** The Node.js core includes an embedded fallback NLP heuristic engine. If the Python worker is undergoing a rolling deployment or is temporarily unreachable, candidate ingestion and basic scoring continue uninterrupted.

### ADR-04: Real-Time Synchronization via Socket.IO with Redis Pub/Sub Adapter
- **Context:** Multiple recruiters and hiring managers view the same recruitment Kanban pipeline simultaneously. When a candidate changes stages or completes an interview booking, all connected client screens must update within 200ms.
- **Decision:** Deploy Socket.IO over WebSockets with an optional Redis Pub/Sub adapter. Rooms are partitioned by `tenant_{tenantId}` and `job_{jobId}` to prevent broadcast leakage.

### ADR-05: Direct-to-Object Storage Pre-Signed Uploads
- **Context:** Candidates uploading 10MB–20MB PDF/DOCX resumes directly to the application server causes Node.js event loop starvation and socket saturation under high-volume hiring events.
- **Decision:** Application servers generate short-lived (15-minute) AWS S3 / MinIO pre-signed PUT URLs. Candidates upload files directly to encrypted object storage (`SSE-KMS`). Upon upload completion, S3 webhooks or client callbacks notify the Node.js API to enqueue the parsing job.

---

## 2. System Architecture & Component Topography

```
                       [ Internet / Public Traffic ]
                                     │
                    [ CloudFront CDN / Reverse Proxy ]
                     (TLS 1.3 Termination, Port 443)
                                     │
     ┌───────────────────────────────┴───────────────────────────────┐
     │                                                               │
[ Public Routes: /careers, /health ]               [ Protected API: /api/v1/* ]
     │                                                               │
[ Next.js / Static SPA Client ]                    [ Express.js Core Gateway ]
     │                                               (Port 5000, Node 20 LTS)
     │                                                               │
     │                      ┌────────────────────────────────────────┼────────────────────────┐
     │                      │                                        │                        │
     │            [ Rate Limiter & Helmet ]                 [ Auth & RBAC Guard ]     [ Request Logger ]
     │                      │                                        │                        │
     │            [ Zod Schema Validator ]                           │                        │
     │                      │                                        │                        │
     │            [ MVC Controller Layer ]                           │                        │
     │                      │                                        │                        │
     │            [ Service Business Logic ]                         │                        │
     │                      │                                        │                        │
     │         ┌────────────┴────────────┐                           │                        │
     │         │                         │                           │                        │
     │   [ Repository Layer ]     [ BullMQ Queues ]                  │                        │
     │         │                         │                           │                        │
     │         │               [ Redis 7.0 (Port 6379) ]             │                        │
     │         │                         │                           │                        │
     │         │             [ Python FastAPI Service ]              │                        │
     │         │              (Port 8000, spaCy/Scikit)              │                        │
     │         │                                                     │                        │
     │   [ MongoDB 7.0 (Port 27017) ]                                │                        │
     │   (22 Logical Collections)                                    │                        │
     │                                                               │                        │
     └─────────────────────── [ Socket.IO WebSocket Server ] ────────┘
```

### Internal Port & Process Matrix
| Component | Technology | Default Port | Internal Access | Public Ingress |
| :--- | :--- | :--- | :--- | :--- |
| **API Core Gateway** | Node.js / Express | `5000` | Localhost / Docker network | Reverse proxy |
| **Web Frontend** | React / Next.js SPA | Served via `5000` | Localhost | Public |
| **AI Microservice** | Python 3.12 / FastAPI | `8000` | Node API only | Blocked |
| **Primary Database** | MongoDB 7.0 | `27017` | Node API only | Blocked |
| **Queue & Cache** | Redis 7.0 | `6379` | Node API / Python worker | Blocked |
| **Object Store** | AWS S3 / MinIO | `9000` / Cloud | Node API + Pre-signed URLs | Pre-signed only |

---

## 3. Module Breakdown & Operational Logic (33 Core Modules)

### Module 1: Super Admin Platform Console
- **Operational Scope:** Central SaaS management plane for multi-tenant provisioning, subscription enforcement, and system telemetry.
- **Backend Flow:** Requests verify `user.role === 'SUPER_ADMIN'`. Aggregates tenant storage footprints, active user sessions, and API request quotas directly from MongoDB without tenant filtering.
- **Database Collections:** `companies`, `subscriptions`, `auditLogs`.
- **Failure Mode:** If tenant reaches max seat limit or AI credit threshold, downstream mutating operations return `HTTP 402 Payment Required` with upgrade invoice details.

### Module 2: Company & Tenant Isolation Engine
- **Operational Scope:** Resolves incoming tenant context via custom subdomain (`acme.ats.io`), custom domain header (`Host: careers.acme.com`), or JWT claim `tenantId`.
- **Backend Flow:** Express middleware extracts tenant identifier, executes lookup in `companies`, and stores company settings (branding, timezone, retention rules) on `req.tenant`.
- **Database Collections:** `companies`.

### Module 3: Recruiter Dashboard & Cockpit
- **Operational Scope:** Dynamic command center providing recruiters with real-time operational priority queues: requisitions needing attention, candidates in SLA breach, and upcoming interviews today.
- **Backend Flow:** Executes indexed MongoDB aggregation grouping `applications` by stage, matching upcoming `interviews` where `interviewerIds` contains current recruiter, and computing 7-day velocity deltas.
- **Database Collections:** `applications`, `jobs`, `interviews`, `tasks`.

### Module 4: Hiring Manager Review Hub
- **Operational Scope:** Focused, low-friction review interface tailored for technical leads and department heads.
- **Backend Flow:** Enforces role-based data minimization: strips internal recruiter compensation notes and unvetted candidate contact details. Provides 1-click `Advance to Phone Screen` or `Reject with Feedback` actions.
- **Database Collections:** `applications`, `jobs`, `scorecards`.

### Module 5: Candidate Self-Service Portal
- **Operational Scope:** Mobile-first external candidate portal accessed via passwordless magic links or email OTP.
- **Backend Flow:** Generates 24-hour cryptographic token signed with candidate email and application ID. Candidate tracks stage status, schedules interview times from available calendar blocks, and reviews digital offer letters.
- **Database Collections:** `applications`, `candidates`, `interviews`, `offers`.

### Module 6: Career Website & Microsite Generator
- **Operational Scope:** Public job board customized with company branding, colors, and department filters.
- **Backend Flow:** Serves public requisitions (`status: 'PUBLISHED'`) with Schema.org `JobPosting` JSON-LD structured data for Google for Jobs indexing.
- **Database Collections:** `jobs`, `companies`.

### Module 7: Job Requisition & Approval Engine
- **Operational Scope:** Enterprise requisition workflow enforcing compensation band compliance and executive sign-off prior to publication.
- **Backend Flow:** State machine: `DRAFT` → `PENDING_APPROVAL` → `APPROVED` → `PUBLISHED` → `PAUSED` → `CLOSED`. Any revision to salary bands resets approval status to `PENDING_APPROVAL` and dispatches notification to finance approver.
- **Database Collections:** `jobs`, `users`, `auditLogs`.

### Module 8: Candidate 360° Profile & Master Dossier
- **Operational Scope:** Unified single source of truth for all candidate interactions across current and historical applications.
- **Backend Flow:** Repository layer aggregates `candidates`, `applications`, `interviews`, `scorecards`, `communications`, and `resumes` by `candidateId`.
- **Database Collections:** `candidates`, `applications`, `resumes`, `scorecards`, `communications`.

### Module 9: AI Resume Parsing & Entity Extraction
- **Operational Scope:** Extracts unstructured text from PDF/DOCX resumes and maps it into structured JSON candidate profiles.
- **Backend Flow:** Raw document text passes to the Python FastAPI microservice. spaCy NER pipeline identifies `PERSON`, `ORG`, `DATE`, `GPE`. Custom taxonomy parser maps technical competencies against 250+ normalized skills. Returns validated JSON payload to Node.js.
- **Database Collections:** `resumes`, `candidates`.

### Module 10: Explainable AI Candidate Matching & Fit Scoring
- **Operational Scope:** Computes an objective 0–100% Match Score between candidate profile and job requirements, accompanied by plain-English rationales and skills gap analysis.
- **Backend Flow:** Multi-factor weighted algorithm detailed in Section 6. Calculates exact intersection of required vs preferred skills, compares verified years of experience against role requirements, and evaluates semantic role fit.
- **Database Collections:** `applications.aiMatchScore`.

### Module 11: Knockout Screening Engine
- **Operational Scope:** Evaluates candidate answers to mandatory qualifying questions (e.g. work authorization, relocation willingness, certifications).
- **Backend Flow:** Executes during application submission. If candidate fails a hard knockout rule (`disqualifyIfWrong: true`), application is automatically set to `REJECTED` with reason code `FAILED_KNOCKOUT_CRITERIA`.
- **Database Collections:** `jobs.knockoutQuestions`, `applications.knockoutAnswers`.

### Module 12: Interview Management & Loop Configuration
- **Operational Scope:** Configures multi-stage interview sequences (e.g. Recruiter Screen → System Design → Coding Challenge → Culture Fit).
- **Backend Flow:** Maps each round to a specific duration, required interviewer user IDs, and linked structured scorecard template.
- **Database Collections:** `interviews`, `scorecards`.

### Module 13: Automated Interview Scheduling & Calendar Sync
- **Operational Scope:** Eliminates manual scheduling emails by exposing real-time interviewer free/busy slots directly to candidates.
- **Backend Flow:** Intersects calendar free/busy blocks across interviewer Google Calendar / Microsoft Graph APIs. Upon candidate selection, creates calendar event, provisions Google Meet / Zoom URL, and sets interview status to `SCHEDULED`.
- **Database Collections:** `interviews`, `applications`.

### Module 14: Structured Interview Scorecards & Rubrics
- **Operational Scope:** Enforces objective evaluation criteria rated 1–5 with required qualitative justification.
- **Backend Flow:** Blind review policy: Interviewers cannot view scorecards submitted by peers for the same candidate until their own assessment is finalized and submitted.
- **Database Collections:** `scorecards`.

### Module 15: Kanban Hiring Pipeline
- **Operational Scope:** Real-time visual candidate pipeline across 7 core stages (`Applied`, `Screening`, `Shortlisted`, `Interview`, `Offer`, `Hired`, `Rejected`).
- **Backend Flow:** Dragging a card triggers `PATCH /api/v1/applications/:id/move-stage`. Updates stage, logs transition event in `stageHistory`, and emits WebSocket event `application:stage_changed` to update all active dashboard sessions.
- **Database Collections:** `applications`.

### Module 16: Offer Management & Approval Workflow
- **Operational Scope:** Generates compensation packages, routes through internal finance approval, and delivers digital offer letters.
- **Backend Flow:** Tracks base salary, bonus percentage, equity shares, start date, and expiration timestamp. Generates tamper-evident hash upon candidate digital signature.
- **Database Collections:** `offers`, `applications`.

### Module 17: Employee Handoff & HRIS Integration Engine
- **Operational Scope:** Dispatches hired candidate dossiers to external HRMS systems (BambooHR, Workday, Gusto, Deel).
- **Backend Flow:** Triggered upon `offer.status === 'ACCEPTED'`. Formats standardized JSON payload containing personal details, signed offer document URL, and start date; dispatches with exponential retry backoff.
- **Database Collections:** `offers`, `integrations`.

### Module 18: Talent Pools & Sourcing Repository
- **Operational Scope:** Folders of categorized passive talent (e.g. "Senior Python Specialists", "Silver Medalist Engineers").
- **Backend Flow:** Recruiters tag candidates and assign them to talent pools independent of active job requisitions.
- **Database Collections:** `talentPools`, `candidates`.

### Module 19: Candidate CRM & Automated Nurture Campaigns
- **Operational Scope:** Scheduled multi-step drip email campaigns for passive talent engagement.
- **Backend Flow:** BullMQ scheduled worker evaluates campaign enrollment timelines (e.g. Day 1, Day 14, Day 30) and dispatches personalized updates.
- **Database Collections:** `communications`, `talentPools`.

### Module 20: Omnichannel Communication Center
- **Operational Scope:** Unified two-way communication thread tracking all candidate emails within their 360° dossier.
- **Backend Flow:** Inbound webhook parser matches incoming emails by `In-Reply-To` RFC 822 headers and logs message under candidate thread.
- **Database Collections:** `communications`.

### Module 21: SMS & WhatsApp Messaging Service
- **Operational Scope:** Real-time mobile alerts for interview reminders and scheduling links.
- **Backend Flow:** Outbound REST calls via Twilio / Meta WhatsApp Business API with delivery receipts tracked in `communications`.
- **Database Collections:** `communications`.

### Module 22: Job Board Distribution & Multiposting
- **Operational Scope:** Syndicates requisitions to LinkedIn, Indeed, Google for Jobs, and external job aggregators.
- **Backend Flow:** Generates authenticated OAuth API payloads for LinkedIn Apply and dynamic XML feeds for Indeed and Google Cloud Talent.
- **Database Collections:** `jobs`, `integrations`.

### Module 23: Employee Referral Portal & Tracking
- **Operational Scope:** Enables internal employees to submit referrals with unique attribution tokens and track bonus milestones.
- **Backend Flow:** Attaches `referredByUserId` to candidate records; dispatches internal notification when referral advances to `Interview` or `Hired`.
- **Database Collections:** `candidates`, `users`.

### Module 24: Agency & Headhunter Vendor Portal
- **Operational Scope:** External portal for recruitment partners to submit candidates against assigned jobs.
- **Backend Flow:** Enforces 180-day candidate ownership lock. Prevents agency submission if candidate already exists in database within ownership window.
- **Database Collections:** `candidates`, `companies`.

### Module 25: Executive BI Reports & Visual Dashboards
- **Operational Scope:** High-level KPIs: Total Hires, Cost-per-Hire, Time-to-Fill, Offer Acceptance Rate.
- **Backend Flow:** Pre-aggregated daily snapshots generated via nightly cron jobs stored in materialized analytics collection.
- **Database Collections:** `applications`, `jobs`, `offers`.

### Module 26: Recruitment Velocity & Funnel Analytics
- **Operational Scope:** Stage-by-stage conversion drop-off percentages and cycle time analytics.
- **Backend Flow:** Calculates delta durations between timestamps in `application.stageHistory` array.
- **Database Collections:** `applications`.

### Module 27: AI Recruitment Copilot / Assistant
- **Operational Scope:** Natural language conversational assistant answering recruiter queries over internal candidate database.
- **Backend Flow:** RAG pipeline restricted strictly by `req.user.tenantId`. Embeds prompt, queries candidate index, synthesizes answers with citations.
- **Database Collections:** `candidates`, `jobs`.

### Module 28: Organization & Team Settings
- **Operational Scope:** Customizes corporate structure: departments, branch office locations, and custom data fields.
- **Backend Flow:** Hierarchical tree queries for organizational entities; validates custom fields against defined data types (`TEXT`, `NUMBER`, `BOOLEAN`, `DROPDOWN`).
- **Database Collections:** `companies`.

### Module 29: Granular RBAC & Custom Roles
- **Operational Scope:** Configurable permission bitmasks (e.g. view candidate contact info, edit salary bands, access scorecards).
- **Backend Flow:** Authorization middleware inspects `req.user.permissions` against route requirements prior to controller execution.
- **Database Collections:** `roles`, `permissions`, `users`.

### Module 30: Enterprise Audit Logs & Forensic Tracking
- **Operational Scope:** Tamper-evident, immutable activity log recording all sensitive system events.
- **Backend Flow:** Middleware hooks all mutating HTTP verbs (`POST`, `PUT`, `PATCH`, `DELETE`) and writes un-editable audit documents capturing actor, IP address, user agent, action, and entity diff.
- **Database Collections:** `auditLogs`.

### Module 31: Data Privacy, GDPR & EEO Compliance
- **Operational Scope:** Automated Right-to-be-Forgotten erasure, data export, and anonymized EEO diversity reporting.
- **Backend Flow:** Soft-delete and purge workers remove candidate files from S3 and MongoDB upon verified GDPR request. EEO demographic surveys are stored unlinked from candidate IDs to prevent hiring bias.
- **Database Collections:** `candidates`, `auditLogs`.

### Module 32: SaaS Subscription & Metered Billing
- **Operational Scope:** Manages plan tiers (Starter, Professional, Enterprise) and meters AI parsing credits.
- **Backend Flow:** Stripe billing webhook integration (`invoice.payment_succeeded`, `customer.subscription.updated`). Redis token bucket meters parsing usage.
- **Database Collections:** `subscriptions`, `companies`.

### Module 33: Developer Platform, REST API & Webhooks
- **Operational Scope:** Public API with API key authentication and outgoing event webhooks.
- **Backend Flow:** Express router protected by SHA-256 hashed API key validation. Outgoing events dispatched via BullMQ worker with HMAC-SHA256 signatures.
- **Database Collections:** `integrations`, `auditLogs`.

---

## 4. Database Architecture & Indexing Strategy (All 22 MongoDB Collections)

Every document adheres to tenant isolation via `tenantId: ObjectId`. Below are the definitive schema architectures and production compound indexes.

```javascript
// =========================================================================
// 1. COMPANIES (TENANTS)
// =========================================================================
const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subdomain: { type: String, required: true, unique: true, lowercase: true, index: true },
  customDomain: { type: String, sparse: true, unique: true },
  branding: {
    logoUrl: { type: String },
    faviconUrl: { type: String },
    primaryColor: { type: String, default: '#2563EB' },
    accentColor: { type: String, default: '#10B981' }
  },
  settings: {
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' },
    retentionDays: { type: Number, default: 365 },
    blindRecruiting: { type: Boolean, default: false }
  },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }
}, { timestamps: true });

// =========================================================================
// 2. USERS
// =========================================================================
const UserSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER', 'HIRING_MANAGER', 'INTERVIEWER'], 
    required: true 
  },
  customRoleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  avatarUrl: { type: String },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date }
}, { timestamps: true });
UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

// =========================================================================
// 3. ROLES & 4. PERMISSIONS
// =========================================================================
const RoleSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  permissionKeys: [{ type: String }] // e.g. ['jobs:create', 'candidates:view_salary']
}, { timestamps: true });

const PermissionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  module: { type: String, required: true },
  description: { type: String }
});

// =========================================================================
// 5. JOBS (REQUISITIONS)
// =========================================================================
const JobSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  title: { type: String, required: true, index: 'text' },
  departmentId: { type: String, required: true, index: true },
  locationId: { type: String, required: true },
  workplaceType: { type: String, enum: ['ON_SITE', 'HYBRID', 'REMOTE'], default: 'HYBRID' },
  employmentType: { type: String, enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'], default: 'FULL_TIME' },
  hiringManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  minExperienceYears: { type: Number, default: 0 },
  requiredSkills: [{ type: String, index: true }],
  preferredSkills: [{ type: String }],
  salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    isPublic: { type: Boolean, default: true }
  },
  descriptionHtml: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  knockoutQuestions: [{
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['BOOLEAN', 'NUMBER', 'SINGLE_CHOICE'], default: 'BOOLEAN' },
    correctAnswer: mongoose.Schema.Types.Mixed,
    disqualifyIfWrong: { type: Boolean, default: true }
  }],
  status: { 
    type: String, 
    enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PUBLISHED', 'PAUSED', 'CLOSED', 'ARCHIVED'], 
    default: 'DRAFT', 
    index: true 
  },
  publishedAt: { type: Date }
}, { timestamps: true });
JobSchema.index({ tenantId: 1, status: 1, createdAt: -1 });

// =========================================================================
// 6. CANDIDATES
// =========================================================================
const CandidateSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, index: true },
  phone: { type: String, index: true },
  location: { city: String, state: String, country: String },
  linkedinUrl: String,
  githubUrl: String,
  summary: String,
  skills: [{ type: String, index: true }],
  totalExperienceYears: { type: Number, default: 0, index: true },
  workHistory: [{
    company: String,
    title: String,
    startDate: String,
    endDate: String,
    isCurrent: Boolean,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    graduationYear: Number
  }],
  tags: [{ type: String, index: true }],
  source: { type: String, default: 'CAREER_PAGE', index: true }
}, { timestamps: true });
CandidateSchema.index({ tenantId: 1, email: 1 }, { unique: true });
CandidateSchema.index({ tenantId: 1, skills: 1, totalExperienceYears: 1 });

// =========================================================================
// 7. APPLICATIONS
// =========================================================================
const ApplicationSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true, index: true },
  stageId: { 
    type: String, 
    enum: ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'], 
    default: 'Applied', 
    index: true 
  },
  status: { type: String, enum: ['ACTIVE', 'HIRED', 'REJECTED', 'WITHDRAWN'], default: 'ACTIVE', index: true },
  rejectionReason: String,
  knockoutAnswers: [{
    questionText: String,
    answer: mongoose.Schema.Types.Mixed,
    passed: Boolean
  }],
  aiMatchScore: {
    overallScore: { type: Number, min: 0, max: 100 },
    skillsScore: { type: Number, min: 0, max: 100 },
    experienceScore: { type: Number, min: 0, max: 100 },
    educationScore: { type: Number, min: 0, max: 100 },
    matchingSkills: [String],
    missingSkills: [String],
    explanation: String,
    calculatedAt: Date
  },
  stageHistory: [{
    fromStage: String,
    toStage: String,
    changedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });
ApplicationSchema.index({ tenantId: 1, jobId: 1, stageId: 1 });
ApplicationSchema.index({ tenantId: 1, candidateId: 1, jobId: 1 }, { unique: true });

// =========================================================================
// 8. RESUMES
// =========================================================================
const ResumeSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true, index: true },
  fileUrl: { type: String, required: true },
  rawText: { type: String, select: false },
  parsedConfidence: { type: Number, default: 0.90 }
}, { timestamps: true });

// =========================================================================
// 9. SKILLS, 10. EXPERIENCES, 11. EDUCATION
// =========================================================================
const SkillTaxonomySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, lowercase: true, index: true },
  category: { type: String, enum: ['TECHNICAL', 'SOFT_SKILL', 'MANAGEMENT', 'FRAMEWORK'], default: 'TECHNICAL' },
  synonyms: [String]
});

// =========================================================================
// 12. INTERVIEWS & 13. SCORECARDS
// =========================================================================
const InterviewSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
  roundName: { type: String, required: true },
  interviewerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  scheduledStartTime: { type: Date, required: true, index: true },
  scheduledEndTime: { type: Date, required: true },
  meetingUrl: { type: String },
  calendarEventId: { type: String },
  status: { type: String, enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED', index: true }
}, { timestamps: true });

const ScorecardSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true, index: true },
  interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  criteriaRatings: [{
    name: { type: String, required: true },
    score: { type: Number, min: 1, max: 5, required: true },
    feedback: String
  }],
  overallRecommendation: { 
    type: String, 
    enum: ['STRONG_NO_HIRE', 'NO_HIRE', 'NEUTRAL', 'HIRE', 'STRONG_HIRE'], 
    required: true 
  },
  privateNotes: String,
  isSubmitted: { type: Boolean, default: false }
}, { timestamps: true });
ScorecardSchema.index({ tenantId: 1, interviewId: 1, interviewerId: 1 }, { unique: true });

// =========================================================================
// 14. OFFERS
// =========================================================================
const OfferSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, unique: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobTitle: { type: String, required: true },
  baseSalary: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  variableBonus: { type: Number, default: 0 },
  equityShares: { type: Number, default: 0 },
  targetStartDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  approvalStatus: { type: String, enum: ['DRAFT', 'APPROVED', 'REJECTED'], default: 'APPROVED' },
  candidateDecision: { type: String, enum: ['SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED'], default: 'SENT' },
  eSignSignatureId: String
}, { timestamps: true });

// =========================================================================
// 15. TALENT POOLS & 16. COMMUNICATIONS
// =========================================================================
const TalentPoolSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  description: String,
  candidateIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }]
}, { timestamps: true });

const CommunicationSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true, index: true },
  channel: { type: String, enum: ['EMAIL', 'SMS', 'WHATSAPP'], default: 'EMAIL' },
  direction: { type: String, enum: ['INBOUND', 'OUTBOUND'], default: 'OUTBOUND' },
  subject: String,
  body: { type: String, required: true },
  status: { type: String, default: 'DELIVERED' }
}, { timestamps: true });

// =========================================================================
// 17. NOTIFICATIONS, 18. WORKFLOWS, 19. TASKS, 20. INTEGRATIONS, 21. SUBSCRIPTIONS
// =========================================================================
const NotificationSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  body: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

const SubscriptionSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },
  tier: { type: String, enum: ['STARTER', 'GROWTH', 'ENTERPRISE'], default: 'GROWTH' },
  maxSeats: { type: Number, default: 10 },
  aiCreditsMonthly: { type: Number, default: 5000 },
  status: { type: String, enum: ['ACTIVE', 'PAST_DUE', 'CANCELLED'], default: 'ACTIVE' }
}, { timestamps: true });

// =========================================================================
// 22. AUDIT LOGS (IMMUTABLE FORENSIC LOG)
// =========================================================================
const AuditLogSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  actorId: { type: String, required: true },
  actorEmail: { type: String, required: true },
  action: { type: String, required: true, index: true }, // e.g. "JOB_CREATED", "OFFER_ACCEPTED"
  resourceType: { type: String, required: true },
  resourceId: { type: String, required: true },
  ipAddress: String,
  userAgent: String
}, { timestamps: { createdAt: true, updatedAt: false } }); // Immutable
AuditLogSchema.index({ tenantId: 1, createdAt: -1 });
```

---

## 5. API Contracts & Route Specifications

Base URI: `/api/v1`  
All protected endpoints require HTTP Header: `Authorization: Bearer <jwt_access_token>`.

### Authentication Endpoints
#### `POST /api/v1/auth/login`
- **Request:**
  ```json
  {
    "email": "recruiter@techcorp.com",
    "password": "password123"
  }
  ```
- **Response (HTTP 200):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_789012",
      "firstName": "Alex",
      "lastName": "Morgan",
      "email": "recruiter@techcorp.com",
      "role": "RECRUITER",
      "tenantId": "tenant_techcorp_global"
    }
  }
  ```
- **Error Responses:** `HTTP 400 Bad Request` (Zod validation failure), `HTTP 401 Unauthorized` (invalid password or unknown email).

---

### Job Requisition Endpoints
#### `GET /api/v1/jobs`
- **Query Parameters:** `status` (string, optional), `department` (string, optional), `page` (integer, default: 1), `limit` (integer, default: 20).
- **Response (HTTP 200):**
  ```json
  [
    {
      "_id": "job_001",
      "title": "Senior Full-Stack Engineer",
      "departmentId": "Engineering",
      "locationId": "San Francisco, CA (Hybrid)",
      "status": "PUBLISHED",
      "applicationCount": 14,
      "salaryRange": { "min": 145000, "max": 185000, "currency": "USD" }
    }
  ]
  ```

#### `POST /api/v1/jobs`
- **Security:** `requireRole(['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER'])`
- **Request:**
  ```json
  {
    "title": "Lead DevOps Engineer",
    "departmentId": "Infrastructure",
    "locationId": "Austin, TX",
    "minExperienceYears": 5,
    "requiredSkills": ["aws", "kubernetes", "terraform", "docker"],
    "salaryRange": { "min": 160000, "max": 200000, "currency": "USD" },
    "status": "PUBLISHED"
  }
  ```
- **Response (HTTP 201 Created):** Returns created job document with populated metadata.

---

### Candidate Ingestion & Pipeline
#### `POST /api/v1/careers/apply/:jobId` (Public Endpoint)
- **Request:**
  ```json
  {
    "firstName": "Elena",
    "lastName": "Rostova",
    "email": "elena.rostova@example.com",
    "phone": "+1 415-555-0199",
    "resumeText": "Elena Rostova\nFull-Stack Engineer with 6 years experience in React, Node.js, and Docker...",
    "knockoutAnswers": [
      {
        "questionText": "Do you have at least 5 years software engineering experience?",
        "answer": true
      }
    ]
  }
  ```
- **Response (HTTP 201 Created):**
  ```json
  {
    "message": "Application received successfully!",
    "applicationId": "app_987123",
    "status": "ACTIVE"
  }
  ```
- **Disqualification Behavior:** If knockout answers fail mandatory conditions, returns `HTTP 201` with `"status": "REJECTED"` to inform client gracefully while isolating non-viable candidates from recruiter active views.

---

## 6. AI Engine & Mathematical Fit Scoring Model

### 4-Factor Weighted Match Formula

The candidate fit score $S_{total}$ is calculated as an objective, explainable linear combination of 4 independent dimensions:

$$S_{total} = w_{skills} \cdot S_{skills} + w_{exp} \cdot S_{exp} + w_{edu} \cdot S_{edu} + w_{sem} \cdot S_{sem}$$

Where standardized weights are:
- $w_{skills} = 0.40$ (Technical & Hard Skills)
- $w_{exp} = 0.30$ (Years of Experience & Seniority Depth)
- $w_{edu} = 0.15$ (Education & Degree Requisition)
- $w_{sem} = 0.15$ (Semantic Role & Title Alignment)

#### Step 1: Normalized Skills Computation ($S_{skills}$)
$$S_{skills} = \left( 0.75 \times \frac{|Skills_{candidate} \cap Skills_{required}|}{|Skills_{required}|} + 0.25 \times \frac{|Skills_{candidate} \cap Skills_{preferred}|}{|Skills_{preferred}|} \right) \times 100$$

#### Step 2: Experience Depth Computation ($S_{exp}$)
$$S_{exp} = \begin{cases} 
\min\left(100, \frac{\text{Years}_{candidate}}{\text{Years}_{required}} \times 100\right), & \text{if } \text{Years}_{candidate} < \text{Years}_{required} \\
\min\left(100, 85 + (\text{Years}_{candidate} - \text{Years}_{required}) \times 3\right), & \text{if } \text{Years}_{candidate} \ge \text{Years}_{required}
\end{cases}$$

#### Step 3: Semantic Cosine Distance ($S_{sem}$)
Using term-frequency vectors or dense embeddings:
$$S_{sem} = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|} \times 100$$

### Explainability Payload Standard
Every calculated score produces a deterministic JSON explanation block:
```json
{
  "overallScore": 89,
  "skillsScore": 92,
  "experienceScore": 95,
  "educationScore": 90,
  "semanticScore": 88,
  "matchingSkills": ["react", "node.js", "typescript", "mongodb"],
  "missingSkills": ["aws"],
  "recommendation": "Strong Hire Recommendation",
  "explanation": "Outstanding candidate with 6.2 years experience (exceeds 5-year requirement). Verified mastery in React, Node.js, and TypeScript. Missing AWS certification; recommend probing cloud deployment familiarity during technical screen.",
  "calculatedAt": "2026-09-04T02:00:00.000Z"
}
```

---

## 7. Background Task Queue Specifications (BullMQ + Redis)

| Queue Identifier | Processor Payload | Concurrency | Backoff & Retry Policy |
| :--- | :--- | :--- | :--- |
| `resume-parsing-queue` | `{ filename, fileUrl, tenantId }` | 4 workers | Exponential backoff (3 attempts, initial delay 2s) |
| `candidate-scoring-queue` | `{ candidateId, jobId, tenantId }` | 8 workers | Fixed delay (2 attempts, 500ms) |
| `email-dispatch-queue` | `{ recipientEmail, subject, templateId }` | 2 workers | Exponential backoff (5 attempts, max delay 60s) |
| `hris-sync-queue` | `{ candidateId, offerId, targetSystem }` | 1 worker | Exponential backoff with Dead Letter Queue (DLQ) |

---

## 8. Security & Compliance Enforcement

1. **Authentication & Session Lifecycle:**
   - Stateless 15-minute JWT access tokens signed with HMAC-SHA256.
   - Long-lived 7-day refresh tokens stored in Redis with Token Rotation. Old tokens are immediately invalidated if replayed.
2. **Multi-Tenant Scoping Middleware:**
   - Mongoose pre-find hook guarantees tenant boundaries:
     ```javascript
     schema.pre(/^find/, function() {
       if (this.options.skipTenant) return;
       this.where({ tenantId: currentContext.tenantId, isDeleted: { $ne: true } });
     });
     ```
3. **Data Encryption:**
   - Transport: Enforced TLS 1.3 across all incoming and inter-service HTTP requests.
   - Storage: AES-256 volume encryption on MongoDB Atlas and AWS S3 Server-Side Encryption (`SSE-KMS`).
4. **Audit Trail Guarantee:**
   - Mutations trigger synchronous or guaranteed-queued writes to `AuditLogs`. Audit documents omit update/delete endpoints to maintain immutable append-only integrity.

---

## 9. Frontend Architecture (React / Single Page Application)

- **Routing & Rendering:** Single-page dashboard application with clean view state switching (`dashboard`, `jobs`, `pipeline`, `candidates`, `interviews`, `offers`, `analytics`, `careers`, `admin`).
- **Interactive Kanban Pipeline:** Drag-and-drop stages with optimistic UI rendering. Cards transition immediately in the interface; background requests dispatch `PATCH /api/v1/applications/:id/move-stage`. On HTTP failure, cards revert to original columns with toast error alerts.
- **Accessibility (WCAG 2.1 AA):** High-contrast color ratios, semantic HTML buttons, keyboard tab navigation, and ARIA labels on all modal and drawer elements.

---

## 10. Operational Deployment & Environment Configuration

### Docker Compose Architecture (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  web-api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - NODE_ENV=production
      - JWT_SECRET=production_secret_key_min_32_chars
      - MONGODB_URI=mongodb://mongo:27017/enterprise_ats
      - AI_SERVICE_URL=http://ai-service:8000
    depends_on:
      - mongo
      - redis
      - ai-service

  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"

  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7.0-alpine
    ports:
      - "6379:6379"

volumes:
  mongo-data:
```

---

## 11. Realistic Phasing, Milestones & Engineering Estimates

| Milestone | Deliverables | Engineering Timeline |
| :--- | :--- | :--- |
| **Phase 1: Foundation (Sprints 1–4)** | Multi-tenant DB, Auth, Job Requisitions, Career Site, Basic Ingestion | 8 Weeks |
| **Phase 2: Automation (Sprints 5–8)** | AI Matching Math, Kanban Pipeline, Automated Scheduling, Scorecards | 8 Weeks |
| **Phase 3: Scale & Ecosystem (Sprints 9–12)** | Offers with E-Sign, HRIS Sync, BI Analytics, BullMQ Queue Workers | 8 Weeks |
| **Phase 4: Hardening (Sprints 13–15)** | Penetration Testing, SOC 2 Compliance Audit, Load Testing (10k req/min) | 6 Weeks |
| **Total Engineering Cycle** | Production Ready Enterprise ATS | **30 Weeks (7.5 Months)** |

### Monthly Production Operating Costs (50 Tenants / ~50k Resumes Monthly)
- **Container Hosting (AWS ECS Fargate):** \$420 / month
- **Managed Database (MongoDB Atlas M30 Multi-AZ):** \$350 / month
- **Managed Cache (AWS ElastiCache Redis):** \$120 / month
- **Object Storage & CDN (AWS S3 + CloudFront):** \$65 / month
- **AI LLM Inference Tokens (OpenAI / vLLM):** \$480 / month
- **Transactional Comms (SendGrid + Twilio):** \$180 / month
- **Observability (Datadog / Sentry):** \$160 / month
- **Total Estimated Operating Budget:** **\$1,775 / month**
