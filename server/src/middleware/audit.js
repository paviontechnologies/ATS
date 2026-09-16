import { AuditLogs } from '../db/database.js';

export const auditAction = (actionName, resourceType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
      res.send = originalSend;
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const tenantId = req.tenantId || (req.user && req.user.tenantId);
          if (tenantId) {
            AuditLogs.insertOne({
              tenantId,
              actorId: req.user ? req.user.id : 'SYSTEM/PUBLIC',
              actorEmail: req.user ? req.user.email : 'public@careers',
              action: actionName,
              resourceType: resourceType || 'API',
              resourceId: req.params.id || (req.body && req.body._id) || 'N/A',
              ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
              userAgent: req.headers['user-agent'] || 'Unknown',
              method: req.method,
              path: req.originalUrl,
              createdAt: new Date().toISOString()
            }).catch(e => console.error('Audit log write error:', e));
          }
        } catch (e) {
          console.error('Audit middleware error:', e);
        }
      }
      return originalSend.apply(res, arguments);
    };
    next();
  };
};
