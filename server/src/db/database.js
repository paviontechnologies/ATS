import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config.js';

class Collection {
  constructor(name, getStorage, saveStorage) {
    this.name = name;
    this.getStorage = getStorage;
    this.saveStorage = saveStorage;
  }

  _getItems() {
    const storage = this.getStorage();
    if (!storage[this.name]) {
      storage[this.name] = [];
    }
    return storage[this.name];
  }

  _matches(item, filter) {
    if (!filter || Object.keys(filter).length === 0) return true;
    for (const key of Object.keys(filter)) {
      const val = filter[key];
      if (val === undefined) continue;

      if (key === '$or' && Array.isArray(val)) {
        const anyMatch = val.some(subFilter => this._matches(item, subFilter));
        if (!anyMatch) return false;
        continue;
      }

      if (key === '$and' && Array.isArray(val)) {
        const allMatch = val.every(subFilter => this._matches(item, subFilter));
        if (!allMatch) return false;
        continue;
      }

      // Nested property access (e.g. "location.city" or "aiMatchScore.overallScore")
      const itemVal = key.includes('.')
        ? key.split('.').reduce((acc, part) => acc && acc[part], item)
        : item[key];

      if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof RegExp)) {
        if ('$regex' in val) {
          const regex = new RegExp(val.$regex, val.$options || 'i');
          if (!regex.test(String(itemVal || ''))) return false;
          continue;
        }
        if ('$in' in val && Array.isArray(val.$in)) {
          if (Array.isArray(itemVal)) {
            if (!val.$in.some(v => itemVal.includes(v))) return false;
          } else {
            if (!val.$in.includes(itemVal)) return false;
          }
          continue;
        }
        if ('$nin' in val && Array.isArray(val.$nin)) {
          if (val.$nin.includes(itemVal)) return false;
          continue;
        }
        if ('$gte' in val && !(itemVal >= val.$gte)) return false;
        if ('$lte' in val && !(itemVal <= val.$lte)) return false;
        if ('$gt' in val && !(itemVal > val.$gt)) return false;
        if ('$lt' in val && !(itemVal < val.$lt)) return false;
        if ('$ne' in val && itemVal === val.$ne) return false;
        continue;
      }

      if (val instanceof RegExp) {
        if (!val.test(String(itemVal || ''))) return false;
        continue;
      }

      if (Array.isArray(itemVal)) {
        if (!itemVal.includes(val)) return false;
      } else {
        if (itemVal !== val) return false;
      }
    }
    return true;
  }

  async find(filter = {}, options = {}) {
    const items = this._getItems();
    let results = items.filter(item => this._matches(item, filter));

    if (options.sort) {
      const [field, direction] = Object.entries(options.sort)[0] || [];
      if (field) {
        const dir = direction === -1 || direction === 'desc' ? -1 : 1;
        results.sort((a, b) => {
          const aVal = a[field];
          const bVal = b[field];
          if (aVal === bVal) return 0;
          if (aVal === undefined) return 1;
          if (bVal === undefined) return -1;
          return aVal > bVal ? dir : -dir;
        });
      }
    }

    if (options.skip) {
      results = results.slice(options.skip);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return JSON.parse(JSON.stringify(results));
  }

  async findOne(filter = {}) {
    const items = this._getItems();
    const item = items.find(i => this._matches(i, filter));
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async insertOne(doc) {
    const items = this._getItems();
    const newDoc = {
      _id: doc._id || `doc_${crypto.randomBytes(8).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    await this.saveStorage();
    return JSON.parse(JSON.stringify(newDoc));
  }

  async create(doc) {
    return this.insertOne(doc);
  }

  async insertMany(docs) {
    const items = this._getItems();
    const created = docs.map(doc => ({
      _id: doc._id || `doc_${crypto.randomBytes(8).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    }));
    items.push(...created);
    await this.saveStorage();
    return JSON.parse(JSON.stringify(created));
  }

  async updateOne(filter, updateDoc) {
    const items = this._getItems();
    const index = items.findIndex(i => this._matches(i, filter));
    if (index === -1) return { matchedCount: 0, modifiedCount: 0 };

    const current = items[index];
    const updateData = updateDoc.$set ? updateDoc.$set : updateDoc;

    const updated = {
      ...current,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (updateDoc.$push) {
      for (const [key, pushVal] of Object.entries(updateDoc.$push)) {
        if (!Array.isArray(updated[key])) updated[key] = [];
        updated[key].push(pushVal);
      }
    }

    items[index] = updated;
    await this.saveStorage();
    return { matchedCount: 1, modifiedCount: 1, doc: JSON.parse(JSON.stringify(updated)) };
  }

  async updateById(id, updateDoc) {
    return this.updateOne({ _id: id }, updateDoc);
  }

  async deleteOne(filter) {
    const items = this._getItems();
    const index = items.findIndex(i => this._matches(i, filter));
    if (index === -1) return { deletedCount: 0 };
    items.splice(index, 1);
    await this.saveStorage();
    return { deletedCount: 1 };
  }

  async deleteById(id) {
    return this.deleteOne({ _id: id });
  }

  async countDocuments(filter = {}) {
    const items = this._getItems();
    return items.filter(i => this._matches(i, filter)).length;
  }
}

class DatabaseManager {
  constructor() {
    this.storage = {};
    this.filePath = path.join(config.dataPath, 'ats_database.json');
    this.initialized = false;
    this.collections = {};
  }

  async init() {
    if (this.initialized) return;

    if (!fs.existsSync(config.dataPath)) {
      fs.mkdirSync(config.dataPath, { recursive: true });
    }

    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.storage = JSON.parse(raw);
      } catch (err) {
        console.warn('Database file parse failed, resetting:', err.message);
        this.storage = {};
      }
    } else {
      this.storage = {};
      this.saveSync();
    }

    const collectionNames = [
      'companies',
      'users',
      'jobs',
      'candidates',
      'applications',
      'interviews',
      'scorecards',
      'offers',
      'talentPools',
      'communications',
      'auditLogs',
      'departments'
    ];

    for (const name of collectionNames) {
      if (!this.storage[name]) this.storage[name] = [];
      this.collections[name] = new Collection(
        name,
        () => this.storage,
        () => this.save()
      );
    }

    this.initialized = true;
    console.log('✅ ATS Multi-Tenant Persistent Database Initialized at:', this.filePath);
  }

  async save() {
    try {
      const tmpPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.storage, null, 2), 'utf-8');
      fs.renameSync(tmpPath, this.filePath);
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  saveSync() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.storage, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database sync:', err);
    }
  }

  getCollection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new Collection(
        name,
        () => this.storage,
        () => this.save()
      );
    }
    return this.collections[name];
  }
}

export const dbManager = new DatabaseManager();
await dbManager.init();

export const Companies = dbManager.getCollection('companies');
export const Users = dbManager.getCollection('users');
export const Jobs = dbManager.getCollection('jobs');
export const Candidates = dbManager.getCollection('candidates');
export const Applications = dbManager.getCollection('applications');
export const Interviews = dbManager.getCollection('interviews');
export const Scorecards = dbManager.getCollection('scorecards');
export const Offers = dbManager.getCollection('offers');
export const TalentPools = dbManager.getCollection('talentPools');
export const Communications = dbManager.getCollection('communications');
export const AuditLogs = dbManager.getCollection('auditLogs');
export const Departments = dbManager.getCollection('departments');
