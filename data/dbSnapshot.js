export const DB_SNAPSHOT = {
  "companies": [
    {
      "_id": "doc_a71bf70ad6ed56ce",
      "createdAt": "2026-09-04T01:14:50.257Z",
      "updatedAt": "2026-09-04T01:14:50.259Z",
      "name": "TechCorp Global Solutions",
      "subdomain": "techcorp",
      "branding": {
        "primaryColor": "#2563EB",
        "accentColor": "#10B981",
        "logoUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60"
      },
      "settings": {
        "timezone": "America/New_York",
        "currency": "USD",
        "retentionDays": 365
      }
    }
  ],
  "users": [
    {
      "_id": "doc_b9fa6d4f1a344f56",
      "createdAt": "2026-09-04T01:14:50.361Z",
      "updatedAt": "2026-10-09T16:29:30.888Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Sarah",
      "lastName": "Connor",
      "email": "admin@techcorp.com",
      "passwordHash": "$2a$10$cvSNB2ukilBy/V6E3U46X.Ns0LK0pegd0Kx92QgMYrqprpwm3mB.W",
      "role": "COMPANY_ADMIN",
      "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      "isActive": true,
      "plainPasswordForDemo": "Admin@2026"
    },
    {
      "_id": "doc_a9289f33c4f52c25",
      "createdAt": "2026-09-04T01:14:50.361Z",
      "updatedAt": "2026-10-09T16:29:30.974Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Alex",
      "lastName": "Morgan",
      "email": "recruiter@techcorp.com",
      "passwordHash": "$2a$10$JnwZRWY7H6wZNFcRnMXknuyMZeF80Kfj/s560wSbS2Xpsvx6xkAeO",
      "role": "RECRUITER",
      "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "isActive": true,
      "plainPasswordForDemo": "Recruiter@2026"
    },
    {
      "_id": "doc_493030e468962233",
      "createdAt": "2026-09-04T01:14:50.363Z",
      "updatedAt": "2026-10-09T16:29:31.060Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "David",
      "lastName": "Chen",
      "email": "manager@techcorp.com",
      "passwordHash": "$2a$10$RixYsbRFwNP8MMug9UOCoOXm5CEdQ9UZ8KkB1rLAxMAlOW6h532YO",
      "role": "HIRING_MANAGER",
      "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      "isActive": true,
      "plainPasswordForDemo": "Manager@2026"
    },
    {
      "_id": "doc_f498dda4a79ee504",
      "createdAt": "2026-09-04T01:14:50.363Z",
      "updatedAt": "2026-10-09T16:29:31.151Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Elena",
      "lastName": "Rostova",
      "email": "interviewer@techcorp.com",
      "passwordHash": "$2a$10$lHr96WYbwu01ZbBgWTVPCOsM5kum4ncNo/txsjsy19zlA8utgGxF2",
      "role": "INTERVIEWER",
      "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      "isActive": true,
      "plainPasswordForDemo": "Interviewer@2026"
    },
    {
      "_id": "doc_967ecfc04dba1a83",
      "createdAt": "2026-09-04T16:29:48.945Z",
      "updatedAt": "2026-10-09T16:29:30.800Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Marcus",
      "lastName": "Vance",
      "email": "superadmin@enterprise-ats.io",
      "passwordHash": "$2a$10$f4kGyDJW5w1oRhWy7pjUu.uiCvdzVO56tD.xC5Hynp6UMqGkL7UvO",
      "plainPasswordForDemo": "SuperAdmin@2026",
      "role": "SUPER_ADMIN",
      "avatarUrl": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      "isActive": true
    },
    {
      "_id": "doc_7d5d39e5a28156a8",
      "createdAt": "2026-09-04T16:29:49.377Z",
      "updatedAt": "2026-10-09T16:29:31.234Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Jessica",
      "lastName": "Reed",
      "email": "agency@apexrecruiting.com",
      "passwordHash": "$2a$10$dJfJX//iNwTC/N0HzQ/u1uR7Fa4b5uCxeVK62FdvnOLWVBpEuqy.e",
      "plainPasswordForDemo": "Agency@2026",
      "role": "AGENCY_PARTNER",
      "avatarUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      "isActive": true
    },
    {
      "_id": "doc_f567a421a517e5e8",
      "createdAt": "2026-09-04T16:29:49.463Z",
      "updatedAt": "2026-10-09T16:29:31.318Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Jordan",
      "lastName": "Miller",
      "email": "candidate@example.com",
      "passwordHash": "$2a$10$vJqASVTf5Ajmbm0LxlfZs.YBjfCpVxMoThjjKv.H4RyswP1pGI4Uy",
      "plainPasswordForDemo": "Candidate@2026",
      "role": "CANDIDATE",
      "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      "isActive": true
    }
  ],
  "jobs": [
    {
      "_id": "doc_bbe4c6051f27d640",
      "createdAt": "2026-09-04T01:14:50.364Z",
      "updatedAt": "2026-10-09T16:29:31.943Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "title": "Senior Full-Stack Engineer (React / Node.js)",
      "departmentId": "Engineering",
      "locationId": "San Francisco, CA (Hybrid)",
      "workplaceType": "HYBRID",
      "employmentType": "FULL_TIME",
      "hiringManagerId": "doc_493030e468962233",
      "recruiterId": "doc_a9289f33c4f52c25",
      "minExperienceYears": 5,
      "requiredSkills": [
        "react",
        "node.js",
        "typescript",
        "mongodb",
        "docker"
      ],
      "preferredSkills": [
        "next.js",
        "aws",
        "graphql"
      ],
      "salaryRange": {
        "min": 145000,
        "max": 185000,
        "currency": "USD",
        "isPublic": true
      },
      "descriptionHtml": "<p>We are seeking a <strong>Senior Full-Stack Engineer</strong> to build high-scale recruitment and workflow applications.</p>",
      "responsibilities": [
        "Lead end-to-end development of customer-facing React & Node.js features.",
        "Architect robust MongoDB schemas and high-throughput REST APIs.",
        "Partner closely with Product and UX teams to build delightful interfaces."
      ],
      "requirements": [
        "5+ years of software development experience with modern JavaScript / TypeScript.",
        "Demonstrated expertise building production React and Node.js microservices."
      ],
      "knockoutQuestions": [
        {
          "questionText": "Do you have 5+ years of professional full-stack development experience?",
          "questionType": "BOOLEAN",
          "correctAnswer": true,
          "disqualifyIfWrong": true
        },
        {
          "questionText": "Are you legally authorized to work in the United States?",
          "questionType": "BOOLEAN",
          "correctAnswer": true,
          "disqualifyIfWrong": true
        }
      ],
      "status": "PUBLISHED",
      "publishedAt": "2026-09-04T01:14:50.364Z",
      "syndicatedBoards": [
        "LinkedIn Talent Hub",
        "Indeed Worldwide",
        "Glassdoor Jobs",
        "Naukri.com Enterprise"
      ],
      "syndicationStatus": "ACTIVE",
      "lastSyndicatedAt": "2026-10-09T16:29:31.943Z"
    },
    {
      "_id": "doc_6a5aa65d2c82138f",
      "createdAt": "2026-09-04T01:14:50.364Z",
      "updatedAt": "2026-09-04T01:14:50.364Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "title": "Senior AI / NLP Engineer (Python & LLMs)",
      "departmentId": "AI & Data Intelligence",
      "locationId": "New York, NY (Remote)",
      "workplaceType": "REMOTE",
      "employmentType": "FULL_TIME",
      "hiringManagerId": "doc_493030e468962233",
      "recruiterId": "doc_a9289f33c4f52c25",
      "minExperienceYears": 4,
      "requiredSkills": [
        "python",
        "fastapi",
        "nlp",
        "llm",
        "pytorch",
        "docker"
      ],
      "preferredSkills": [
        "langchain",
        "vector search",
        "spacy",
        "kubernetes"
      ],
      "salaryRange": {
        "min": 160000,
        "max": 210000,
        "currency": "USD",
        "isPublic": true
      },
      "descriptionHtml": "<p>Join our AI research team to build next-generation resume intelligence, vector matching, and conversational copilots.</p>",
      "responsibilities": [
        "Design, fine-tune, and deploy transformer-based NLP and LLM extraction pipelines.",
        "Optimize vector similarity indexing and semantic candidate matching algorithms."
      ],
      "requirements": [
        "4+ years working with Python, deep learning frameworks, and modern LLMs.",
        "Hands-on experience shipping production machine learning microservices."
      ],
      "knockoutQuestions": [
        {
          "questionText": "Do you have production experience deploying Python NLP or LLM applications?",
          "questionType": "BOOLEAN",
          "correctAnswer": true,
          "disqualifyIfWrong": true
        }
      ],
      "status": "PUBLISHED",
      "publishedAt": "2026-09-04T01:14:50.364Z"
    },
    {
      "_id": "doc_0f198cbfd83a55cc",
      "createdAt": "2026-09-04T01:14:50.365Z",
      "updatedAt": "2026-09-04T01:14:50.365Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "title": "Lead DevOps & Cloud Infrastructure Engineer",
      "departmentId": "Infrastructure",
      "locationId": "Austin, TX (On-site)",
      "workplaceType": "ON_SITE",
      "employmentType": "FULL_TIME",
      "hiringManagerId": "doc_493030e468962233",
      "recruiterId": "doc_a9289f33c4f52c25",
      "minExperienceYears": 6,
      "requiredSkills": [
        "aws",
        "kubernetes",
        "terraform",
        "docker",
        "ci/cd"
      ],
      "preferredSkills": [
        "helm",
        "prometheus",
        "datadog",
        "golang"
      ],
      "salaryRange": {
        "min": 155000,
        "max": 195000,
        "currency": "USD",
        "isPublic": true
      },
      "descriptionHtml": "<p>Lead our multi-region AWS cloud infrastructure, Kubernetes clusters, and zero-downtime CI/CD pipelines.</p>",
      "responsibilities": [
        "Maintain Kubernetes clusters and AWS VPC networking.",
        "Build automated security scanning and continuous delivery workflows."
      ],
      "requirements": [
        "6+ years managing large-scale Linux and AWS infrastructure."
      ],
      "knockoutQuestions": [],
      "status": "PUBLISHED",
      "publishedAt": "2026-09-04T01:14:50.365Z"
    },
    {
      "_id": "doc_8ebae411eee5bd17",
      "createdAt": "2026-09-04T02:18:00.557Z",
      "updatedAt": "2026-09-04T02:18:00.557Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "title": "Principal Product Designer (UI/UX Systems)",
      "departmentId": "Product & Design",
      "locationId": "New York, NY (Hybrid)",
      "workplaceType": "HYBRID",
      "employmentType": "FULL_TIME",
      "hiringManagerId": "doc_a9289f33c4f52c25",
      "recruiterId": "doc_a9289f33c4f52c25",
      "salaryRange": {
        "min": 120000,
        "max": 160000,
        "currency": "USD",
        "isPublic": true
      },
      "minExperienceYears": 4,
      "requiredSkills": [
        "JavaScript",
        "TypeScript",
        "Node.js",
        "React",
        "MongoDB"
      ],
      "preferredSkills": [
        "Kubernetes",
        "Microservices",
        "GraphQL",
        "AWS/GCP Certified"
      ],
      "responsibilities": [
        "Architect and build high-performance, fault-tolerant features and APIs.",
        "Collaborate with product management and UI/UX designers to translate requirements into elegant technical specifications.",
        "Mentor junior and mid-level engineers through code reviews, design critiques, and architecture discussions.",
        "Participate in on-call rotation and proactively identify system performance bottlenecks."
      ],
      "requirements": [
        "4+ years of professional production software engineering experience.",
        "Demonstrated expertise in JavaScript, TypeScript, Node.js and cloud infrastructure.",
        "Strong grasp of computer science fundamentals, data structures, and distributed systems.",
        "Excellent written and verbal technical communication skills."
      ],
      "descriptionHtml": "<p>We are seeking a talented <strong>hrll</strong> to join our team.</p>",
      "knockoutQuestions": [
        {
          "questionText": "Do you have at least 4 years of production software engineering experience?",
          "questionType": "BOOLEAN",
          "correctAnswer": true,
          "disqualifyIfWrong": true
        },
        {
          "questionText": "Are you authorized to work in the country without sponsorship?",
          "questionType": "BOOLEAN",
          "correctAnswer": true,
          "disqualifyIfWrong": false
        }
      ],
      "status": "PUBLISHED",
      "publishedAt": "2026-09-04T02:18:00.557Z"
    },
    {
      "_id": "doc_044bbc2f5c09e08c",
      "createdAt": "2026-09-07T16:57:18.423Z",
      "updatedAt": "2026-09-07T16:57:18.423Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "title": "Director of AI Systems & LLM Architecture",
      "departmentId": "AI & Data Intelligence",
      "locationId": "San Francisco, CA (Remote)",
      "workplaceType": "HYBRID",
      "employmentType": "FULL_TIME",
      "hiringManagerId": "doc_a9289f33c4f52c25",
      "recruiterId": "doc_a9289f33c4f52c25",
      "salaryRange": {
        "min": 120000,
        "max": 160000,
        "currency": "USD",
        "isPublic": true
      },
      "minExperienceYears": 4,
      "requiredSkills": [
        "JavaScript",
        "TypeScript",
        "Node.js",
        "React",
        "MongoDB"
      ],
      "preferredSkills": [
        "Kubernetes",
        "Microservices",
        "GraphQL",
        "AWS/GCP Certified"
      ],
      "responsibilities": [
        "Architect and build high-performance, fault-tolerant features and APIs.",
        "Collaborate with product management and UI/UX designers to translate requirements into elegant technical specifications.",
        "Mentor junior and mid-level engineers through code reviews, design critiques, and architecture discussions.",
        "Participate in on-call rotation and proactively identify system performance bottlenecks."
      ],
      "requirements": [
        "4+ years of professional production software engineering experience.",
        "Demonstrated expertise in JavaScript, TypeScript, Node.js and cloud infrastructure.",
        "Strong grasp of computer science fundamentals, data structures, and distributed systems.",
        "Excellent written and verbal technical communication skills."
      ],
      "descriptionHtml": "<p>We are seeking a talented <strong>herakewd</strong> to join our team.</p>",
      "knockoutQuestions": [
        {
          "questionText": "Do you have at least 4 years of production software engineering experience?",
          "questionType": "BOOLEAN",
          "correctAnswer": true,
          "disqualifyIfWrong": true
        },
        {
          "questionText": "Are you authorized to work in the country without sponsorship?",
          "questionType": "BOOLEAN",
          "correctAnswer": true,
          "disqualifyIfWrong": false
        }
      ],
      "status": "PUBLISHED",
      "publishedAt": "2026-09-07T16:57:18.423Z"
    },
    {
      "_id": "doc_job_staff_ai",
      "createdAt": "2026-09-04T01:14:50.364Z",
      "updatedAt": "2026-09-04T01:14:50.364Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "title": "Staff AI Engineer (Autonomous Agents & Inference)",
      "departmentId": "AI & Data Intelligence",
      "locationId": "San Francisco, CA (Remote)",
      "workplaceType": "REMOTE",
      "employmentType": "FULL_TIME",
      "hiringManagerId": "doc_493030e468962233",
      "recruiterId": "doc_a9289f33c4f52c25",
      "minExperienceYears": 6,
      "requiredSkills": [
        "python",
        "pytorch",
        "llm",
        "lora",
        "tensorrt",
        "distributed training"
      ],
      "preferredSkills": [
        "cuda",
        "vllm",
        "deepspeed",
        "rag"
      ],
      "salaryRange": {
        "min": 160000,
        "max": 220000,
        "currency": "USD",
        "isPublic": true
      },
      "descriptionHtml": "<p>Architect next-generation enterprise agent orchestration and distributed inference clusters.</p>",
      "responsibilities": [
        "Principal architect for enterprise autonomous agent platform.",
        "Lead multi-modal foundational model training and LoRA adaptation."
      ],
      "requirements": [
        "6+ years experience in deep learning, LLMs, and distributed PyTorch."
      ],
      "knockoutQuestions": [],
      "status": "PUBLISHED",
      "publishedAt": "2026-09-04T01:14:50.364Z"
    },
    {
      "_id": "doc_job_data_platform",
      "createdAt": "2026-09-04T01:14:50.364Z",
      "updatedAt": "2026-09-04T01:14:50.364Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "title": "Senior Data Platform Engineer (Spark & Kafka)",
      "departmentId": "Data Engineering",
      "locationId": "Seattle, WA (Hybrid)",
      "workplaceType": "HYBRID",
      "employmentType": "FULL_TIME",
      "hiringManagerId": "doc_493030e468962233",
      "recruiterId": "doc_a9289f33c4f52c25",
      "minExperienceYears": 5,
      "requiredSkills": [
        "spark",
        "kafka",
        "python",
        "sql",
        "aws",
        "snowflake"
      ],
      "preferredSkills": [
        "flink",
        "iceberg",
        "dbt"
      ],
      "salaryRange": {
        "min": 155000,
        "max": 195000,
        "currency": "USD",
        "isPublic": true
      },
      "descriptionHtml": "<p>Scale our real-time analytics pipeline processing billions of recruitment events.</p>",
      "responsibilities": [
        "Build streaming data pipelines",
        "Optimize Snowflake warehouse query costs"
      ],
      "requirements": [
        "5+ years building distributed data platform systems"
      ],
      "knockoutQuestions": [],
      "status": "PUBLISHED",
      "publishedAt": "2026-09-04T01:14:50.364Z"
    },
    {
      "_id": "doc_job_security_arch",
      "createdAt": "2026-09-04T01:14:50.364Z",
      "updatedAt": "2026-09-04T01:14:50.364Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "title": "Cloud Security & Compliance Architect (Zero Trust)",
      "departmentId": "Security & Governance",
      "locationId": "Austin, TX (Remote)",
      "workplaceType": "REMOTE",
      "employmentType": "FULL_TIME",
      "hiringManagerId": "doc_493030e468962233",
      "recruiterId": "doc_a9289f33c4f52c25",
      "minExperienceYears": 6,
      "requiredSkills": [
        "aws",
        "kubernetes",
        "soc2",
        "zero trust",
        "iam",
        "terraform"
      ],
      "preferredSkills": [
        "cis benchmarks",
        "vault",
        "crowdstrike"
      ],
      "salaryRange": {
        "min": 165000,
        "max": 205000,
        "currency": "USD",
        "isPublic": true
      },
      "descriptionHtml": "<p>Lead SOC-2 Type II, ISO 27001, and Zero Trust security architectures across multi-cloud environments.</p>",
      "responsibilities": [
        "Lead cloud security architecture",
        "Automate compliance audit proofs"
      ],
      "requirements": [
        "6+ years security engineering and cloud infrastructure architecture"
      ],
      "knockoutQuestions": [],
      "status": "PUBLISHED",
      "publishedAt": "2026-09-04T01:14:50.364Z"
    }
  ],
  "candidates": [
    {
      "_id": "doc_08f6825f7b58afff",
      "createdAt": "2026-09-04T01:14:50.365Z",
      "updatedAt": "2026-09-04T01:14:50.365Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Jordan",
      "lastName": "Miller",
      "email": "jordan.miller@example.com",
      "phone": "+1 (415) 555-0142",
      "location": {
        "city": "San Francisco",
        "state": "CA",
        "country": "USA"
      },
      "skills": [
        "react",
        "node.js",
        "typescript",
        "mongodb",
        "docker",
        "next.js",
        "aws"
      ],
      "totalExperienceYears": 6.2,
      "summary": "Senior Full Stack Engineer with 6+ years shipping high-scale SaaS products with React, Node, and TypeScript.",
      "tags": [
        "Top Performer",
        "Referred"
      ],
      "source": "CAREER_PAGE",
      "education": [
        {
          "institution": "University of Michigan",
          "degree": "BS Computer Science",
          "graduationYear": 2018
        }
      ],
      "workHistory": [
        {
          "company": "CloudScale Inc",
          "title": "Senior Software Engineer",
          "startDate": "2020-01-01",
          "isCurrent": true
        }
      ]
    },
    {
      "_id": "doc_b69bfdad01273fff",
      "createdAt": "2026-09-04T01:14:50.366Z",
      "updatedAt": "2026-09-04T01:14:50.366Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Maya",
      "lastName": "Patel",
      "email": "maya.patel@example.com",
      "phone": "+1 (212) 555-0188",
      "location": {
        "city": "New York",
        "state": "NY",
        "country": "USA"
      },
      "skills": [
        "python",
        "fastapi",
        "nlp",
        "llm",
        "pytorch",
        "docker",
        "langchain"
      ],
      "totalExperienceYears": 5.5,
      "summary": "AI specialist focused on NLP information extraction, embeddings, and RAG architectures.",
      "tags": [
        "AI Expert",
        "High Match"
      ],
      "source": "CAREER_PAGE",
      "education": [
        {
          "institution": "University of Michigan",
          "degree": "BS Computer Science",
          "graduationYear": 2018
        }
      ],
      "workHistory": [
        {
          "company": "CloudScale Inc",
          "title": "Senior Software Engineer",
          "startDate": "2020-01-01",
          "isCurrent": true
        }
      ]
    },
    {
      "_id": "doc_96353561e470fd87",
      "createdAt": "2026-09-04T01:14:50.367Z",
      "updatedAt": "2026-09-04T01:14:50.367Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Lucas",
      "lastName": "Silva",
      "email": "lucas.silva@example.com",
      "phone": "+1 (512) 555-0199",
      "location": {
        "city": "Austin",
        "state": "TX",
        "country": "USA"
      },
      "skills": [
        "aws",
        "kubernetes",
        "terraform",
        "docker",
        "ci/cd",
        "python"
      ],
      "totalExperienceYears": 7,
      "summary": "DevOps Lead with deep AWS and Kubernetes production architecture experience.",
      "tags": [
        "SRE",
        "Certified AWS"
      ],
      "source": "CAREER_PAGE",
      "education": [
        {
          "institution": "University of Michigan",
          "degree": "BS Computer Science",
          "graduationYear": 2018
        }
      ],
      "workHistory": [
        {
          "company": "CloudScale Inc",
          "title": "Senior Software Engineer",
          "startDate": "2020-01-01",
          "isCurrent": true
        }
      ]
    },
    {
      "_id": "doc_42d065f3573a92bf",
      "createdAt": "2026-09-04T01:14:50.368Z",
      "updatedAt": "2026-09-04T01:14:50.368Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Emily",
      "lastName": "Zhao",
      "email": "emily.zhao@example.com",
      "phone": "+1 (408) 555-0111",
      "location": {
        "city": "Seattle",
        "state": "WA",
        "country": "USA"
      },
      "skills": [
        "react",
        "javascript",
        "html5",
        "css3",
        "redux",
        "jest"
      ],
      "totalExperienceYears": 3.5,
      "summary": "Frontend developer passionate about component design systems and responsive web applications.",
      "tags": [
        "Frontend Specialist"
      ],
      "source": "CAREER_PAGE",
      "education": [
        {
          "institution": "University of Michigan",
          "degree": "BS Computer Science",
          "graduationYear": 2018
        }
      ],
      "workHistory": [
        {
          "company": "CloudScale Inc",
          "title": "Senior Software Engineer",
          "startDate": "2020-01-01",
          "isCurrent": true
        }
      ]
    },
    {
      "_id": "doc_2c1683a6645b708b",
      "createdAt": "2026-09-04T01:14:50.369Z",
      "updatedAt": "2026-09-04T01:14:50.369Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Marcus",
      "lastName": "Johnson",
      "email": "marcus.j@example.com",
      "phone": "+1 (312) 555-0177",
      "location": {
        "city": "Chicago",
        "state": "IL",
        "country": "USA"
      },
      "skills": [
        "node.js",
        "express",
        "postgresql",
        "redis",
        "docker"
      ],
      "totalExperienceYears": 4.8,
      "summary": "Backend software engineer with expertise in distributed microservices and database optimization.",
      "tags": [
        "Backend Focus"
      ],
      "source": "CAREER_PAGE",
      "education": [
        {
          "institution": "University of Michigan",
          "degree": "BS Computer Science",
          "graduationYear": 2018
        }
      ],
      "workHistory": [
        {
          "company": "CloudScale Inc",
          "title": "Senior Software Engineer",
          "startDate": "2020-01-01",
          "isCurrent": true
        }
      ]
    },
    {
      "_id": "doc_2569cfadf4bd2544",
      "createdAt": "2026-09-04T01:14:50.370Z",
      "updatedAt": "2026-09-04T01:14:50.370Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Sophia",
      "lastName": "Vargas",
      "email": "sophia.vargas@example.com",
      "phone": "+1 (617) 555-0166",
      "location": {
        "city": "Boston",
        "state": "MA",
        "country": "USA"
      },
      "skills": [
        "react",
        "node.js",
        "typescript",
        "mongodb",
        "docker"
      ],
      "totalExperienceYears": 5.8,
      "summary": "Full-stack builder with strong communication skills and passion for customer-facing features.",
      "tags": [
        "Strong Fit"
      ],
      "source": "CAREER_PAGE",
      "education": [
        {
          "institution": "University of Michigan",
          "degree": "BS Computer Science",
          "graduationYear": 2018
        }
      ],
      "workHistory": [
        {
          "company": "CloudScale Inc",
          "title": "Senior Software Engineer",
          "startDate": "2020-01-01",
          "isCurrent": true
        }
      ]
    },
    {
      "_id": "doc_5cb92a700e026e3b",
      "createdAt": "2026-09-04T01:18:54.569Z",
      "updatedAt": "2026-09-04T01:18:54.569Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Devon",
      "lastName": "Zhao",
      "email": "devon.zhao@test.com",
      "phone": "+1 (555) 234-5678",
      "linkedinUrl": "https://linkedin.com/in/devon-zhao",
      "githubUrl": "https://github.com/devon",
      "skills": [
        "typescript",
        "react",
        "node.js",
        "docker",
        "kubernetes"
      ],
      "totalExperienceYears": 3.5,
      "education": [
        {
          "institution": "State University",
          "degree": "Bachelor of Science",
          "fieldOfStudy": "Computer Science",
          "graduationYear": 2020
        }
      ],
      "workHistory": [
        {
          "company": "Acme Technologies",
          "title": "Software Engineer",
          "startDate": "2021-06-01",
          "endDate": "Present",
          "isCurrent": true,
          "description": "Designed and deployed scalable microservices and user interfaces."
        }
      ],
      "summary": "Devon Zhao Fullstack React & Node Engineer with 6 years experience at Stripe. Skills: React, Node.js, TypeScript, Docker, Kubernetes. Email: devon.zhao@test.com...",
      "source": "CAREER_PAGE",
      "tags": [
        "Inbound Applicant"
      ]
    },
    {
      "_id": "doc_d7fc3258bf700292",
      "createdAt": "2026-09-07T16:48:51.882Z",
      "updatedAt": "2026-09-07T16:48:51.882Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "firstName": "Rahul",
      "lastName": "Bajediyal",
      "email": "rahul.bajediyal@gmail.com",
      "phone": "",
      "linkedinUrl": "",
      "githubUrl": "",
      "skills": [
        "General Software Engineering"
      ],
      "totalExperienceYears": 3,
      "education": [],
      "workHistory": [],
      "summary": "Candidate applying for Senior AI / NLP Engineer (Python & LLMs)",
      "source": "CAREER_PAGE",
      "tags": [
        "Inbound Applicant"
      ]
    }
  ],
  "applications": [
    {
      "_id": "doc_72423cd33a5dd21f",
      "createdAt": "2026-09-04T01:14:50.371Z",
      "updatedAt": "2026-10-09T16:29:31.380Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_job_staff_ai",
      "candidateId": "doc_08f6825f7b58afff",
      "stageId": "Shortlisted",
      "status": "ACTIVE",
      "aiMatchScore": {
        "overallScore": 91,
        "skillsScore": 92,
        "experienceScore": 89,
        "educationScore": 90,
        "semanticScore": 95,
        "matchingSkills": [
          "react",
          "node.js",
          "typescript",
          "mongodb",
          "docker",
          "next.js",
          "aws"
        ],
        "missingSkills": [],
        "recommendation": "Strong Hire Recommendation",
        "explanation": "Outstanding candidate with 6.2 years of experience (exceeds the 5 year requirement). Verified mastery in react, node.js, typescript, mongodb. Strong alignment with role competencies. Recommended for expedited technical interview.",
        "calculatedAt": "2026-09-04T01:14:50.371Z"
      },
      "stageHistory": [
        {
          "fromStage": "Applied",
          "toStage": "Screening",
          "changedAt": "2026-08-25T01:14:50.371Z"
        },
        {
          "fromStage": "Screening",
          "toStage": "Interview",
          "changedAt": "2026-08-30T01:14:50.371Z"
        },
        {
          "fromStage": "Interview",
          "toStage": "Offer",
          "changedAt": "2026-09-03T01:14:50.371Z"
        },
        {
          "fromStage": "Offer",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-04T01:16:26.660Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-04T01:16:52.202Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-04T02:00:56.945Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-04T16:02:05.024Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-04T16:29:49.536Z"
        },
        {
          "fromStage": "Offer",
          "toStage": "Hired",
          "changedAt": "2026-09-07T18:31:59.863Z"
        },
        {
          "fromStage": "Hired",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T10:57:51.441Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T11:03:32.329Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T11:11:22.425Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T11:15:35.379Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T11:26:38.850Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T11:59:07.914Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T13:14:25.289Z"
        },
        {
          "fromStage": "Offer",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T13:25:52.465Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T17:18:33.201Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T17:34:46.419Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T17:59:42.644Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T18:02:50.600Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T18:26:22.924Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T19:31:46.877Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-08T20:04:26.550Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-16T19:41:41.185Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-16T19:52:43.990Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-16T19:55:33.664Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-18T21:52:48.666Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-01T18:00:37.143Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-01T18:05:20.691Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-01T18:05:59.441Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-01T18:10:37.266Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-01T18:11:18.536Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-06T09:02:31.901Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-06T09:07:10.809Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-06T09:14:23.304Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-09T14:38:53.701Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-09T16:22:29.760Z"
        },
        {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-09T16:29:31.380Z"
        }
      ],
      "$push": {
        "stageHistory": {
          "fromStage": "Shortlisted",
          "toStage": "Shortlisted",
          "changedAt": "2026-10-09T16:29:31.380Z"
        }
      }
    },
    {
      "_id": "doc_57f43e663fe800a1",
      "createdAt": "2026-09-04T01:14:50.372Z",
      "updatedAt": "2026-09-04T01:14:50.372Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_6a5aa65d2c82138f",
      "candidateId": "doc_b69bfdad01273fff",
      "stageId": "Hired",
      "status": "HIRED",
      "aiMatchScore": {
        "overallScore": 87,
        "skillsScore": 81,
        "experienceScore": 90,
        "educationScore": 90,
        "semanticScore": 95,
        "matchingSkills": [
          "python",
          "fastapi",
          "nlp",
          "llm",
          "pytorch",
          "docker",
          "langchain"
        ],
        "missingSkills": [],
        "recommendation": "Strong Hire Recommendation",
        "explanation": "Outstanding candidate with 5.5 years of experience (exceeds the 4 year requirement). Verified mastery in python, fastapi, nlp, llm. Strong alignment with role competencies. Recommended for expedited technical interview.",
        "calculatedAt": "2026-09-04T01:14:50.372Z"
      },
      "stageHistory": [
        {
          "fromStage": "Applied",
          "toStage": "Screening",
          "changedAt": "2026-08-29T01:14:50.372Z"
        },
        {
          "fromStage": "Screening",
          "toStage": "Interview",
          "changedAt": "2026-09-02T01:14:50.372Z"
        }
      ]
    },
    {
      "_id": "doc_33c0b2168fc3c678",
      "createdAt": "2026-09-04T01:14:50.374Z",
      "updatedAt": "2026-09-04T01:14:50.374Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_0f198cbfd83a55cc",
      "candidateId": "doc_96353561e470fd87",
      "stageId": "Hired",
      "status": "HIRED",
      "aiMatchScore": {
        "overallScore": 84,
        "skillsScore": 75,
        "experienceScore": 88,
        "educationScore": 90,
        "semanticScore": 95,
        "matchingSkills": [
          "aws",
          "kubernetes",
          "terraform",
          "docker",
          "ci/cd"
        ],
        "missingSkills": [],
        "recommendation": "Qualified for Screening",
        "explanation": "Solid match with 7 years experience. Possesses key required skills (aws, kubernetes, terraform). Missing some preferred qualifications; screening should explore practical depth in these areas.",
        "calculatedAt": "2026-09-04T01:14:50.374Z"
      },
      "stageHistory": [
        {
          "fromStage": "Applied",
          "toStage": "Screening",
          "changedAt": "2026-08-10T01:14:50.374Z"
        },
        {
          "fromStage": "Screening",
          "toStage": "Interview",
          "changedAt": "2026-08-20T01:14:50.374Z"
        },
        {
          "fromStage": "Interview",
          "toStage": "Offer",
          "changedAt": "2026-08-27T01:14:50.374Z"
        },
        {
          "fromStage": "Offer",
          "toStage": "Hired",
          "changedAt": "2026-09-02T01:14:50.374Z"
        }
      ]
    },
    {
      "_id": "doc_5df028dc012506af",
      "createdAt": "2026-09-04T01:14:50.374Z",
      "updatedAt": "2026-10-06T08:59:36.226Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_8ebae411eee5bd17",
      "candidateId": "doc_42d065f3573a92bf",
      "stageId": "Hired",
      "status": "HIRED",
      "aiMatchScore": {
        "overallScore": 55,
        "skillsScore": 15,
        "experienceScore": 70,
        "educationScore": 90,
        "semanticScore": 95,
        "matchingSkills": [
          "react"
        ],
        "missingSkills": [
          "node.js",
          "typescript",
          "mongodb",
          "docker"
        ],
        "recommendation": "Requires Further Evaluation",
        "explanation": "Lower match score due to gaps in primary required competencies (node.js, typescript, mongodb, docker) or lower verified years of seniority (3.5 yrs vs 5 yrs target).",
        "calculatedAt": "2026-09-04T01:14:50.374Z"
      },
      "stageHistory": [
        {
          "fromStage": "Applied",
          "toStage": "Screening",
          "changedAt": "2026-08-31T01:14:50.374Z"
        },
        {
          "fromStage": "Screening",
          "toStage": "Shortlisted",
          "changedAt": "2026-09-03T01:14:50.374Z"
        },
        {
          "fromStage": "Offer",
          "toStage": "Hired",
          "changedAt": "2026-10-06T08:59:36.226Z"
        }
      ],
      "$push": {
        "stageHistory": {
          "fromStage": "Offer",
          "toStage": "Hired",
          "changedAt": "2026-10-06T08:59:36.226Z"
        }
      }
    },
    {
      "_id": "doc_994205486e2d2ef3",
      "createdAt": "2026-09-04T01:14:50.375Z",
      "updatedAt": "2026-09-04T01:14:50.375Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_job_data_platform",
      "candidateId": "doc_2c1683a6645b708b",
      "stageId": "Hired",
      "status": "HIRED",
      "aiMatchScore": {
        "overallScore": 69,
        "skillsScore": 30,
        "experienceScore": 96,
        "educationScore": 90,
        "semanticScore": 95,
        "matchingSkills": [
          "node.js",
          "docker"
        ],
        "missingSkills": [
          "react",
          "typescript",
          "mongodb"
        ],
        "recommendation": "Requires Further Evaluation",
        "explanation": "Lower match score due to gaps in primary required competencies (react, typescript, mongodb) or lower verified years of seniority (4.8 yrs vs 5 yrs target).",
        "calculatedAt": "2026-09-04T01:14:50.375Z"
      },
      "stageHistory": [
        {
          "fromStage": "Applied",
          "toStage": "Screening",
          "changedAt": "2026-09-02T01:14:50.375Z"
        }
      ]
    },
    {
      "_id": "doc_0777b16679362bb1",
      "createdAt": "2026-09-04T01:14:50.376Z",
      "updatedAt": "2026-09-04T01:14:50.376Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_job_security_arch",
      "candidateId": "doc_2569cfadf4bd2544",
      "stageId": "Hired",
      "status": "HIRED",
      "aiMatchScore": {
        "overallScore": 84,
        "skillsScore": 75,
        "experienceScore": 87,
        "educationScore": 90,
        "semanticScore": 95,
        "matchingSkills": [
          "react",
          "node.js",
          "typescript",
          "mongodb",
          "docker"
        ],
        "missingSkills": [],
        "recommendation": "Qualified for Screening",
        "explanation": "Solid match with 5.8 years experience. Possesses key required skills (react, node.js, typescript). Missing some preferred qualifications; screening should explore practical depth in these areas.",
        "calculatedAt": "2026-09-04T01:14:50.376Z"
      },
      "stageHistory": [
        {
          "fromStage": "None",
          "toStage": "Applied",
          "changedAt": "2026-09-04T01:14:50.376Z"
        }
      ]
    },
    {
      "_id": "doc_c918633ad98a1aaf",
      "createdAt": "2026-09-04T01:18:54.571Z",
      "updatedAt": "2026-09-16T19:46:07.895Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_0f198cbfd83a55cc",
      "candidateId": "doc_5cb92a700e026e3b",
      "stageId": "Hired",
      "status": "HIRED",
      "rejectionReason": null,
      "knockoutAnswers": [],
      "aiMatchScore": {
        "overallScore": 57,
        "skillsScore": 30,
        "experienceScore": 58,
        "educationScore": 90,
        "semanticScore": 95,
        "matchingSkills": [
          "kubernetes",
          "docker"
        ],
        "missingSkills": [
          "aws",
          "terraform",
          "ci/cd",
          "helm",
          "prometheus",
          "datadog",
          "golang"
        ],
        "recommendation": "Requires Further Evaluation",
        "explanation": "Lower match score due to gaps in primary required competencies (aws, terraform, ci/cd) or lower verified years of seniority (3.5 yrs vs 6 yrs target).",
        "calculatedAt": "2026-09-04T01:18:54.570Z"
      },
      "stageHistory": [
        {
          "fromStage": "None",
          "toStage": "Applied",
          "changedAt": "2026-09-04T01:18:54.570Z"
        },
        {
          "fromStage": "Offer",
          "toStage": "Hired",
          "changedAt": "2026-09-08T17:08:52.886Z"
        },
        {
          "fromStage": "Hired",
          "toStage": "Interview",
          "changedById": "usr_recruiter_01",
          "changedAt": "2026-09-16T19:45:50.917Z"
        },
        {
          "fromStage": "Interview",
          "toStage": "Hired",
          "changedById": "usr_recruiter_01",
          "changedAt": "2026-09-16T19:46:07.894Z"
        }
      ],
      "$push": {
        "stageHistory": {
          "fromStage": "Interview",
          "toStage": "Hired",
          "changedById": "usr_recruiter_01",
          "changedAt": "2026-09-16T19:46:07.894Z"
        }
      }
    },
    {
      "_id": "doc_1edcf576685f038f",
      "createdAt": "2026-09-07T16:48:51.885Z",
      "updatedAt": "2026-09-07T16:48:51.885Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_6a5aa65d2c82138f",
      "candidateId": "doc_d7fc3258bf700292",
      "stageId": "Rejected",
      "status": "REJECTED",
      "rejectionReason": "Failed mandatory knockout pre-qualification screening",
      "knockoutAnswers": [
        {
          "questionText": "Do you have production experience deploying Python NLP or LLM applications?",
          "answer": null,
          "passed": false
        }
      ],
      "aiMatchScore": {
        "overallScore": 47,
        "skillsScore": 0,
        "experienceScore": 75,
        "educationScore": 70,
        "semanticScore": 95,
        "matchingSkills": [],
        "missingSkills": [
          "python",
          "fastapi",
          "nlp",
          "llm",
          "pytorch",
          "docker",
          "langchain",
          "vector search",
          "spacy",
          "kubernetes"
        ],
        "recommendation": "Requires Further Evaluation",
        "explanation": "Lower match score due to gaps in primary required competencies (python, fastapi, nlp, llm, pytorch, docker) or lower verified years of seniority (3 yrs vs 4 yrs target).",
        "calculatedAt": "2026-09-07T16:48:51.885Z"
      },
      "stageHistory": [
        {
          "fromStage": "None",
          "toStage": "Rejected",
          "changedAt": "2026-09-07T16:48:51.885Z"
        }
      ]
    },
    {
      "_id": "doc_c4d5e639e28d49ea",
      "createdAt": "2026-09-07T16:58:32.245Z",
      "updatedAt": "2026-09-08T17:30:58.708Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_044bbc2f5c09e08c",
      "candidateId": "doc_d7fc3258bf700292",
      "stageId": "Applied",
      "status": "ACTIVE",
      "rejectionReason": "Failed mandatory knockout pre-qualification screening",
      "knockoutAnswers": [
        {
          "questionText": "Do you have at least 4 years of production software engineering experience?",
          "answer": null,
          "passed": false
        },
        {
          "questionText": "Are you authorized to work in the country without sponsorship?",
          "answer": null,
          "passed": true
        }
      ],
      "aiMatchScore": {
        "overallScore": 45,
        "skillsScore": 0,
        "experienceScore": 75,
        "educationScore": 70,
        "semanticScore": 80,
        "matchingSkills": [],
        "missingSkills": [
          "javascript",
          "typescript",
          "node.js",
          "react",
          "mongodb",
          "kubernetes",
          "microservices",
          "graphql",
          "aws/gcp certified"
        ],
        "recommendation": "Requires Further Evaluation",
        "explanation": "Lower match score due to gaps in primary required competencies (javascript, typescript, node.js, react, mongodb) or lower verified years of seniority (3 yrs vs 4 yrs target).",
        "calculatedAt": "2026-09-07T16:58:32.245Z"
      },
      "stageHistory": [
        {
          "fromStage": "None",
          "toStage": "Rejected",
          "changedAt": "2026-09-07T16:58:32.245Z"
        },
        {
          "fromStage": "Rejected",
          "toStage": "Applied",
          "changedById": "doc_a9289f33c4f52c25",
          "changedAt": "2026-09-07T17:44:16.063Z"
        },
        {
          "fromStage": "Applied",
          "toStage": "Screening",
          "changedById": "doc_967ecfc04dba1a83",
          "changedAt": "2026-09-08T09:55:46.178Z"
        },
        {
          "fromStage": "Screening",
          "toStage": "Applied",
          "changedById": "doc_967ecfc04dba1a83",
          "changedAt": "2026-09-08T17:30:58.708Z"
        }
      ],
      "$push": {
        "stageHistory": {
          "fromStage": "Screening",
          "toStage": "Applied",
          "changedById": "doc_967ecfc04dba1a83",
          "changedAt": "2026-09-08T17:30:58.708Z"
        }
      }
    },
    {
      "_id": "doc_081f3c2a8cde5c2b",
      "createdAt": "2026-09-07T16:58:50.136Z",
      "updatedAt": "2026-09-08T17:31:07.156Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_044bbc2f5c09e08c",
      "candidateId": "doc_d7fc3258bf700292",
      "stageId": "Screening",
      "status": "ACTIVE",
      "rejectionReason": "Failed mandatory knockout pre-qualification screening",
      "knockoutAnswers": [
        {
          "questionText": "Do you have at least 4 years of production software engineering experience?",
          "answer": null,
          "passed": false
        },
        {
          "questionText": "Are you authorized to work in the country without sponsorship?",
          "answer": null,
          "passed": true
        }
      ],
      "aiMatchScore": {
        "overallScore": 45,
        "skillsScore": 0,
        "experienceScore": 75,
        "educationScore": 70,
        "semanticScore": 80,
        "matchingSkills": [],
        "missingSkills": [
          "javascript",
          "typescript",
          "node.js",
          "react",
          "mongodb",
          "kubernetes",
          "microservices",
          "graphql",
          "aws/gcp certified"
        ],
        "recommendation": "Requires Further Evaluation",
        "explanation": "Lower match score due to gaps in primary required competencies (javascript, typescript, node.js, react, mongodb) or lower verified years of seniority (3 yrs vs 4 yrs target).",
        "calculatedAt": "2026-09-07T16:58:50.135Z"
      },
      "stageHistory": [
        {
          "fromStage": "None",
          "toStage": "Rejected",
          "changedAt": "2026-09-07T16:58:50.135Z"
        },
        {
          "fromStage": "Rejected",
          "toStage": "Offer",
          "changedById": "doc_a9289f33c4f52c25",
          "changedAt": "2026-09-07T17:57:59.088Z"
        },
        {
          "fromStage": "Hired",
          "toStage": "Screening",
          "changedById": "doc_967ecfc04dba1a83",
          "changedAt": "2026-09-08T17:31:07.156Z"
        }
      ],
      "$push": {
        "stageHistory": {
          "fromStage": "Hired",
          "toStage": "Screening",
          "changedById": "doc_967ecfc04dba1a83",
          "changedAt": "2026-09-08T17:31:07.156Z"
        }
      }
    }
  ],
  "interviews": [
    {
      "_id": "doc_536c72ad490efe17",
      "createdAt": "2026-09-04T01:14:50.373Z",
      "updatedAt": "2026-09-08T11:00:18.543Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "applicationId": "doc_57f43e663fe800a1",
      "roundName": "AI Architecture & Deep Learning Technical Screen",
      "interviewerIds": [
        "doc_f498dda4a79ee504",
        "doc_493030e468962233"
      ],
      "scheduledStartTime": "2026-09-05T01:14:50.373Z",
      "scheduledEndTime": "2026-09-05T01:59:50.373Z",
      "meetingUrl": "https://meet.google.com/ats-demo-ai-screen",
      "calendarEventId": "cal_seed_001",
      "status": "COMPLETED",
      "cloudRecordingUrl": "https://vault.enterprise-ats.io/recordings/int_doc_536c72ad490efe17_1788865218541.mp4",
      "completedAt": "2026-09-08T11:00:18.543Z"
    },
    {
      "_id": "doc_642906b5cefe367e",
      "createdAt": "2026-09-16T19:55:00.325Z",
      "updatedAt": "2026-09-16T19:55:00.325Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_42d065f3573a92bf",
      "candidateName": "Emily Zhao",
      "roundName": "Round 2: Full-Stack Systems & API Design",
      "interviewerName": "Elena Rostova (Principal AI Architect)",
      "scheduledAt": "2026-09-18T19:55:00.325Z",
      "meetingUrl": "https://meet.google.com/ats-ck3h-ku1",
      "status": "SCHEDULED"
    },
    {
      "_id": "doc_7516a6c9c2b82aad",
      "createdAt": "2026-09-16T19:55:10.024Z",
      "updatedAt": "2026-09-16T19:55:10.024Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_5cb92a700e026e3b",
      "candidateName": "Devon Zhao",
      "roundName": "Round 2: Full-Stack Systems & API Design",
      "interviewerName": "Elena Rostova (Principal AI Architect)",
      "scheduledAt": "2026-09-18T19:55:10.022Z",
      "meetingUrl": "https://meet.google.com/ats-256s-3ne",
      "status": "SCHEDULED"
    },
    {
      "_id": "doc_e151677aa780ce76",
      "createdAt": "2026-09-18T21:50:12.326Z",
      "updatedAt": "2026-09-18T21:50:12.326Z",
      "tenantId": "ten_techcorp_global",
      "candidateId": "doc_5cb92a700e026e3b",
      "candidateName": "Devon Zhao",
      "roundName": "Round 2: Full-Stack Systems & API Design",
      "interviewerName": "Elena Rostova (Principal AI Architect)",
      "scheduledAt": "2026-09-20T21:50:12.326Z",
      "meetingUrl": "https://meet.google.com/ats-macx-v79",
      "status": "SCHEDULED"
    },
    {
      "_id": "doc_e415bcc788dd1be7",
      "createdAt": "2026-09-18T21:52:37.650Z",
      "updatedAt": "2026-09-18T21:52:37.650Z",
      "tenantId": "ten_techcorp_global",
      "candidateId": "doc_5cb92a700e026e3b",
      "candidateName": "Devon Zhao",
      "roundName": "Round 2: Full-Stack Systems & API Design",
      "interviewerName": "Elena Rostova (Principal AI Architect)",
      "scheduledAt": "2026-09-20T21:52:37.650Z",
      "meetingUrl": "https://meet.google.com/ats-u671-a1o",
      "status": "SCHEDULED"
    }
  ],
  "scorecards": [
    {
      "_id": "doc_def77e7f6183dc77",
      "createdAt": "2026-09-04T01:14:50.373Z",
      "updatedAt": "2026-09-08T11:00:18.542Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "interviewId": "doc_536c72ad490efe17",
      "interviewerId": "doc_a9289f33c4f52c25",
      "interviewerName": "Alex Morgan",
      "criteriaRatings": [
        {
          "name": "Technical Depth",
          "score": 5,
          "feedback": "Superb knowledge of distributed event architecture."
        },
        {
          "name": "System Architecture",
          "score": 5,
          "feedback": "Explained sharding, CQRS, and Kafka idempotency."
        },
        {
          "name": "Articulation & Communication",
          "score": 5,
          "feedback": "Articulate, transparent, and structured."
        },
        {
          "name": "Culture & Leadership",
          "score": 5,
          "feedback": "High ownership and mentoring abilities."
        }
      ],
      "overallRecommendation": "STRONG_YES",
      "privateNotes": "Exceptional candidate. High velocity senior hire recommended.",
      "isSubmitted": true,
      "submittedAt": "2026-09-08T11:00:18.542Z",
      "cloudRecordingUrl": "https://vault.enterprise-ats.io/recordings/int_doc_536c72ad490efe17_1788865218541.mp4"
    }
  ],
  "offers": [
    {
      "_id": "doc_offer_jordan_miller",
      "createdAt": "2026-09-07T14:30:00.000Z",
      "updatedAt": "2026-09-18T21:52:37.641Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "applicationId": "doc_72423cd33a5dd21f",
      "candidateId": "doc_08f6825f7b58afff",
      "jobTitle": "Staff AI Engineer",
      "baseSalary": 165000,
      "currency": "USD",
      "variableBonus": 15000,
      "equityShares": 25000,
      "targetStartDate": "2026-10-01T09:00:00.000Z",
      "expirationDate": "2026-10-15T23:59:59.000Z",
      "approvalStatus": "APPROVED",
      "candidateDecision": "SENT",
      "signedDocumentUrl": null,
      "sentAt": "2026-09-07T14:30:00.000Z",
      "signedOffBy": "Recruiter",
      "signedOffAt": "2026-09-18T21:52:37.641Z",
      "managerNotes": "Approved via AI Assistant automation."
    },
    {
      "_id": "doc_offer_maya_patel",
      "createdAt": "2026-09-06T11:20:00.000Z",
      "updatedAt": "2026-09-07T10:00:00.000Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "applicationId": "doc_57f43e663fe800a1",
      "candidateId": "doc_b69bfdad01273fff",
      "jobTitle": "Senior AI / NLP Engineer (Python & LLMs)",
      "baseSalary": 185000,
      "currency": "USD",
      "variableBonus": 25000,
      "equityShares": 15000,
      "targetStartDate": "2026-10-20T09:00:00.000Z",
      "expirationDate": "2026-09-25T23:59:59.000Z",
      "approvalStatus": "APPROVED",
      "candidateDecision": "ACCEPTED",
      "eSignSignatureId": "sig_mpatel_98214a",
      "signedAt": "2026-09-07T10:00:00.000Z"
    },
    {
      "_id": "doc_offer_lucas_silva",
      "createdAt": "2026-09-05T16:15:00.000Z",
      "updatedAt": "2026-09-06T09:30:00.000Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "applicationId": "doc_33c0b2168fc3c678",
      "candidateId": "doc_96353561e470fd87",
      "jobTitle": "Lead DevOps & Cloud Infrastructure Engineer",
      "baseSalary": 172000,
      "currency": "USD",
      "variableBonus": 18000,
      "equityShares": 12000,
      "targetStartDate": "2026-09-28T09:00:00.000Z",
      "expirationDate": "2026-09-20T23:59:59.000Z",
      "approvalStatus": "APPROVED",
      "candidateDecision": "ACCEPTED",
      "eSignSignatureId": "sig_lsilva_44129b",
      "signedAt": "2026-09-06T09:30:00.000Z"
    },
    {
      "_id": "doc_offer_emily_zhao",
      "createdAt": "2026-09-07T17:45:00.000Z",
      "updatedAt": "2026-10-06T08:59:36.224Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "applicationId": "doc_5df028dc012506af",
      "candidateId": "doc_42d065f3573a92bf",
      "jobTitle": "Principal Product Designer (UI/UX Systems)",
      "baseSalary": 158000,
      "currency": "USD",
      "variableBonus": 12000,
      "equityShares": 8000,
      "targetStartDate": "2026-10-25T09:00:00.000Z",
      "expirationDate": "2026-09-30T23:59:59.000Z",
      "approvalStatus": "APPROVED",
      "candidateDecision": "ACCEPTED",
      "signedDocumentUrl": null,
      "sentAt": "2026-09-07T17:45:00.000Z",
      "eSignSignatureId": "sig_1791277176224_Candidate Digital E-Sign",
      "signedAt": "2026-10-06T08:59:36.224Z"
    },
    {
      "_id": "doc_offer_marcus_johnson",
      "createdAt": "2026-09-04T12:00:00.000Z",
      "updatedAt": "2026-09-05T14:10:00.000Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "applicationId": "doc_994205486e2d2ef3",
      "candidateId": "doc_2c1683a6645b708b",
      "jobTitle": "Senior Data Platform Engineer (Spark & Kafka)",
      "baseSalary": 168000,
      "currency": "USD",
      "variableBonus": 16000,
      "equityShares": 10000,
      "targetStartDate": "2026-11-01T09:00:00.000Z",
      "expirationDate": "2026-09-22T23:59:59.000Z",
      "approvalStatus": "APPROVED",
      "candidateDecision": "ACCEPTED",
      "eSignSignatureId": "sig_mjohnson_88716c",
      "signedAt": "2026-09-05T14:10:00.000Z"
    },
    {
      "_id": "doc_offer_sophia_vargas",
      "createdAt": "2026-09-06T15:00:00.000Z",
      "updatedAt": "2026-09-07T11:45:00.000Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "applicationId": "doc_0777b16679362bb1",
      "candidateId": "doc_2569cfadf4bd2544",
      "jobTitle": "Cloud Security & Compliance Architect (Zero Trust)",
      "baseSalary": 178000,
      "currency": "USD",
      "variableBonus": 20000,
      "equityShares": 14000,
      "targetStartDate": "2026-10-10T09:00:00.000Z",
      "expirationDate": "2026-09-28T23:59:59.000Z",
      "approvalStatus": "APPROVED",
      "candidateDecision": "ACCEPTED",
      "eSignSignatureId": "sig_svargas_33091d",
      "signedAt": "2026-09-07T11:45:00.000Z"
    },
    {
      "_id": "doc_offer_devon_zhao",
      "createdAt": "2026-09-08T08:00:00.000Z",
      "updatedAt": "2026-09-08T17:08:52.881Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "applicationId": "doc_c918633ad98a1aaf",
      "candidateId": "doc_5cb92a700e026e3b",
      "jobTitle": "Lead DevOps & Cloud Infrastructure Engineer",
      "baseSalary": 152000,
      "currency": "USD",
      "variableBonus": 10000,
      "equityShares": 5000,
      "targetStartDate": "2026-11-15T09:00:00.000Z",
      "expirationDate": "2026-10-05T23:59:59.000Z",
      "approvalStatus": "PENDING_FINANCE",
      "candidateDecision": "ACCEPTED",
      "signedDocumentUrl": null,
      "sentAt": null,
      "eSignSignatureId": "sig_1788887332881_Candidate Digital E-Sign",
      "signedAt": "2026-09-08T17:08:52.881Z"
    },
    {
      "_id": "doc_offer_rahul_bajediyal",
      "createdAt": "2026-09-07T18:00:00.000Z",
      "updatedAt": "2026-09-08T09:00:00.000Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "applicationId": "doc_081f3c2a8cde5c2b",
      "candidateId": "doc_d7fc3258bf700292",
      "jobTitle": "Director of AI Systems & LLM Architecture",
      "baseSalary": 210000,
      "currency": "USD",
      "variableBonus": 35000,
      "equityShares": 30000,
      "targetStartDate": "2026-10-05T09:00:00.000Z",
      "expirationDate": "2026-09-29T23:59:59.000Z",
      "approvalStatus": "APPROVED",
      "candidateDecision": "ACCEPTED",
      "eSignSignatureId": "sig_rbajediyal_77201e",
      "signedAt": "2026-09-08T09:00:00.000Z"
    }
  ],
  "talentPools": [],
  "communications": [
    {
      "_id": "doc_915f266de60e6aca",
      "createdAt": "2026-09-08T11:00:18.544Z",
      "updatedAt": "2026-09-08T11:00:18.544Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_b69bfdad01273fff",
      "recipientEmail": "RAHUL.bajediyal@gmail.com",
      "direction": "OUTBOUND",
      "channel": "EMAIL",
      "type": "INTERVIEW_EVALUATION_REPORT",
      "subject": "[ATS EVALUATION] Live Video Interview Report: Maya Patel - Senior AI / NLP Engineer (Python & LLMs) (AI Architecture & Deep Learning Technical Screen)",
      "body": "================================================================================\nENTERPRISE ATS: AUTOMATED INTERVIEW EVALUATION & RECORDING REPORT\n================================================================================\nGenerated for Master Administrator: RAHUL.bajediyal@gmail.com\nDispatch Timestamp: 2026-09-08T11:00:18.544Z\n\n1. CANDIDATE & REQUISITION DETAILS\n--------------------------------------------------------------------------------\nCandidate Name     : Maya Patel\nCandidate Email    : maya.patel@example.com\nPosition Applied   : Senior AI / NLP Engineer (Python & LLMs)\nInterview Round    : AI Architecture & Deep Learning Technical Screen\nInterviewer        : Alex Morgan\nSession Duration   : 45 Minutes\n\n2. EVALUATION & SCORECARD RATINGS (1 - 5 STARS)\n--------------------------------------------------------------------------------\n• Technical Depth: ★★★★★ (5/5) - Superb knowledge of distributed event architecture.\n• System Architecture: ★★★★★ (5/5) - Explained sharding, CQRS, and Kafka idempotency.\n• Articulation & Communication: ★★★★★ (5/5) - Articulate, transparent, and structured.\n• Culture & Leadership: ★★★★★ (5/5) - High ownership and mentoring abilities.\n\nFinal Recommendation: STRONG_YES\nInterviewer Notes   : Exceptional candidate. High velocity senior hire recommended.\n\n3. CLOUD RECORDING & ARCHIVE ACCESS\n--------------------------------------------------------------------------------\nEncrypted Recording Link : https://vault.enterprise-ats.io/recordings/int_doc_536c72ad490efe17_1788865218541.mp4\nStorage Protocol         : AES-256 Cloud Object Vault (Expiring Token Link)\n\n4. TIMESTAMPED BOOKMARKS\n--------------------------------------------------------------------------------\n• [04:15] Deep dive into microservices migration\n• [22:30] Live architecture whiteboarding\n\n5. BACKUP AUDIO TRANSCRIPT EXCERPT\n--------------------------------------------------------------------------------\n[00:02] Alex Morgan: Hello Maya Patel, welcome to the AI Architecture & Deep Learning Technical Screen round.\n[00:10] Maya Patel: Thank you, glad to be here and excited to discuss the role.\n[01:00] Alex Morgan: Could you walk me through your experience with large-scale distributed systems?\n[01:25] Maya Patel: In my recent role, I led the migration of monolithic microservices to an event-driven Kafka architecture.\n[12:40] Alex Morgan: Excellent explanation. How did you handle partition rebalancing and data consistency?\n[13:10] Maya Patel: We implemented idempotency keys, dead-letter queues, and exactly-once processing semantics.\n\n================================================================================\nConfidential Recruitment Document - Enterprise ATS Automated Alert Subsystem\nDispatched to Master Recruiter / Admin: RAHUL.bajediyal@gmail.com\n================================================================================",
      "metadata": {
        "candidateName": "Maya Patel",
        "jobTitle": "Senior AI / NLP Engineer (Python & LLMs)",
        "roundName": "AI Architecture & Deep Learning Technical Screen",
        "overallRecommendation": "STRONG_YES",
        "cloudRecordingUrl": "https://vault.enterprise-ats.io/recordings/int_doc_536c72ad490efe17_1788865218541.mp4",
        "criteriaRatings": [
          {
            "name": "Technical Depth",
            "score": 5,
            "feedback": "Superb knowledge of distributed event architecture."
          },
          {
            "name": "System Architecture",
            "score": 5,
            "feedback": "Explained sharding, CQRS, and Kafka idempotency."
          },
          {
            "name": "Articulation & Communication",
            "score": 5,
            "feedback": "Articulate, transparent, and structured."
          },
          {
            "name": "Culture & Leadership",
            "score": 5,
            "feedback": "High ownership and mentoring abilities."
          }
        ],
        "bookmarks": [
          {
            "timestamp": "04:15",
            "note": "Deep dive into microservices migration"
          },
          {
            "timestamp": "22:30",
            "note": "Live architecture whiteboarding"
          }
        ]
      },
      "status": "DELIVERED",
      "sentAt": "2026-09-08T11:00:18.544Z"
    }
  ],
  "auditLogs": [
    {
      "_id": "doc_a4c2a7176661a625",
      "createdAt": "2026-09-04T01:14:50.376Z",
      "updatedAt": "2026-09-04T01:14:50.376Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_b9fa6d4f1a344f56",
      "actorEmail": "admin@techcorp.com",
      "action": "TENANT_INITIALIZED",
      "resourceType": "System",
      "resourceId": "doc_a71bf70ad6ed56ce",
      "ipAddress": "127.0.0.1",
      "userAgent": "Seeder"
    },
    {
      "_id": "doc_b2fa6b87fdfb7006",
      "createdAt": "2026-09-04T01:16:26.741Z",
      "updatedAt": "2026-09-04T01:16:26.743Z",
      "tenantId": "tenant_techcorp_global",
      "actorId": "usr_admin",
      "actorEmail": "admin@techcorp.com",
      "action": "TEST_PERMIT_ACTION",
      "resourceType": "SecurityTest",
      "resourceId": "res_001",
      "ipAddress": "127.0.0.1"
    },
    {
      "_id": "doc_61bc69a0694d5c67",
      "createdAt": "2026-09-04T02:18:00.558Z",
      "updatedAt": "2026-09-04T02:18:00.558Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_a9289f33c4f52c25",
      "actorEmail": "recruiter@techcorp.com",
      "action": "JOB_CREATED",
      "resourceType": "Job",
      "resourceId": "N/A",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
      "method": "POST",
      "path": "/api/v1/jobs"
    },
    {
      "_id": "doc_6991e40b86f0cbea",
      "createdAt": "2026-09-07T16:57:18.424Z",
      "updatedAt": "2026-09-07T16:57:18.424Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_a9289f33c4f52c25",
      "actorEmail": "recruiter@techcorp.com",
      "action": "JOB_CREATED",
      "resourceType": "Job",
      "resourceId": "N/A",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      "method": "POST",
      "path": "/api/v1/jobs"
    },
    {
      "_id": "doc_3f862f6ed01d37b1",
      "createdAt": "2026-09-07T17:44:16.065Z",
      "updatedAt": "2026-09-07T17:44:16.065Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_a9289f33c4f52c25",
      "actorEmail": "recruiter@techcorp.com",
      "action": "STAGE_MOVED",
      "resourceType": "Application",
      "resourceId": "doc_c4d5e639e28d49ea",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      "method": "PATCH",
      "path": "/api/v1/applications/doc_c4d5e639e28d49ea/move-stage"
    },
    {
      "_id": "doc_5bee159efcc0278a",
      "createdAt": "2026-09-07T17:57:59.089Z",
      "updatedAt": "2026-09-07T17:57:59.089Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_a9289f33c4f52c25",
      "actorEmail": "recruiter@techcorp.com",
      "action": "STAGE_MOVED",
      "resourceType": "Application",
      "resourceId": "doc_081f3c2a8cde5c2b",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      "method": "PATCH",
      "path": "/api/v1/applications/doc_081f3c2a8cde5c2b/move-stage"
    },
    {
      "_id": "doc_93d6cae3f1196f32",
      "createdAt": "2026-09-07T18:31:59.869Z",
      "updatedAt": "2026-09-07T18:31:59.869Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_a9289f33c4f52c25",
      "actorEmail": "recruiter@techcorp.com",
      "action": "OFFER_ACCEPTED",
      "resourceType": "Offer",
      "resourceId": "doc_7cde312bdb680ca1",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      "method": "POST",
      "path": "/api/v1/offers/doc_7cde312bdb680ca1/accept"
    },
    {
      "_id": "doc_2cf97846a89c2fa3",
      "createdAt": "2026-09-08T09:55:46.188Z",
      "updatedAt": "2026-09-08T09:55:46.189Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_967ecfc04dba1a83",
      "actorEmail": "superadmin@enterprise-ats.io",
      "action": "STAGE_MOVED",
      "resourceType": "Application",
      "resourceId": "doc_c4d5e639e28d49ea",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      "method": "PATCH",
      "path": "/api/v1/applications/doc_c4d5e639e28d49ea/move-stage"
    },
    {
      "_id": "doc_ab3a06b0004b6db7",
      "createdAt": "2026-09-08T11:00:18.545Z",
      "updatedAt": "2026-09-08T11:00:18.545Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_a9289f33c4f52c25",
      "actorEmail": "recruiter@techcorp.com",
      "action": "VIDEO_INTERVIEW_COMPLETED",
      "resourceType": "Interview",
      "resourceId": "doc_536c72ad490efe17",
      "ipAddress": "::1",
      "userAgent": "node",
      "method": "POST",
      "path": "/api/v1/interviews/doc_536c72ad490efe17/complete-studio"
    },
    {
      "_id": "doc_c2820f326c011116",
      "createdAt": "2026-09-08T17:08:52.889Z",
      "updatedAt": "2026-09-08T17:08:52.889Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_a9289f33c4f52c25",
      "actorEmail": "recruiter@techcorp.com",
      "action": "OFFER_ACCEPTED",
      "resourceType": "Offer",
      "resourceId": "doc_offer_devon_zhao",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      "method": "POST",
      "path": "/api/v1/offers/doc_offer_devon_zhao/accept"
    },
    {
      "_id": "doc_e706589d89f544d8",
      "createdAt": "2026-09-08T17:30:58.718Z",
      "updatedAt": "2026-09-08T17:30:58.718Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_967ecfc04dba1a83",
      "actorEmail": "superadmin@enterprise-ats.io",
      "action": "STAGE_MOVED",
      "resourceType": "Application",
      "resourceId": "doc_c4d5e639e28d49ea",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      "method": "PATCH",
      "path": "/api/v1/applications/doc_c4d5e639e28d49ea/move-stage"
    },
    {
      "_id": "doc_7383c44a8b1e8ac9",
      "createdAt": "2026-09-08T17:31:07.158Z",
      "updatedAt": "2026-09-08T17:31:07.158Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_967ecfc04dba1a83",
      "actorEmail": "superadmin@enterprise-ats.io",
      "action": "STAGE_MOVED",
      "resourceType": "Application",
      "resourceId": "doc_081f3c2a8cde5c2b",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      "method": "PATCH",
      "path": "/api/v1/applications/doc_081f3c2a8cde5c2b/move-stage"
    },
    {
      "_id": "doc_26ff31ca4662f827",
      "createdAt": "2026-10-05T16:10:20.816Z",
      "updatedAt": "2026-10-05T16:10:20.816Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_a9289f33c4f52c25",
      "actorEmail": "recruiter@techcorp.com",
      "action": "DEEL_EOR_ONBOARD",
      "resourceType": "Deel",
      "resourceId": "N/A",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
      "method": "POST",
      "path": "/api/v1/deel/onboard"
    },
    {
      "_id": "doc_f335c32e783f4be6",
      "createdAt": "2026-10-06T08:59:36.237Z",
      "updatedAt": "2026-10-06T08:59:36.237Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "actorId": "doc_a9289f33c4f52c25",
      "actorEmail": "recruiter@techcorp.com",
      "action": "OFFER_ACCEPTED",
      "resourceType": "Offer",
      "resourceId": "doc_offer_emily_zhao",
      "ipAddress": "::1",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36",
      "method": "POST",
      "path": "/api/v1/offers/doc_offer_emily_zhao/accept"
    }
  ],
  "departments": [],
  "videoSessions": [
    {
      "_id": "doc_5f3c96e5c3571069",
      "createdAt": "2026-09-08T11:00:18.529Z",
      "updatedAt": "2026-09-08T11:00:18.541Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "interviewId": "doc_536c72ad490efe17",
      "applicationId": "doc_57f43e663fe800a1",
      "candidateId": "doc_b69bfdad01273fff",
      "roomToken": "room_doc_536c72ad490efe17_1788865218529",
      "recordingStatus": "COMPLETED",
      "recordingUrl": "https://vault.enterprise-ats.io/recordings/int_doc_536c72ad490efe17_1788865218541.mp4",
      "startedAt": "2026-09-08T11:00:18.529Z",
      "candidateConsentGiven": true,
      "hardwareCheckPassed": true,
      "bookmarks": [
        {
          "timestamp": "04:15",
          "note": "Deep dive into microservices migration"
        },
        {
          "timestamp": "22:30",
          "note": "Live architecture whiteboarding"
        }
      ],
      "transcript": [
        {
          "speaker": "Alex Morgan",
          "time": "00:02",
          "text": "Hello Maya Patel, welcome to the AI Architecture & Deep Learning Technical Screen round."
        },
        {
          "speaker": "Maya Patel",
          "time": "00:10",
          "text": "Thank you, glad to be here and excited to discuss the role."
        },
        {
          "speaker": "Alex Morgan",
          "time": "01:00",
          "text": "Could you walk me through your experience with large-scale distributed systems?"
        },
        {
          "speaker": "Maya Patel",
          "time": "01:25",
          "text": "In my recent role, I led the migration of monolithic microservices to an event-driven Kafka architecture."
        },
        {
          "speaker": "Alex Morgan",
          "time": "12:40",
          "text": "Excellent explanation. How did you handle partition rebalancing and data consistency?"
        },
        {
          "speaker": "Maya Patel",
          "time": "13:10",
          "text": "We implemented idempotency keys, dead-letter queues, and exactly-once processing semantics."
        }
      ],
      "techCheckMeta": {
        "cameraVerified": true,
        "micVerified": true,
        "latencyMs": 22,
        "timestamp": "2026-09-08T11:00:18.534Z"
      },
      "durationMinutes": 45,
      "endedAt": "2026-09-08T11:00:18.541Z"
    },
    {
      "_id": "doc_793f8365ef289fea",
      "createdAt": "2026-10-06T08:47:41.955Z",
      "updatedAt": "2026-10-06T08:47:41.955Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "interviewId": "doc_642906b5cefe367e",
      "candidateId": "doc_08f6825f7b58afff",
      "roomToken": "room_doc_642906b5cefe367e_1791276461954",
      "recordingStatus": "READY",
      "recordingUrl": null,
      "startedAt": "2026-10-06T08:47:41.954Z",
      "candidateConsentGiven": false,
      "hardwareCheckPassed": false,
      "bookmarks": [],
      "transcript": []
    }
  ],
  "verahireInterviews": [
    {
      "_id": "doc_3088a4d36cbbc9f0",
      "createdAt": "2026-10-01T18:05:59.688Z",
      "updatedAt": "2026-10-09T16:29:31.679Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "jobId": "doc_bbe4c6051f27d640",
      "jobTitle": "Senior Full-Stack Engineer (React / Node.js)",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "applicationId": null,
      "status": "COMPLETED",
      "overallScore": 96,
      "evidenceScores": {
        "technical_depth": 99,
        "system_design": 98,
        "communication": 95,
        "situational_reasoning": 91
      },
      "criteria": [
        {
          "id": "technical_depth",
          "name": "Technical Competency & Domain Depth",
          "weight": 0.35,
          "targetSkills": [
            "react",
            "node.js",
            "typescript",
            "mongodb"
          ],
          "description": "Demonstrated mastery of core stack: react, node.js, typescript, mongodb, docker"
        },
        {
          "id": "system_design",
          "name": "Architecture & Scalability",
          "weight": 0.25,
          "targetSkills": [
            "scalability",
            "architecture",
            "distributed systems",
            "microservices"
          ],
          "description": "Experience leading resilient distributed architectures for 5+ years"
        },
        {
          "id": "communication",
          "name": "Articulation & Communication Clarity",
          "weight": 0.2,
          "description": "Ability to explain complex engineering tradeoffs concisely and accurately"
        },
        {
          "id": "situational_reasoning",
          "name": "Problem Solving & Escalation Handling",
          "weight": 0.2,
          "description": "Handling critical incidents, production escalations, and cross-functional friction"
        }
      ],
      "transcript": [
        {
          "question": "Tell me about your background and what motivated you to apply for the Senior Full-Stack Engineer (React / Node.js) position.",
          "candidateResponse": "I have been engineering distributed systems for over 6.2 years, focusing on high availability, clean domain architectures, and mentoring developers.",
          "confidence": 0.94,
          "keyInsights": "Strong clarity, direct role alignment, concise articulation."
        },
        {
          "question": "Can you walk me through a challenging problem you solved using react in a production environment?",
          "candidateResponse": "In our last project, we handled 50,000 requests/sec by introducing async worker queues, Redis caching layers, and database sharding.",
          "confidence": 0.96,
          "keyInsights": "Demonstrated deep practical familiarity with high-scale constraints and distributed caching."
        },
        {
          "question": "Tell me about a time you handled a difficult customer escalation or critical production outage under high pressure.",
          "candidateResponse": "When a critical payment webhook failed during peak traffic, I orchestrated a rollback within 4 minutes, triggered automated replay from Kafka, and led a blameless post-mortem.",
          "confidence": 0.92,
          "keyInsights": "Calm situational leadership, methodical root-cause analysis."
        }
      ],
      "speechConfidence": 0.94,
      "voiceDurationMinutes": 18,
      "audioWaveformUrl": "https://vault.enterprise-ats.io/verahire/audio_doc_08f6825f7b58afff_1791563371679.wav",
      "recommendation": "STRONG_SHORTLIST",
      "keyEvidenceSummary": "Jordan scored 96/100 in autonomous voice screening. Highly articulate on distributed system tradeoffs, scored 99% in technical depth, and demonstrated high-pressure incident mitigation.",
      "completedAt": "2026-10-09T16:29:31.679Z"
    }
  ],
  "deelContracts": [
    {
      "_id": "doc_658f180225da01a8",
      "createdAt": "2026-10-01T18:05:59.692Z",
      "updatedAt": "2026-10-01T18:05:59.692Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "jobId": "doc_bbe4c6051f27d640",
      "contractNumber": "DEEL-IN-959692",
      "status": "AWAITING_SIGNATURE",
      "terms": {
        "contractNumber": "DEEL-IN-959692",
        "country": "India",
        "countryCode": "IN",
        "workerType": "FULL_TIME_EOR",
        "eorLegalEntity": "Deel India Pvt Ltd (EOR)",
        "jobTitle": "Senior Full-Stack Engineer (React / Node.js)",
        "annualSalary": 2100000,
        "currency": "INR",
        "probationMonths": 3,
        "noticePeriodDays": 30,
        "ipAssignmentClause": "All intellectual property, patents, source code, and deliverables created during the engagement vest 100% irrevocably with the Client.",
        "mandatoryStatutoryBenefits": [
          "Provident Fund (EPF 12%)",
          "Gratuity Act",
          "Medical Insurance (ESI/Group Cover)"
        ],
        "requiredTaxDocuments": [
          "PAN Verification",
          "Form 16 / TDS Slabs",
          "Aadhaar / UAN Registration"
        ]
      },
      "contractPdfUrl": "https://vault.enterprise-ats.io/deel/contracts/DEEL-IN-959692.pdf"
    },
    {
      "_id": "doc_526f2c0199eb524d",
      "createdAt": "2026-10-01T18:10:37.498Z",
      "updatedAt": "2026-10-01T18:10:37.498Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "jobId": "doc_bbe4c6051f27d640",
      "contractNumber": "DEEL-IN-237497",
      "status": "AWAITING_SIGNATURE",
      "terms": {
        "contractNumber": "DEEL-IN-237497",
        "country": "India",
        "countryCode": "IN",
        "workerType": "FULL_TIME_EOR",
        "eorLegalEntity": "Deel India Pvt Ltd (EOR)",
        "jobTitle": "Senior Full-Stack Engineer (React / Node.js)",
        "annualSalary": 2100000,
        "currency": "INR",
        "probationMonths": 3,
        "noticePeriodDays": 30,
        "ipAssignmentClause": "All intellectual property, patents, source code, and deliverables created during the engagement vest 100% irrevocably with the Client.",
        "mandatoryStatutoryBenefits": [
          "Provident Fund (EPF 12%)",
          "Gratuity Act",
          "Medical Insurance (ESI/Group Cover)"
        ],
        "requiredTaxDocuments": [
          "PAN Verification",
          "Form 16 / TDS Slabs",
          "Aadhaar / UAN Registration"
        ]
      },
      "contractPdfUrl": "https://vault.enterprise-ats.io/deel/contracts/DEEL-IN-237497.pdf"
    },
    {
      "_id": "doc_b449efd4cf6698fb",
      "createdAt": "2026-10-01T18:11:18.839Z",
      "updatedAt": "2026-10-01T18:11:18.839Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "jobId": "doc_bbe4c6051f27d640",
      "contractNumber": "DEEL-IN-278839",
      "status": "AWAITING_SIGNATURE",
      "terms": {
        "contractNumber": "DEEL-IN-278839",
        "country": "India",
        "countryCode": "IN",
        "workerType": "FULL_TIME_EOR",
        "eorLegalEntity": "Deel India Pvt Ltd (EOR)",
        "jobTitle": "Senior Full-Stack Engineer (React / Node.js)",
        "annualSalary": 2100000,
        "currency": "INR",
        "probationMonths": 3,
        "noticePeriodDays": 30,
        "ipAssignmentClause": "All intellectual property, patents, source code, and deliverables created during the engagement vest 100% irrevocably with the Client.",
        "mandatoryStatutoryBenefits": [
          "Provident Fund (EPF 12%)",
          "Gratuity Act",
          "Medical Insurance (ESI/Group Cover)"
        ],
        "requiredTaxDocuments": [
          "PAN Verification",
          "Form 16 / TDS Slabs",
          "Aadhaar / UAN Registration"
        ]
      },
      "contractPdfUrl": "https://vault.enterprise-ats.io/deel/contracts/DEEL-IN-278839.pdf"
    },
    {
      "_id": "doc_60549d8d9c3efbc2",
      "createdAt": "2026-10-05T16:10:20.800Z",
      "updatedAt": "2026-10-05T16:10:20.803Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_d7fc3258bf700292",
      "candidateName": "Rahul Bajediyal",
      "candidateEmail": "rahul.bajediyal@gmail.com",
      "jobId": null,
      "contractNumber": "DEEL-IN-620800",
      "status": "AWAITING_SIGNATURE",
      "terms": {
        "contractNumber": "DEEL-IN-620800",
        "country": "India",
        "countryCode": "IN",
        "workerType": "FULL_TIME_EOR",
        "eorLegalEntity": "Deel India Pvt Ltd (EOR)",
        "jobTitle": "Senior Engineer",
        "annualSalary": "1800000",
        "currency": "INR",
        "probationMonths": 3,
        "noticePeriodDays": 30,
        "ipAssignmentClause": "All intellectual property, patents, source code, and deliverables created during the engagement vest 100% irrevocably with the Client.",
        "mandatoryStatutoryBenefits": [
          "Provident Fund (EPF 12%)",
          "Gratuity Act",
          "Medical Insurance (ESI/Group Cover)"
        ],
        "requiredTaxDocuments": [
          "PAN Verification",
          "Form 16 / TDS Slabs",
          "Aadhaar / UAN Registration"
        ]
      },
      "contractPdfUrl": "https://vault.enterprise-ats.io/deel/contracts/DEEL-IN-620800.pdf"
    },
    {
      "_id": "doc_ac0af070cd15e5b7",
      "createdAt": "2026-10-06T09:02:32.222Z",
      "updatedAt": "2026-10-06T09:02:32.222Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "jobId": "doc_bbe4c6051f27d640",
      "contractNumber": "DEEL-IN-352221",
      "status": "AWAITING_SIGNATURE",
      "terms": {
        "contractNumber": "DEEL-IN-352221",
        "country": "India",
        "countryCode": "IN",
        "workerType": "FULL_TIME_EOR",
        "eorLegalEntity": "Deel India Pvt Ltd (EOR)",
        "jobTitle": "Senior Full-Stack Engineer (React / Node.js)",
        "annualSalary": 2100000,
        "currency": "INR",
        "probationMonths": 3,
        "noticePeriodDays": 30,
        "ipAssignmentClause": "All intellectual property, patents, source code, and deliverables created during the engagement vest 100% irrevocably with the Client.",
        "mandatoryStatutoryBenefits": [
          "Provident Fund (EPF 12%)",
          "Gratuity Act",
          "Medical Insurance (ESI/Group Cover)"
        ],
        "requiredTaxDocuments": [
          "PAN Verification",
          "Form 16 / TDS Slabs",
          "Aadhaar / UAN Registration"
        ]
      },
      "contractPdfUrl": "https://vault.enterprise-ats.io/deel/contracts/DEEL-IN-352221.pdf"
    },
    {
      "_id": "doc_573c7e99827f159f",
      "createdAt": "2026-10-06T09:07:11.027Z",
      "updatedAt": "2026-10-06T09:07:11.027Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "jobId": "doc_bbe4c6051f27d640",
      "contractNumber": "DEEL-IN-631027",
      "status": "AWAITING_SIGNATURE",
      "terms": {
        "contractNumber": "DEEL-IN-631027",
        "country": "India",
        "countryCode": "IN",
        "workerType": "FULL_TIME_EOR",
        "eorLegalEntity": "Deel India Pvt Ltd (EOR)",
        "jobTitle": "Senior Full-Stack Engineer (React / Node.js)",
        "annualSalary": 2100000,
        "currency": "INR",
        "probationMonths": 3,
        "noticePeriodDays": 30,
        "ipAssignmentClause": "All intellectual property, patents, source code, and deliverables created during the engagement vest 100% irrevocably with the Client.",
        "mandatoryStatutoryBenefits": [
          "Provident Fund (EPF 12%)",
          "Gratuity Act",
          "Medical Insurance (ESI/Group Cover)"
        ],
        "requiredTaxDocuments": [
          "PAN Verification",
          "Form 16 / TDS Slabs",
          "Aadhaar / UAN Registration"
        ]
      },
      "contractPdfUrl": "https://vault.enterprise-ats.io/deel/contracts/DEEL-IN-631027.pdf"
    },
    {
      "_id": "doc_9142f89e2e295941",
      "createdAt": "2026-10-06T09:14:23.479Z",
      "updatedAt": "2026-10-06T09:14:23.479Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "jobId": "doc_bbe4c6051f27d640",
      "contractNumber": "DEEL-IN-063479",
      "status": "AWAITING_SIGNATURE",
      "terms": {
        "contractNumber": "DEEL-IN-063479",
        "country": "India",
        "countryCode": "IN",
        "workerType": "FULL_TIME_EOR",
        "eorLegalEntity": "Deel India Pvt Ltd (EOR)",
        "jobTitle": "Senior Full-Stack Engineer (React / Node.js)",
        "annualSalary": 2100000,
        "currency": "INR",
        "probationMonths": 3,
        "noticePeriodDays": 30,
        "ipAssignmentClause": "All intellectual property, patents, source code, and deliverables created during the engagement vest 100% irrevocably with the Client.",
        "mandatoryStatutoryBenefits": [
          "Provident Fund (EPF 12%)",
          "Gratuity Act",
          "Medical Insurance (ESI/Group Cover)"
        ],
        "requiredTaxDocuments": [
          "PAN Verification",
          "Form 16 / TDS Slabs",
          "Aadhaar / UAN Registration"
        ]
      },
      "contractPdfUrl": "https://vault.enterprise-ats.io/deel/contracts/DEEL-IN-063479.pdf"
    },
    {
      "_id": "doc_4b306c6e2f16157f",
      "createdAt": "2026-10-09T14:38:53.963Z",
      "updatedAt": "2026-10-09T14:38:53.963Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "jobId": "doc_bbe4c6051f27d640",
      "contractNumber": "DEEL-IN-733963",
      "status": "AWAITING_SIGNATURE",
      "terms": {
        "contractNumber": "DEEL-IN-733963",
        "country": "India",
        "countryCode": "IN",
        "workerType": "FULL_TIME_EOR",
        "eorLegalEntity": "Deel India Pvt Ltd (EOR)",
        "jobTitle": "Senior Full-Stack Engineer (React / Node.js)",
        "annualSalary": 2100000,
        "currency": "INR",
        "probationMonths": 3,
        "noticePeriodDays": 30,
        "ipAssignmentClause": "All intellectual property, patents, source code, and deliverables created during the engagement vest 100% irrevocably with the Client.",
        "mandatoryStatutoryBenefits": [
          "Provident Fund (EPF 12%)",
          "Gratuity Act",
          "Medical Insurance (ESI/Group Cover)"
        ],
        "requiredTaxDocuments": [
          "PAN Verification",
          "Form 16 / TDS Slabs",
          "Aadhaar / UAN Registration"
        ]
      },
      "contractPdfUrl": "https://vault.enterprise-ats.io/deel/contracts/DEEL-IN-733963.pdf"
    },
    {
      "_id": "doc_766c108d93fd04de",
      "createdAt": "2026-10-09T16:22:30.029Z",
      "updatedAt": "2026-10-09T16:22:30.029Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "jobId": "doc_bbe4c6051f27d640",
      "contractNumber": "DEEL-IN-950029",
      "status": "AWAITING_SIGNATURE",
      "terms": {
        "contractNumber": "DEEL-IN-950029",
        "country": "India",
        "countryCode": "IN",
        "workerType": "FULL_TIME_EOR",
        "eorLegalEntity": "Deel India Pvt Ltd (EOR)",
        "jobTitle": "Senior Full-Stack Engineer (React / Node.js)",
        "annualSalary": 2100000,
        "currency": "INR",
        "probationMonths": 3,
        "noticePeriodDays": 30,
        "ipAssignmentClause": "All intellectual property, patents, source code, and deliverables created during the engagement vest 100% irrevocably with the Client.",
        "mandatoryStatutoryBenefits": [
          "Provident Fund (EPF 12%)",
          "Gratuity Act",
          "Medical Insurance (ESI/Group Cover)"
        ],
        "requiredTaxDocuments": [
          "PAN Verification",
          "Form 16 / TDS Slabs",
          "Aadhaar / UAN Registration"
        ]
      },
      "contractPdfUrl": "https://vault.enterprise-ats.io/deel/contracts/DEEL-IN-950029.pdf"
    },
    {
      "_id": "doc_03247b827c3eeba3",
      "createdAt": "2026-10-09T16:29:31.683Z",
      "updatedAt": "2026-10-09T16:29:31.683Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "jobId": "doc_bbe4c6051f27d640",
      "contractNumber": "DEEL-IN-371682",
      "status": "AWAITING_SIGNATURE",
      "terms": {
        "contractNumber": "DEEL-IN-371682",
        "country": "India",
        "countryCode": "IN",
        "workerType": "FULL_TIME_EOR",
        "eorLegalEntity": "Deel India Pvt Ltd (EOR)",
        "jobTitle": "Senior Full-Stack Engineer (React / Node.js)",
        "annualSalary": 2100000,
        "currency": "INR",
        "probationMonths": 3,
        "noticePeriodDays": 30,
        "ipAssignmentClause": "All intellectual property, patents, source code, and deliverables created during the engagement vest 100% irrevocably with the Client.",
        "mandatoryStatutoryBenefits": [
          "Provident Fund (EPF 12%)",
          "Gratuity Act",
          "Medical Insurance (ESI/Group Cover)"
        ],
        "requiredTaxDocuments": [
          "PAN Verification",
          "Form 16 / TDS Slabs",
          "Aadhaar / UAN Registration"
        ]
      },
      "contractPdfUrl": "https://vault.enterprise-ats.io/deel/contracts/DEEL-IN-371682.pdf"
    }
  ],
  "deelWorkers": [
    {
      "_id": "doc_ce5963bdc3218b91",
      "createdAt": "2026-10-01T18:05:59.693Z",
      "updatedAt": "2026-10-09T16:29:31.685Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "workerId": "DEEL-WRK-371684",
      "candidateId": "doc_08f6825f7b58afff",
      "contractId": "doc_03247b827c3eeba3",
      "fullName": "Jordan Miller",
      "email": "jordan.miller@example.com",
      "phone": "+1 (415) 555-0142",
      "country": "India",
      "countryCode": "IN",
      "workerType": "FULL_TIME_EOR",
      "eorEntity": "Deel India Pvt Ltd (EOR)",
      "hrStatus": "ACTIVE_ONBOARDING",
      "complianceStatus": "VERIFIED",
      "taxDocumentsCollected": [
        {
          "docName": "PAN Verification",
          "status": "COLLECTED"
        },
        {
          "docName": "Form 16 / TDS Slabs",
          "status": "COLLECTED"
        },
        {
          "docName": "Aadhaar / UAN Registration",
          "status": "COLLECTED"
        }
      ],
      "benefitsEnrolled": [
        {
          "benefit": "Provident Fund (EPF 12%)",
          "status": "ACTIVE"
        },
        {
          "benefit": "Gratuity Act",
          "status": "ACTIVE"
        },
        {
          "benefit": "Medical Insurance (ESI/Group Cover)",
          "status": "ACTIVE"
        }
      ],
      "globalPayrollStatus": "SYNCED_READY",
      "bankDetails": {
        "accountHolder": "Jordan Miller",
        "ibanOrAccount": "ACCT-2488575897",
        "swiftOrIfsc": "HDFC0001234",
        "payoutCurrency": "INR"
      },
      "onboardedAt": "2026-10-09T16:29:31.685Z"
    },
    {
      "_id": "doc_091ec2ce8676c6c8",
      "createdAt": "2026-10-05T16:10:20.813Z",
      "updatedAt": "2026-10-05T16:10:20.813Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "workerId": "DEEL-WRK-620813",
      "candidateId": "doc_d7fc3258bf700292",
      "contractId": "doc_60549d8d9c3efbc2",
      "fullName": "Rahul Bajediyal",
      "email": "rahul.bajediyal@gmail.com",
      "phone": "+1 555-0199",
      "country": "India",
      "countryCode": "IN",
      "workerType": "FULL_TIME_EOR",
      "eorEntity": "Deel India Pvt Ltd (EOR)",
      "hrStatus": "ACTIVE_ONBOARDING",
      "complianceStatus": "VERIFIED",
      "taxDocumentsCollected": [
        {
          "docName": "PAN Verification",
          "status": "COLLECTED"
        },
        {
          "docName": "Form 16 / TDS Slabs",
          "status": "COLLECTED"
        },
        {
          "docName": "Aadhaar / UAN Registration",
          "status": "COLLECTED"
        }
      ],
      "benefitsEnrolled": [
        {
          "benefit": "Provident Fund (EPF 12%)",
          "status": "ACTIVE"
        },
        {
          "benefit": "Gratuity Act",
          "status": "ACTIVE"
        },
        {
          "benefit": "Medical Insurance (ESI/Group Cover)",
          "status": "ACTIVE"
        }
      ],
      "globalPayrollStatus": "SYNCED_READY",
      "bankDetails": {
        "accountHolder": "Rahul Bajediyal",
        "ibanOrAccount": "ACCT-8779195445",
        "swiftOrIfsc": "HDFC0001234",
        "payoutCurrency": "INR"
      },
      "onboardedAt": "2026-10-05T16:10:20.813Z"
    },
    {
      "_id": "doc_2ef01f1a8f935165",
      "createdAt": "2026-10-06T08:59:36.228Z",
      "updatedAt": "2026-10-06T08:59:36.228Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "workerId": "DEEL-WRK-176228",
      "candidateId": "doc_42d065f3573a92bf",
      "contractId": null,
      "fullName": "Emily Zhao",
      "email": "emily.zhao@example.com",
      "phone": "+1 (408) 555-0111",
      "country": "India",
      "countryCode": "IN",
      "workerType": "FULL_TIME_EOR",
      "eorEntity": "Deel India Pvt Ltd (EOR)",
      "hrStatus": "ACTIVE_ONBOARDING",
      "complianceStatus": "VERIFIED",
      "taxDocumentsCollected": [
        {
          "docName": "PAN Verification",
          "status": "COLLECTED"
        },
        {
          "docName": "Form 16 / TDS Slabs",
          "status": "COLLECTED"
        },
        {
          "docName": "Aadhaar / UAN Registration",
          "status": "COLLECTED"
        }
      ],
      "benefitsEnrolled": [
        {
          "benefit": "Provident Fund (EPF 12%)",
          "status": "ACTIVE"
        },
        {
          "benefit": "Gratuity Act",
          "status": "ACTIVE"
        },
        {
          "benefit": "Medical Insurance (ESI/Group Cover)",
          "status": "ACTIVE"
        }
      ],
      "globalPayrollStatus": "SYNCED_READY",
      "bankDetails": {
        "accountHolder": "Emily Zhao",
        "ibanOrAccount": "ACCT-8568987161",
        "swiftOrIfsc": "HDFC0001234",
        "payoutCurrency": "INR"
      },
      "onboardedAt": "2026-10-06T08:59:36.228Z"
    }
  ],
  "payrollRecords": [
    {
      "_id": "doc_6f3125d22fdc7262",
      "createdAt": "2026-10-09T16:29:31.688Z",
      "updatedAt": "2026-10-09T16:29:31.690Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "employeeName": "Jordan Miller",
      "email": "jordan.miller@example.com",
      "phone": "+1 (415) 555-0142",
      "designation": "Full Stack Engineer",
      "panNumber": "ABCDE1234F",
      "uanNumber": "107208419218",
      "esicNumber": "3100830152",
      "ctcBreakup": {
        "annualCTC": 1800000,
        "currency": "INR",
        "monthlyGross": 150000,
        "components": {
          "basicSalary": {
            "monthly": 75000,
            "annual": 900000,
            "label": "Basic Salary (50%)"
          },
          "hra": {
            "monthly": 30000,
            "annual": 360000,
            "label": "House Rent Allowance (HRA 20%)"
          },
          "specialAllowance": {
            "monthly": 45000,
            "annual": 540000,
            "label": "Special Allowance"
          }
        },
        "deductions": {
          "employeePF": {
            "monthly": 1800,
            "annual": 21600,
            "label": "Provident Fund (EPF 12%)"
          },
          "employeeESI": {
            "monthly": 0,
            "annual": 0,
            "label": "Employee State Insurance (ESI)"
          },
          "professionalTax": {
            "monthly": 200,
            "annual": 2400,
            "label": "Professional Tax (PT)"
          },
          "tds": {
            "monthly": 20000,
            "annual": 240000,
            "label": "TDS (Income Tax Slabs)"
          },
          "totalDeductions": {
            "monthly": 22000,
            "annual": 264000
          }
        },
        "employerContributions": {
          "employerPF": {
            "monthly": 1800,
            "annual": 21600,
            "label": "Employer PF Contribution"
          },
          "employerESI": {
            "monthly": 0,
            "annual": 0,
            "label": "Employer ESI Contribution"
          },
          "gratuity": {
            "monthly": 3607,
            "annual": 43284,
            "label": "Gratuity Provision (4.81%)"
          }
        },
        "netTakeHome": {
          "monthly": 128000,
          "annual": 1536000,
          "label": "Net In-Hand Take Home Pay"
        },
        "complianceBadges": [
          "EPF Act 1952 Compliant",
          "ESIC Act 1948 Compliant",
          "TDS Section 192 Compliant",
          "Payment of Gratuity Act 1972"
        ]
      },
      "paymentMethod": "RAZORPAYX_DIRECT_BANK_TRANSFER",
      "bankDetails": {
        "accountHolder": "Jordan Miller",
        "accountNumber": "910254906766",
        "ifscCode": "HDFC0001234",
        "bankName": "HDFC Bank Ltd"
      },
      "payrollStatus": "ACTIVE",
      "lastDisbursementDate": "2026-10-09T16:29:31.690Z",
      "lastDisbursementUTR": "RZPX_UTR_1791563371690_3864"
    },
    {
      "_id": "doc_a8d84f13a5cfd5a2",
      "createdAt": "2026-10-06T08:59:36.230Z",
      "updatedAt": "2026-10-06T08:59:36.230Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_42d065f3573a92bf",
      "employeeName": "Emily Zhao",
      "email": "emily.zhao@example.com",
      "phone": "+1 (408) 555-0111",
      "designation": "Full Stack Engineer",
      "panNumber": "ABCDE1234F",
      "uanNumber": "105951889566",
      "esicNumber": "3100299941",
      "ctcBreakup": {
        "annualCTC": 1800000,
        "currency": "INR",
        "monthlyGross": 150000,
        "components": {
          "basicSalary": {
            "monthly": 75000,
            "annual": 900000,
            "label": "Basic Salary (50%)"
          },
          "hra": {
            "monthly": 30000,
            "annual": 360000,
            "label": "House Rent Allowance (HRA 20%)"
          },
          "specialAllowance": {
            "monthly": 45000,
            "annual": 540000,
            "label": "Special Allowance"
          }
        },
        "deductions": {
          "employeePF": {
            "monthly": 1800,
            "annual": 21600,
            "label": "Provident Fund (EPF 12%)"
          },
          "employeeESI": {
            "monthly": 0,
            "annual": 0,
            "label": "Employee State Insurance (ESI)"
          },
          "professionalTax": {
            "monthly": 200,
            "annual": 2400,
            "label": "Professional Tax (PT)"
          },
          "tds": {
            "monthly": 20000,
            "annual": 240000,
            "label": "TDS (Income Tax Slabs)"
          },
          "totalDeductions": {
            "monthly": 22000,
            "annual": 264000
          }
        },
        "employerContributions": {
          "employerPF": {
            "monthly": 1800,
            "annual": 21600,
            "label": "Employer PF Contribution"
          },
          "employerESI": {
            "monthly": 0,
            "annual": 0,
            "label": "Employer ESI Contribution"
          },
          "gratuity": {
            "monthly": 3607,
            "annual": 43284,
            "label": "Gratuity Provision (4.81%)"
          }
        },
        "netTakeHome": {
          "monthly": 128000,
          "annual": 1536000,
          "label": "Net In-Hand Take Home Pay"
        },
        "complianceBadges": [
          "EPF Act 1952 Compliant",
          "ESIC Act 1948 Compliant",
          "TDS Section 192 Compliant",
          "Payment of Gratuity Act 1972"
        ]
      },
      "paymentMethod": "RAZORPAYX_DIRECT_BANK_TRANSFER",
      "bankDetails": {
        "accountHolder": "Emily Zhao",
        "accountNumber": "910278839510",
        "ifscCode": "HDFC0001234",
        "bankName": "HDFC Bank Ltd"
      },
      "payrollStatus": "ACTIVE",
      "lastDisbursementDate": null,
      "lastDisbursementUTR": null
    }
  ],
  "payrollPayouts": [
    {
      "_id": "doc_875eebca6a7a965e",
      "createdAt": "2026-10-01T18:05:59.700Z",
      "updatedAt": "2026-10-01T18:05:59.700Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "recordId": "doc_6f3125d22fdc7262",
      "employeeName": "Jordan Miller",
      "month": "October 2026",
      "amount": 128000,
      "currency": "INR",
      "utrNumber": "RZPX_UTR_1790877959698_4363",
      "status": "PROCESSED_SUCCESS",
      "bankRef": "910210130283",
      "disbursedAt": "2026-10-01T18:05:59.700Z"
    },
    {
      "_id": "doc_8ba661bcf51a50bf",
      "createdAt": "2026-10-01T18:10:37.508Z",
      "updatedAt": "2026-10-01T18:10:37.508Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "recordId": "doc_6f3125d22fdc7262",
      "employeeName": "Jordan Miller",
      "month": "October 2026",
      "amount": 128000,
      "currency": "INR",
      "utrNumber": "RZPX_UTR_1790878237506_8403",
      "status": "PROCESSED_SUCCESS",
      "bankRef": "910275787439",
      "disbursedAt": "2026-10-01T18:10:37.508Z"
    },
    {
      "_id": "doc_e4e99c77332ca91d",
      "createdAt": "2026-10-01T18:11:18.848Z",
      "updatedAt": "2026-10-01T18:11:18.848Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "recordId": "doc_6f3125d22fdc7262",
      "employeeName": "Jordan Miller",
      "month": "October 2026",
      "amount": 128000,
      "currency": "INR",
      "utrNumber": "RZPX_UTR_1790878278846_9330",
      "status": "PROCESSED_SUCCESS",
      "bankRef": "910264680481",
      "disbursedAt": "2026-10-01T18:11:18.848Z"
    },
    {
      "_id": "doc_b7f5e14a9a8159cd",
      "createdAt": "2026-10-06T09:02:32.232Z",
      "updatedAt": "2026-10-06T09:02:32.232Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "recordId": "doc_6f3125d22fdc7262",
      "employeeName": "Jordan Miller",
      "month": "October 2026",
      "amount": 128000,
      "currency": "INR",
      "utrNumber": "RZPX_UTR_1791277352229_8423",
      "status": "PROCESSED_SUCCESS",
      "bankRef": "910273252872",
      "disbursedAt": "2026-10-06T09:02:32.231Z"
    },
    {
      "_id": "doc_74d806a84c055ca8",
      "createdAt": "2026-10-06T09:07:11.039Z",
      "updatedAt": "2026-10-06T09:07:11.039Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "recordId": "doc_6f3125d22fdc7262",
      "employeeName": "Jordan Miller",
      "month": "October 2026",
      "amount": 128000,
      "currency": "INR",
      "utrNumber": "RZPX_UTR_1791277631037_1629",
      "status": "PROCESSED_SUCCESS",
      "bankRef": "910278665510",
      "disbursedAt": "2026-10-06T09:07:11.039Z"
    },
    {
      "_id": "doc_5cf2cdefebd7bab4",
      "createdAt": "2026-10-06T09:14:23.489Z",
      "updatedAt": "2026-10-06T09:14:23.489Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "recordId": "doc_6f3125d22fdc7262",
      "employeeName": "Jordan Miller",
      "month": "October 2026",
      "amount": 128000,
      "currency": "INR",
      "utrNumber": "RZPX_UTR_1791278063487_4590",
      "status": "PROCESSED_SUCCESS",
      "bankRef": "910253801120",
      "disbursedAt": "2026-10-06T09:14:23.489Z"
    },
    {
      "_id": "doc_d6874fc152471cb7",
      "createdAt": "2026-10-09T14:38:53.972Z",
      "updatedAt": "2026-10-09T14:38:53.972Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "recordId": "doc_6f3125d22fdc7262",
      "employeeName": "Jordan Miller",
      "month": "October 2026",
      "amount": 128000,
      "currency": "INR",
      "utrNumber": "RZPX_UTR_1791556733970_8780",
      "status": "PROCESSED_SUCCESS",
      "bankRef": "910238497238",
      "disbursedAt": "2026-10-09T14:38:53.972Z"
    },
    {
      "_id": "doc_2933a8c3b382fa73",
      "createdAt": "2026-10-09T16:22:30.037Z",
      "updatedAt": "2026-10-09T16:22:30.037Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "recordId": "doc_6f3125d22fdc7262",
      "employeeName": "Jordan Miller",
      "month": "October 2026",
      "amount": 128000,
      "currency": "INR",
      "utrNumber": "RZPX_UTR_1791562950036_6498",
      "status": "PROCESSED_SUCCESS",
      "bankRef": "910237392328",
      "disbursedAt": "2026-10-09T16:22:30.037Z"
    },
    {
      "_id": "doc_6ec594d917f12d5b",
      "createdAt": "2026-10-09T16:29:31.691Z",
      "updatedAt": "2026-10-09T16:29:31.691Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "recordId": "doc_6f3125d22fdc7262",
      "employeeName": "Jordan Miller",
      "month": "October 2026",
      "amount": 128000,
      "currency": "INR",
      "utrNumber": "RZPX_UTR_1791563371690_3864",
      "status": "PROCESSED_SUCCESS",
      "bankRef": "910254906766",
      "disbursedAt": "2026-10-09T16:29:31.691Z"
    }
  ],
  "workflows": [
    {
      "_id": "doc_a8f54f2f0629368c",
      "createdAt": "2026-10-01T18:06:00.022Z",
      "updatedAt": "2026-10-09T16:29:31.939Z",
      "id": "rule_auto_reject_email",
      "name": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "description": "When candidate status is set to Rejected, automatically dispatch a polite, brand-safe Thank You email.",
      "isEnabled": true,
      "executionCount": 33,
      "lastTriggeredAt": "2026-10-09T16:29:31.939Z"
    },
    {
      "_id": "doc_6b2e16ce648f9ac3",
      "createdAt": "2026-10-01T18:06:00.024Z",
      "updatedAt": "2026-10-01T18:06:00.024Z",
      "id": "rule_knockout_to_verahire",
      "name": "Auto-Invite to VeraHire AI Screening",
      "trigger": "KNOCKOUT_PASSED",
      "description": "When applicant passes mandatory knockout questions, immediately send VeraHire autonomous voice screening link.",
      "isEnabled": true,
      "executionCount": 18
    },
    {
      "_id": "doc_95b4d81c353e516c",
      "createdAt": "2026-10-01T18:06:00.025Z",
      "updatedAt": "2026-10-01T18:06:00.025Z",
      "id": "rule_auto_interview_scheduling",
      "name": "Auto-Send Self-Scheduling Link",
      "trigger": "STAGE_MOVED_INTERVIEW",
      "description": "When candidate is advanced to Interview stage, send calendar link for instant slot self-selection.",
      "isEnabled": true,
      "executionCount": 31
    },
    {
      "_id": "doc_4cae31809c61dd49",
      "createdAt": "2026-10-01T18:06:00.026Z",
      "updatedAt": "2026-10-09T16:29:31.942Z",
      "id": "rule_offer_accepted_onboarding",
      "name": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "description": "Upon offer acceptance, automatically generate global EOR contracts and seed payroll record in RazorpayX.",
      "isEnabled": true,
      "executionCount": 22,
      "lastTriggeredAt": "2026-10-09T16:29:31.942Z"
    }
  ],
  "autopilotLogs": [
    {
      "_id": "doc_bcb0a14e9ae9be42",
      "createdAt": "2026-10-01T18:06:00.028Z",
      "updatedAt": "2026-10-01T18:06:00.028Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Test Candidate",
      "candidateEmail": "test.cand@example.com",
      "jobTitle": "Lead Architect",
      "actionResult": "Automated polite rejection email dispatched to test.cand@example.com for role Lead Architect. Rejection template rendered with zero recruiter manual effort.",
      "status": "SUCCESS",
      "executedAt": "2026-10-01T18:06:00.028Z"
    },
    {
      "_id": "doc_041fd1e98f998175",
      "createdAt": "2026-10-01T18:06:00.030Z",
      "updatedAt": "2026-10-01T18:06:00.030Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Accepted Candidate",
      "candidateEmail": "accepted@example.com",
      "jobTitle": "Principal Engineer",
      "actionResult": "Accepted offer triggered immediate worker creation in Deel Global HR and synced CTC into RazorpayX Payroll.",
      "status": "SUCCESS",
      "executedAt": "2026-10-01T18:06:00.030Z"
    },
    {
      "_id": "doc_67e95018b278c96c",
      "createdAt": "2026-10-01T18:10:37.780Z",
      "updatedAt": "2026-10-01T18:10:37.780Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Test Candidate",
      "candidateEmail": "test.cand@example.com",
      "jobTitle": "Lead Architect",
      "actionResult": "Automated polite rejection email dispatched to test.cand@example.com for role Lead Architect. Rejection template rendered with zero recruiter manual effort.",
      "status": "SUCCESS",
      "executedAt": "2026-10-01T18:10:37.780Z"
    },
    {
      "_id": "doc_dfac602e237261e8",
      "createdAt": "2026-10-01T18:10:37.783Z",
      "updatedAt": "2026-10-01T18:10:37.783Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Accepted Candidate",
      "candidateEmail": "accepted@example.com",
      "jobTitle": "Principal Engineer",
      "actionResult": "Accepted offer triggered immediate worker creation in Deel Global HR and synced CTC into RazorpayX Payroll.",
      "status": "SUCCESS",
      "executedAt": "2026-10-01T18:10:37.783Z"
    },
    {
      "_id": "doc_b12843c73e02686d",
      "createdAt": "2026-10-01T18:11:19.124Z",
      "updatedAt": "2026-10-01T18:11:19.124Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Test Candidate",
      "candidateEmail": "test.cand@example.com",
      "jobTitle": "Lead Architect",
      "actionResult": "Automated polite rejection email dispatched to test.cand@example.com for role Lead Architect. Rejection template rendered with zero recruiter manual effort.",
      "status": "SUCCESS",
      "executedAt": "2026-10-01T18:11:19.124Z"
    },
    {
      "_id": "doc_d507025580574d02",
      "createdAt": "2026-10-01T18:11:19.126Z",
      "updatedAt": "2026-10-01T18:11:19.126Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Accepted Candidate",
      "candidateEmail": "accepted@example.com",
      "jobTitle": "Principal Engineer",
      "actionResult": "Accepted offer triggered immediate worker creation in Deel Global HR and synced CTC into RazorpayX Payroll.",
      "status": "SUCCESS",
      "executedAt": "2026-10-01T18:11:19.126Z"
    },
    {
      "_id": "doc_a4a1c148d4581b1b",
      "createdAt": "2026-10-01T19:23:19.950Z",
      "updatedAt": "2026-10-01T19:23:19.950Z",
      "tenantId": "tenant_techcorp_global",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Vikram Mehta",
      "candidateEmail": "vikram.m@example.com",
      "jobTitle": "Senior Full-Stack Engineer",
      "actionResult": "Dispatched polite rejection email with feedback link. 0 manual seconds required.",
      "status": "SUCCESS",
      "executedAt": "2026-10-01T18:48:19.950Z"
    },
    {
      "_id": "doc_9666315e866ae4b7",
      "createdAt": "2026-10-01T19:23:19.952Z",
      "updatedAt": "2026-10-01T19:23:19.952Z",
      "tenantId": "tenant_techcorp_global",
      "ruleId": "rule_knockout_to_verahire",
      "ruleName": "Auto-Invite to VeraHire AI Screening",
      "trigger": "KNOCKOUT_PASSED",
      "candidateName": "Priya Sharma",
      "candidateEmail": "priya.sharma@example.com",
      "jobTitle": "Senior AI / NLP Engineer",
      "actionResult": "Sent VeraHire Voice Screening invitation; candidate completed 18-minute session (Score: 94%).",
      "status": "SUCCESS",
      "executedAt": "2026-10-01T17:53:19.950Z"
    },
    {
      "_id": "doc_22154f155ff89c15",
      "createdAt": "2026-10-01T19:23:19.957Z",
      "updatedAt": "2026-10-01T19:23:19.957Z",
      "tenantId": "tenant_techcorp_global",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Rohan Gupta",
      "candidateEmail": "rohan.g@example.com",
      "jobTitle": "Principal Cloud Architect",
      "actionResult": "Offer accepted. Auto-created Deel India EOR contract and synced CTC to RazorpayX (UAN: 101982736481).",
      "status": "SUCCESS",
      "executedAt": "2026-10-01T17:03:19.950Z"
    },
    {
      "_id": "doc_20d6ab50526a3f20",
      "createdAt": "2026-10-06T08:48:52.270Z",
      "updatedAt": "2026-10-06T08:48:52.270Z",
      "tenantId": "tenant_techcorp_global",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Vikram Mehta",
      "candidateEmail": "vikram.m@example.com",
      "jobTitle": "Senior Full-Stack Engineer",
      "actionResult": "Dispatched polite rejection email with feedback link. 0 manual seconds required.",
      "status": "SUCCESS",
      "executedAt": "2026-10-06T08:13:52.270Z"
    },
    {
      "_id": "doc_096c1408c9e558d2",
      "createdAt": "2026-10-06T08:48:52.272Z",
      "updatedAt": "2026-10-06T08:48:52.272Z",
      "tenantId": "tenant_techcorp_global",
      "ruleId": "rule_knockout_to_verahire",
      "ruleName": "Auto-Invite to VeraHire AI Screening",
      "trigger": "KNOCKOUT_PASSED",
      "candidateName": "Priya Sharma",
      "candidateEmail": "priya.sharma@example.com",
      "jobTitle": "Senior AI / NLP Engineer",
      "actionResult": "Sent VeraHire Voice Screening invitation; candidate completed 18-minute session (Score: 94%).",
      "status": "SUCCESS",
      "executedAt": "2026-10-06T07:18:52.270Z"
    },
    {
      "_id": "doc_05e8a73bde7eb2d3",
      "createdAt": "2026-10-06T08:48:52.274Z",
      "updatedAt": "2026-10-06T08:48:52.274Z",
      "tenantId": "tenant_techcorp_global",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Rohan Gupta",
      "candidateEmail": "rohan.g@example.com",
      "jobTitle": "Principal Cloud Architect",
      "actionResult": "Offer accepted. Auto-created Deel India EOR contract and synced CTC to RazorpayX (UAN: 101982736481).",
      "status": "SUCCESS",
      "executedAt": "2026-10-06T06:28:52.270Z"
    },
    {
      "_id": "doc_90167f1c1833d27c",
      "createdAt": "2026-10-06T08:59:36.232Z",
      "updatedAt": "2026-10-06T08:59:36.232Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Emily Zhao",
      "candidateEmail": "emily.zhao@example.com",
      "jobTitle": "Principal Product Designer (UI/UX Systems)",
      "actionResult": "Accepted offer triggered immediate worker creation in Deel Global HR and synced CTC into RazorpayX Payroll.",
      "status": "SUCCESS",
      "executedAt": "2026-10-06T08:59:36.232Z"
    },
    {
      "_id": "doc_12afef42e6c482ec",
      "createdAt": "2026-10-06T09:02:32.495Z",
      "updatedAt": "2026-10-06T09:02:32.495Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Test Candidate",
      "candidateEmail": "test.cand@example.com",
      "jobTitle": "Lead Architect",
      "actionResult": "Automated polite rejection email dispatched to test.cand@example.com for role Lead Architect. Rejection template rendered with zero recruiter manual effort.",
      "status": "SUCCESS",
      "executedAt": "2026-10-06T09:02:32.494Z"
    },
    {
      "_id": "doc_ef7319870bc50d2c",
      "createdAt": "2026-10-06T09:02:32.498Z",
      "updatedAt": "2026-10-06T09:02:32.498Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Accepted Candidate",
      "candidateEmail": "accepted@example.com",
      "jobTitle": "Principal Engineer",
      "actionResult": "Accepted offer triggered immediate worker creation in Deel Global HR and synced CTC into RazorpayX Payroll.",
      "status": "SUCCESS",
      "executedAt": "2026-10-06T09:02:32.498Z"
    },
    {
      "_id": "doc_17a03fa78c873938",
      "createdAt": "2026-10-06T09:07:11.287Z",
      "updatedAt": "2026-10-06T09:07:11.287Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Test Candidate",
      "candidateEmail": "test.cand@example.com",
      "jobTitle": "Lead Architect",
      "actionResult": "Automated polite rejection email dispatched to test.cand@example.com for role Lead Architect. Rejection template rendered with zero recruiter manual effort.",
      "status": "SUCCESS",
      "executedAt": "2026-10-06T09:07:11.287Z"
    },
    {
      "_id": "doc_e19103ddaa38b7fd",
      "createdAt": "2026-10-06T09:07:11.290Z",
      "updatedAt": "2026-10-06T09:07:11.290Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Accepted Candidate",
      "candidateEmail": "accepted@example.com",
      "jobTitle": "Principal Engineer",
      "actionResult": "Accepted offer triggered immediate worker creation in Deel Global HR and synced CTC into RazorpayX Payroll.",
      "status": "SUCCESS",
      "executedAt": "2026-10-06T09:07:11.290Z"
    },
    {
      "_id": "doc_51e85643fec80714",
      "createdAt": "2026-10-06T09:14:23.717Z",
      "updatedAt": "2026-10-06T09:14:23.717Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Test Candidate",
      "candidateEmail": "test.cand@example.com",
      "jobTitle": "Lead Architect",
      "actionResult": "Automated polite rejection email dispatched to test.cand@example.com for role Lead Architect. Rejection template rendered with zero recruiter manual effort.",
      "status": "SUCCESS",
      "executedAt": "2026-10-06T09:14:23.717Z"
    },
    {
      "_id": "doc_d3c58f79a50935e4",
      "createdAt": "2026-10-06T09:14:23.721Z",
      "updatedAt": "2026-10-06T09:14:23.721Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Accepted Candidate",
      "candidateEmail": "accepted@example.com",
      "jobTitle": "Principal Engineer",
      "actionResult": "Accepted offer triggered immediate worker creation in Deel Global HR and synced CTC into RazorpayX Payroll.",
      "status": "SUCCESS",
      "executedAt": "2026-10-06T09:14:23.721Z"
    },
    {
      "_id": "doc_b31aaa2275fa9416",
      "createdAt": "2026-10-09T14:38:54.298Z",
      "updatedAt": "2026-10-09T14:38:54.298Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Test Candidate",
      "candidateEmail": "test.cand@example.com",
      "jobTitle": "Lead Architect",
      "actionResult": "Automated polite rejection email dispatched to test.cand@example.com for role Lead Architect. Rejection template rendered with zero recruiter manual effort.",
      "status": "SUCCESS",
      "executedAt": "2026-10-09T14:38:54.298Z"
    },
    {
      "_id": "doc_09b6d59ca8b9192e",
      "createdAt": "2026-10-09T14:38:54.301Z",
      "updatedAt": "2026-10-09T14:38:54.301Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Accepted Candidate",
      "candidateEmail": "accepted@example.com",
      "jobTitle": "Principal Engineer",
      "actionResult": "Accepted offer triggered immediate worker creation in Deel Global HR and synced CTC into RazorpayX Payroll.",
      "status": "SUCCESS",
      "executedAt": "2026-10-09T14:38:54.301Z"
    },
    {
      "_id": "doc_b9a5bf4ed22eb0b3",
      "createdAt": "2026-10-09T16:22:30.295Z",
      "updatedAt": "2026-10-09T16:22:30.295Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Test Candidate",
      "candidateEmail": "test.cand@example.com",
      "jobTitle": "Lead Architect",
      "actionResult": "Automated polite rejection email dispatched to test.cand@example.com for role Lead Architect. Rejection template rendered with zero recruiter manual effort.",
      "status": "SUCCESS",
      "executedAt": "2026-10-09T16:22:30.295Z"
    },
    {
      "_id": "doc_15a41c0f1c28cfde",
      "createdAt": "2026-10-09T16:22:30.298Z",
      "updatedAt": "2026-10-09T16:22:30.298Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Accepted Candidate",
      "candidateEmail": "accepted@example.com",
      "jobTitle": "Principal Engineer",
      "actionResult": "Accepted offer triggered immediate worker creation in Deel Global HR and synced CTC into RazorpayX Payroll.",
      "status": "SUCCESS",
      "executedAt": "2026-10-09T16:22:30.298Z"
    },
    {
      "_id": "doc_6fa48ef68c3ac462",
      "createdAt": "2026-10-09T16:29:31.937Z",
      "updatedAt": "2026-10-09T16:29:31.937Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_auto_reject_email",
      "ruleName": "Polite Auto-Rejection Email",
      "trigger": "CANDIDATE_REJECTED",
      "candidateName": "Test Candidate",
      "candidateEmail": "test.cand@example.com",
      "jobTitle": "Lead Architect",
      "actionResult": "Automated polite rejection email dispatched to test.cand@example.com for role Lead Architect. Rejection template rendered with zero recruiter manual effort.",
      "status": "SUCCESS",
      "executedAt": "2026-10-09T16:29:31.937Z"
    },
    {
      "_id": "doc_f8c39cce254ba7f4",
      "createdAt": "2026-10-09T16:29:31.940Z",
      "updatedAt": "2026-10-09T16:29:31.940Z",
      "tenantId": "tenant_test",
      "ruleId": "rule_offer_accepted_onboarding",
      "ruleName": "Auto-Provision Deel HR & RazorpayX Payroll",
      "trigger": "OFFER_ACCEPTED",
      "candidateName": "Accepted Candidate",
      "candidateEmail": "accepted@example.com",
      "jobTitle": "Principal Engineer",
      "actionResult": "Accepted offer triggered immediate worker creation in Deel Global HR and synced CTC into RazorpayX Payroll.",
      "status": "SUCCESS",
      "executedAt": "2026-10-09T16:29:31.940Z"
    }
  ],
  "agencyClients": [
    {
      "_id": "doc_34ee22691c4e5643",
      "createdAt": "2026-10-01T19:23:03.675Z",
      "updatedAt": "2026-10-01T19:23:03.676Z",
      "name": "Nexus Cloud Technologies",
      "contactPerson": "David Vance",
      "contactEmail": "david.vance@nexuscloud.io",
      "industry": "Enterprise SaaS",
      "placementFeePercentage": 20,
      "paymentTerms": "NET_30",
      "activeRequisitions": 3,
      "status": "ACTIVE",
      "tenantId": "doc_a71bf70ad6ed56ce"
    },
    {
      "_id": "doc_dcdb385235f53359",
      "createdAt": "2026-10-01T19:23:03.677Z",
      "updatedAt": "2026-10-01T19:23:03.677Z",
      "name": "FinVanguard Global",
      "contactPerson": "Sophia Chen",
      "contactEmail": "sophia@finvanguard.com",
      "industry": "Fintech & Payments",
      "placementFeePercentage": 22,
      "paymentTerms": "NET_15",
      "activeRequisitions": 5,
      "status": "ACTIVE",
      "tenantId": "doc_a71bf70ad6ed56ce"
    },
    {
      "_id": "doc_6339b874aeabae40",
      "createdAt": "2026-10-01T19:23:03.678Z",
      "updatedAt": "2026-10-01T19:23:03.679Z",
      "name": "OmniHealth AI",
      "contactPerson": "Liam Gallagher",
      "contactEmail": "liam@omnihealth.ai",
      "industry": "Healthcare AI",
      "placementFeePercentage": 25,
      "paymentTerms": "NET_30",
      "activeRequisitions": 2,
      "status": "ACTIVE",
      "tenantId": "doc_a71bf70ad6ed56ce"
    }
  ],
  "agencyInvoices": [
    {
      "_id": "doc_b47d059f63673a87",
      "createdAt": "2026-10-01T19:23:03.686Z",
      "updatedAt": "2026-10-01T19:23:03.686Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "invoiceNumber": "INV-AGY-902144",
      "clientName": "Nexus Cloud Technologies",
      "candidateName": "Vikram Mehta",
      "annualCTC": 2400000,
      "feePercentage": 20,
      "baseFee": 480000,
      "taxAmount": 86400,
      "totalAmount": 566400,
      "currency": "INR",
      "status": "PAID",
      "dueDate": "2026-09-26T19:23:03.686Z",
      "issuedAt": "2026-09-06T19:23:03.686Z"
    }
  ],
  "agencySubmissions": [
    {
      "_id": "doc_4e326f12a041aabd",
      "createdAt": "2026-10-01T19:23:03.692Z",
      "updatedAt": "2026-10-01T19:23:03.692Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_08f6825f7b58afff",
      "candidateName": "Jordan Miller",
      "candidateEmail": "jordan.miller@example.com",
      "clientId": "doc_34ee22691c4e5643",
      "clientName": "Nexus Cloud Technologies",
      "targetRole": "Staff Infrastructure Architect",
      "expectedCTC": 2200000,
      "status": "CLIENT_PLACED",
      "submittedAt": "2026-09-30T19:23:03.692Z"
    },
    {
      "_id": "doc_fcc448650478e83a",
      "createdAt": "2026-10-01T19:23:03.694Z",
      "updatedAt": "2026-10-01T19:23:03.694Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_b69bfdad01273fff",
      "candidateName": "Maya Patel",
      "candidateEmail": "maya.patel@example.com",
      "clientId": "doc_dcdb385235f53359",
      "clientName": "FinVanguard Global",
      "targetRole": "Staff Infrastructure Architect",
      "expectedCTC": 2200000,
      "status": "INTERVIEW_SCHEDULED",
      "submittedAt": "2026-09-29T19:23:03.694Z"
    },
    {
      "_id": "doc_0fdf23a1fcee85da",
      "createdAt": "2026-10-01T19:23:03.697Z",
      "updatedAt": "2026-10-01T19:23:03.697Z",
      "tenantId": "doc_a71bf70ad6ed56ce",
      "candidateId": "doc_96353561e470fd87",
      "candidateName": "Lucas Silva",
      "candidateEmail": "lucas.silva@example.com",
      "clientId": "doc_34ee22691c4e5643",
      "clientName": "Nexus Cloud Technologies",
      "targetRole": "Staff Infrastructure Architect",
      "expectedCTC": 2200000,
      "status": "UNDER_REVIEW",
      "submittedAt": "2026-09-28T19:23:03.697Z"
    }
  ]
};
