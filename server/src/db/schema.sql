-- =========================================================================
-- Enterprise ATS: Full Relational MySQL Schema (MySQL 8.x / MariaDB)
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci, Engine: InnoDB
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `enterprise_ats` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `enterprise_ats`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. COMPANIES / TENANTS
CREATE TABLE IF NOT EXISTS `companies` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `subdomain` VARCHAR(100) NOT NULL UNIQUE,
  `is_active` TINYINT(1) DEFAULT 1,
  `branding` JSON NULL,
  `settings` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_companies_subdomain` (`subdomain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. USERS
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) DEFAULT '',
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'RECRUITER',
  `avatar_url` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_company` (`company_id`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ROLES & PERMISSIONS (RBAC)
CREATE TABLE IF NOT EXISTS `roles` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `permissions` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` VARCHAR(64) NOT NULL,
  `role_id` VARCHAR(64) NOT NULL,
  `assigned_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `role_id`),
  INDEX `idx_user_roles_user` (`user_id`),
  INDEX `idx_user_roles_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. JOBS & REQUISITIONS (Module 2: Requisitions, Approvals & 4-Board Auto-Syndication)
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `department_id` VARCHAR(100) NOT NULL,
  `location_id` VARCHAR(255) NOT NULL,
  `workplace_type` VARCHAR(50) NOT NULL DEFAULT 'HYBRID',
  `employment_type` VARCHAR(50) NOT NULL DEFAULT 'FULL_TIME',
  `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PENDING_APPROVAL, PUBLISHED, CLOSED, REJECTED
  `target_hire_date` DATE NULL,
  `approver_id` VARCHAR(64) NULL,
  `min_experience_years` DECIMAL(4,1) DEFAULT 3.0,
  `salary_min` DECIMAL(12,2) DEFAULT 0.00,
  `salary_max` DECIMAL(12,2) DEFAULT 0.00,
  `currency` VARCHAR(10) DEFAULT 'INR',
  `description_html` LONGTEXT NULL,
  `required_skills` JSON NULL,
  `preferred_skills` JSON NULL,
  `auto_syndicate` TINYINT(1) DEFAULT 1,
  `selected_job_boards` JSON NULL, -- ['naukri', 'indeed', 'monster', 'dice']
  `application_count` INT DEFAULT 0,
  `created_by` VARCHAR(64) NULL,
  `approved_by` VARCHAR(64) NULL,
  `approved_at` DATETIME NULL,
  `rejection_reason` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_jobs_company` (`company_id`),
  INDEX `idx_jobs_status` (`status`),
  INDEX `idx_jobs_dept` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CANDIDATES (Module 3 & 4: Ingestion, AI Parsing & Talent Pool CRM)
CREATE TABLE IF NOT EXISTS `candidates` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) DEFAULT '',
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `total_experience_years` DECIMAL(4,1) DEFAULT 0.0,
  `skills` JSON NULL,
  `education` JSON NULL,
  `work_history` JSON NULL,
  `location` JSON NULL,
  `summary` TEXT NULL,
  `raw_resume_text` LONGTEXT NULL,
  `resume_file_url` TEXT NULL,
  `stage` VARCHAR(50) NOT NULL DEFAULT 'Applied', -- Applied, Screening, Shortlisted, Interview, Offer, Hired, Rejected
  `source` VARCHAR(100) NOT NULL DEFAULT 'Career Page',
  `ai_match_score` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_candidates_company` (`company_id`),
  INDEX `idx_candidates_email` (`email`),
  INDEX `idx_candidates_stage` (`stage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. APPLICATIONS (Pipeline Kanban & Match Breakdown)
