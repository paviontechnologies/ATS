import { Companies } from '../db/database.js';

export const scopeTenant = async (req, res, next) => {
  // If user is authenticated, use user.tenantId
  if (req.user && req.user.tenantId) {
    req.tenantId = req.user.tenantId;
    return next();
  }

  // Otherwise check x-tenant-id header or subdomain (for public career site)
  const headerTenantId = req.headers['x-tenant-id'];
  if (headerTenantId) {
    const company = await Companies.findById(headerTenantId);
    if (company) {
      req.tenantId = company._id;
      return next();
    }
  }

  // Default fallback for demo / single-tenant testing
  const defaultCompany = await Companies.findOne({});
  if (defaultCompany) {
    req.tenantId = defaultCompany._id;
  }
  next();
};
