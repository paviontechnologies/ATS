import { dbManager } from '../db/database.js';

// Ensure all 22 collections are initialized and accessible
export const Collections = {
  Users: dbManager.getCollection('users'),
  Companies: dbManager.getCollection('companies'),
  Roles: dbManager.getCollection('roles'),
  Permissions: dbManager.getCollection('permissions'),
  Jobs: dbManager.getCollection('jobs'),
  Candidates: dbManager.getCollection('candidates'),
  Applications: dbManager.getCollection('applications'),
  Resumes: dbManager.getCollection('resumes'),
  Skills: dbManager.getCollection('skills'),
  Experiences: dbManager.getCollection('experiences'),
  Education: dbManager.getCollection('education'),
  Interviews: dbManager.getCollection('interviews'),
  Scorecards: dbManager.getCollection('scorecards'),
  Offers: dbManager.getCollection('offers'),
  TalentPools: dbManager.getCollection('talentPools'),
  Communications: dbManager.getCollection('communications'),
  Notifications: dbManager.getCollection('notifications'),
  Workflows: dbManager.getCollection('workflows'),
  Tasks: dbManager.getCollection('tasks'),
  Integrations: dbManager.getCollection('integrations'),
  Subscriptions: dbManager.getCollection('subscriptions'),
  AuditLogs: dbManager.getCollection('auditLogs')
};

export const {
  Users,
  Companies,
  Roles,
  Permissions,
  Jobs,
  Candidates,
  Applications,
  Resumes,
  Skills,
  Experiences,
  Education,
  Interviews,
  Scorecards,
  Offers,
  TalentPools,
  Communications,
  Notifications,
  Workflows,
  Tasks,
  Integrations,
  Subscriptions,
  AuditLogs
} = Collections;
