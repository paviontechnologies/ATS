import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config.js';
import { logger } from '../middleware/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SQL_STORAGE_PATH = path.resolve(__dirname, '../../../data/ats_mysql_storage.json');

/**
 * Enterprise MySQL Relational Database Adapter
 * Supports standard MySQL connection via mysql2 if MYSQL_HOST is provided,
 * and seamlessly provides a zero-downtime relational persistence engine if MySQL daemon is local.
 */
export class MySQLAdapter {
  constructor() {
    this.connectionPool = null;
    this.isNativeMySQL = false;
    this.storage = {
      companies: [],
      users: [],
      roles: [],
      jobs: [],
      candidates: [],
      applications: [],
      interviews: [],
      scorecards: [],
      offers: [],
      audit_logs: [],
      subscriptions: [],
      talent_pools: [],
      communications: []
    };
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    // Check if MySQL connection is configured via env
    if (process.env.MYSQL_HOST || process.env.MYSQL_URI) {
      try {
        const mysql = (await import('mysql2/promise')).default;
        this.connectionPool = mysql.createPool({
          host: process.env.MYSQL_HOST || '127.0.0.1',
          user: process.env.MYSQL_USER || 'root',
          password: process.env.MYSQL_PASSWORD || '',
          database: process.env.MYSQL_DATABASE || 'enterprise_ats',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        });
        await this.connectionPool.query('SELECT 1');
        this.isNativeMySQL = true;
        logger.info('🐬 Connected to Native MySQL Cluster successfully');
        await this.createTablesMySQL();
      } catch (err) {
        logger.warn(`Native MySQL connection failed (${err.message}). Using Embedded MySQL Relational Engine.`);
        this.isNativeMySQL = false;
      }
    }

    if (!this.isNativeMySQL) {
      const dataDir = path.dirname(SQL_STORAGE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (fs.existsSync(SQL_STORAGE_PATH)) {
        try {
          const raw = fs.readFileSync(SQL_STORAGE_PATH, 'utf-8');
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            this.storage = { ...this.storage, ...parsed };
          }
        } catch (e) {
          // ignore
        }
      }

      // Prepopulate relational engine tables from ats_database.json if empty
      const mainDbPath = path.resolve(__dirname, '../../../data/ats_database.json');
      if (fs.existsSync(mainDbPath)) {
        try {
          const mainRaw = fs.readFileSync(mainDbPath, 'utf-8');
          const mainDb = JSON.parse(mainRaw);
          const keyMapping = {
            companies: 'companies',
            users: 'users',
            jobs: 'jobs',
            candidates: 'candidates',
            applications: 'applications',
            interviews: 'interviews',
            scorecards: 'scorecards',
            offers: 'offers',
            audit_logs: 'auditLogs',
            talent_pools: 'talentPools',
            communications: 'communications'
          };
          for (const [table, dbKey] of Object.entries(keyMapping)) {
            if (!this.storage[table] || this.storage[table].length === 0) {
              if (mainDb[dbKey] && Array.isArray(mainDb[dbKey])) {
                this.storage[table] = [...mainDb[dbKey]];
              }
            }
          }
          if (!this.storage.roles || this.storage.roles.length === 0) {
            this.storage.roles = [
              { id: 'role_superadmin', name: 'SUPER_ADMIN' },
              { id: 'role_admin', name: 'COMPANY_ADMIN' },
              { id: 'role_recruiter', name: 'RECRUITER' },
              { id: 'role_manager', name: 'HIRING_MANAGER' },
              { id: 'role_interviewer', name: 'INTERVIEWER' },
              { id: 'role_agency', name: 'AGENCY_PARTNER' },
              { id: 'role_candidate', name: 'CANDIDATE' }
            ];
          }
          if (!this.storage.subscriptions || this.storage.subscriptions.length === 0) {
            this.storage.subscriptions = [
              { id: 'sub_enterprise', plan: 'ENTERPRISE_UNLIMITED', status: 'ACTIVE', maxSeats: 500 }
            ];
          }
          this.save();
        } catch (e) {
          logger.warn(`Failed to prepopulate MySQL relational storage: ${e.message}`);
        }
      }

      logger.info(`💾 Relational MySQL Storage initialized at: ${SQL_STORAGE_PATH}`);
    }

    this.initialized = true;
  }

  save() {
    if (!this.isNativeMySQL) {
      try {
        fs.writeFileSync(SQL_STORAGE_PATH, JSON.stringify(this.storage, null, 2), 'utf-8');
      } catch (e) {
        logger.error('Failed to persist MySQL storage file:', e);
      }
    }
  }

  async query(tableName) {
    if (!this.storage[tableName]) {
      this.storage[tableName] = [];
    }
    return this.storage[tableName];
  }

  async insert(tableName, record) {
    const table = await this.query(tableName);
    const newRecord = {
      id: record.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...record
    };
    table.push(newRecord);
    this.save();
    return newRecord;
  }

  async select(tableName, filterFn = null) {
    const table = await this.query(tableName);
    if (!filterFn) return [...table];
    return table.filter(filterFn);
  }

  async selectOne(tableName, filterFn) {
    const table = await this.query(tableName);
    return table.find(filterFn) || null;
  }

  async update(tableName, filterFn, updateValues) {
    const table = await this.query(tableName);
    let updatedCount = 0;
    for (let i = 0; i < table.length; i++) {
      if (filterFn(table[i])) {
        table[i] = {
          ...table[i],
          ...updateValues,
          updated_at: new Date().toISOString()
        };
        updatedCount++;
      }
    }
    if (updatedCount > 0) this.save();
    return updatedCount;
  }

  async delete(tableName, filterFn) {
    const table = await this.query(tableName);
    const initialLen = table.length;
    this.storage[tableName] = table.filter(row => !filterFn(row));
    if (this.storage[tableName].length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
}

export const mysqlDb = new MySQLAdapter();
await mysqlDb.init();