CREATE TABLE IF NOT EXISTS `applications` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `job_id` VARCHAR(64) NOT NULL,
  `candidate_id` VARCHAR(64) NOT NULL,
  `company_id` VARCHAR(64) NOT NULL,
  `stage_id` VARCHAR(50) NOT NULL DEFAULT 'Applied',
  `overall_match_score` DECIMAL(5,2) DEFAULT 75.00,
  `skills_match_score` DECIMAL(5,2) DEFAULT 75.00,
  `experience_match_score` DECIMAL(5,2) DEFAULT 75.00,
  `ai_explanation` TEXT NULL,
  `matching_skills` JSON NULL,
  `missing_skills` JSON NULL,
  `source` VARCHAR(100) DEFAULT 'Direct',
  `is_knocked_out` TINYINT(1) DEFAULT 0,
  `knockout_reason` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_apps_job` (`job_id`),
  INDEX `idx_apps_candidate` (`candidate_id`),
  INDEX `idx_apps_stage` (`stage_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. APPLICATION STAGE HISTORY (Audited Progression)
CREATE TABLE IF NOT EXISTS `application_stage_history` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `application_id` VARCHAR(64) NOT NULL,
  `from_stage` VARCHAR(50) NOT NULL,
  `to_stage` VARCHAR(50) NOT NULL,
  `changed_by_id` VARCHAR(64) NULL,
  `comments` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_stage_history_app` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. INTERVIEWS (Module 5: Calendar Scheduling & Live Studio)
CREATE TABLE IF NOT EXISTS `interviews` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `application_id` VARCHAR(64) NOT NULL,
  `candidate_id` VARCHAR(64) NOT NULL,
  `interviewer_id` VARCHAR(64) NOT NULL,
  `job_id` VARCHAR(64) NOT NULL,
  `scheduled_start` DATETIME NOT NULL,
  `scheduled_end` DATETIME NOT NULL,
  `meeting_link` TEXT NULL,
  `round_type` VARCHAR(50) NOT NULL DEFAULT 'Technical',
  `status` VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
  `recording_url` TEXT NULL,
  `transcript` LONGTEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_interviews_app` (`application_id`),
  INDEX `idx_interviews_candidate` (`candidate_id`),
  INDEX `idx_interviews_interviewer` (`interviewer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. SCORECARDS (Module 5: Blind Evaluations & Frozen Immutability Lock)
CREATE TABLE IF NOT EXISTS `scorecards` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `interview_id` VARCHAR(64) NOT NULL,
  `candidate_id` VARCHAR(64) NOT NULL,
  `interviewer_id` VARCHAR(64) NOT NULL,
  `overall_rating` INT NOT NULL DEFAULT 4, -- 1 to 5 Stars
  `criteria_scores` JSON NULL, -- e.g. {"systemDesign": 5, "coding": 4, "culture": 5}
  `strengths` TEXT NULL,
  `areas_for_improvement` TEXT NULL,
  `recommendation` VARCHAR(50) NOT NULL DEFAULT 'STRONG_HIRE',
  `is_frozen` TINYINT(1) DEFAULT 1, -- Locked on submission for anti-tamper audit
  `frozen_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_scorecards_interview` (`interview_id`),
  INDEX `idx_scorecards_candidate` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. OFFERS (Module 6: Offer Generator, DocuSign & PDF)
CREATE TABLE IF NOT EXISTS `offers` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `candidate_id` VARCHAR(64) NOT NULL,
  `job_id` VARCHAR(64) NOT NULL,
  `candidate_name` VARCHAR(255) NOT NULL,
  `job_title` VARCHAR(255) NOT NULL,
  `base_salary` DECIMAL(12,2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `equity_shares` INT DEFAULT 0,
  `target_start_date` DATE NOT NULL,
  `approval_status` VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
  `candidate_decision` VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED, DECLINED
  `docusign_envelope_id` VARCHAR(100) NULL,
  `docusign_status` VARCHAR(50) NULL,
  `docusign_sent_at` DATETIME NULL,
  `pdf_url` TEXT NULL,
  `signature_name` VARCHAR(255) NULL,
  `signed_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_offers_candidate` (`candidate_id`),
  INDEX `idx_offers_job` (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. JOB BOARD API CREDENTIALS & MULTI-POSTING LEDGER
CREATE TABLE IF NOT EXISTS `job_boards_credentials` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL UNIQUE,
  `credentials` JSON NOT NULL, -- encrypted API keys for Naukri, Indeed, Monster, Dice
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_board_postings` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL,
  `job_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `selected_boards` JSON NOT NULL,
  `syndicated_boards` JSON NOT NULL,
  `views_count` INT DEFAULT 0,
  `clicks_count` INT DEFAULT 0,
  `applicants_count` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_board_postings_job` (`job_id`),
  INDEX `idx_board_postings_company` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. AUTOMATION RULES ENGINE (Module 8: If-Then Condition Builder & Delayed Queue)
CREATE TABLE IF NOT EXISTS `workflow_rules` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `trigger_event` VARCHAR(100) NOT NULL,
  `action_type` VARCHAR(100) NOT NULL,
  `delay_hours` INT NOT NULL DEFAULT 24,
  `description` TEXT NULL,
  `is_enabled` TINYINT(1) DEFAULT 1,
  `execution_count` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_rules_company` (`company_id`),
  INDEX `idx_rules_event` (`trigger_event`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `workflow_logs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `rule_id` VARCHAR(64) NOT NULL,
  `company_id` VARCHAR(64) NOT NULL,
  `event_name` VARCHAR(100) NOT NULL,
  `candidate_id` VARCHAR(64) NULL,
  `action_executed` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
  `details` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_workflow_logs_rule` (`rule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. AUDIT LOGS (Compliance & Security Audit Trail)
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NULL,
  `user_name` VARCHAR(255) NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(64) NULL,
  `ip_address` VARCHAR(100) NULL,
  `details` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_company` (`company_id`),
  INDEX `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. SEARCH ALERTS (Talent Pool Notification Digests)
CREATE TABLE IF NOT EXISTS `search_alerts` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `search_name` VARCHAR(255) NOT NULL,
  `query_string` TEXT NULL,
  `filter_criteria` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. AGENCY PARTNER CRM & PLACEMENT BILLING
CREATE TABLE IF NOT EXISTS `agency_clients` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL,
  `client_name` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(100) DEFAULT 'Technology',
  `contact_person` VARCHAR(100) NULL,
  `email` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `agency_submissions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `client_id` VARCHAR(64) NOT NULL,
  `candidate_name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `fee_percentage` DECIMAL(5,2) DEFAULT 18.00,
  `proposed_fee` DECIMAL(12,2) DEFAULT 0.00,
  `status` VARCHAR(50) DEFAULT 'UNDER_REVIEW',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `agency_invoices` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `invoice_number` VARCHAR(100) NOT NULL UNIQUE,
  `client_name` VARCHAR(255) NOT NULL,
  `candidate_name` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `tax_gst` DECIMAL(12,2) NOT NULL,
  `total_amount` DECIMAL(12,2) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'UNPAID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. DEEL EOR ONBOARDING & RAZORPAYX PAYROLL
CREATE TABLE IF NOT EXISTS `deel_workers` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL,
  `worker_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'India',
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `salary` DECIMAL(12,2) NOT NULL,
  `employment_type` VARCHAR(50) DEFAULT 'EOR_EMPLOYEE',
  `status` VARCHAR(50) DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. RAZORPAYX PAYROLL RECORDS
CREATE TABLE IF NOT EXISTS `razorpayx_payroll` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `company_id` VARCHAR(64) NOT NULL,
  `employee_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `ctc_annual` DECIMAL(12,2) NOT NULL,
  `monthly_gross` DECIMAL(12,2) NOT NULL,
  `epf_deduction` DECIMAL(12,2) NOT NULL,
  `gratuity` DECIMAL(12,2) NOT NULL,
  `professional_tax` DECIMAL(12,2) NOT NULL,
  `net_take_home` DECIMAL(12,2) NOT NULL,
  `utr_number` VARCHAR(100) NULL,
  `disbursal_status` VARCHAR(50) DEFAULT 'PROCESSED',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
