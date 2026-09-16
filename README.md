# Enterprise AI-Powered Applicant Tracking System (ATS)
### Modern Multi-Tenant Recruitment Operating System

A modern, full-lifecycle Applicant Tracking System combining structured hiring rubrics, candidate CRM, predictive AI matching, automated interview scheduling, and enterprise governance.

---

## Architecture Overview

- **Frontend:** Next.js / React 18 SPA & Branded Career Microsite with Tailwind CSS & Lucide Icons.
- **Backend API:** Node.js (v20+ LTS) + Express.js + Mongoose + Socket.io Realtime Server.
- **AI Microservice:** Python 3.11 + FastAPI + NLP Entity Extraction + Explainable Fit Scoring Engine.
- **Database:** MongoDB 7.0 Multi-Tenant Document Partitioning (with automatic embedded fallback for zero-config local runs).
- **Caching & Queues:** Redis 7.0 for Socket.io clustering and rate limiting.
- **Deployment:** Docker & Docker Compose.

---

## Quick Start (Local Run)

### 1. Start Core Server (Backend + Frontend + Realtime WebSockets)
```bash
npm start
```
- **Recruiter Cockpit & Workspace:** [http://localhost:5000/app](http://localhost:5000/app)
- **Public Branded Career Portal:** [http://localhost:5000/careers](http://localhost:5000/careers)
- **REST API Base URL:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **API Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

### 2. Run Automated Verification Tests
```bash
npm test
```
Executes 12 comprehensive end-to-end tests covering:
- Database CRUD & Tenant Scoping
- AI Resume Parsing & Entity Extraction
- Multi-Criteria Explainable AI Matching
- AI Job Requisition Generator
- Knockout Screening Disqualification
- Kanban Stage Transitions & Event History
- Calendar Free/Busy Slot Optimization
- Blind Structured Scorecard Rubrics
- Offer Package Creation & E-Sign Acceptance
- Executive Funnel & Velocity Analytics
- AI Recruitment Copilot RAG Queries
- Tamper-Evident Forensic Audit Logging

### 3. Start Python AI Microservice (Optional)
```bash
npm run ai
# Runs FastAPI on http://localhost:8000
```
*(Note: If the Python service is not running, the Node.js backend automatically falls back to its built-in NLP matching and parsing engine with 100% feature availability).*

### 4. Docker Deployment
```bash
docker-compose up --build
```

---

## Default User Accounts (Pre-Seeded)

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Company Admin** | `admin@techcorp.com` | `password123` | Branding, RBAC, settings, audit logs |
| **Recruiter** | `recruiter@techcorp.com` | `password123` | Job requisitions, Kanban, candidate CRM, offers |
| **Hiring Manager** | `manager@techcorp.com` | `password123` | Candidate review, approvals, scorecards |
| **Interviewer** | `interviewer@techcorp.com` | `password123` | Blind scorecards, interview briefs |

---

## Key Modules & Capabilities

1. **AI Job Requisition Wizard:** Generate enriched job descriptions, role competencies, and mandatory knockout questions from a brief prompt.
2. **Interactive Kanban Pipeline:** Drag and drop candidates across stages (`Applied`, `Screening`, `Shortlisted`, `Interview`, `Offer`, `Hired`, `Rejected`) with real-time WebSocket synchronization.
3. **Candidate 360° Dossier:** Unified profile showing parsed resume entities, contact details, complete stage timeline, and explainable AI fit scores.
4. **Explainable AI Matching:** Mathematically grounded fit scoring formula ($S_{total} = 0.40 S_{skills} + 0.30 S_{exp} + 0.15 S_{edu} + 0.15 S_{sem}$) providing transparent matching skills, missing skills, and plain-English hiring rationales.
5. **Knockout Screening:** Mandatory qualifying questions that automatically disqualify non-viable candidates at application time.
6. **Self-Scheduling & Video Interviews:** Integration with calendar availability; automated Google Meet link generation.
7. **Structured Blind Scorecards:** Objective 1–5 competency evaluations kept blind until interviewers submit their assessments.
8. **Offer Management & E-Signatures:** Dynamic offer letters with base salary, equity, bonus, target start date, and digital acceptance tracking.
9. **AI Recruitment Copilot:** Conversational slide-out drawer answering natural language queries across the candidate database.
10. **Executive BI Analytics:** Interactive conversion funnel, stage drop-offs, recruitment velocity (time-to-hire), and source effectiveness.
