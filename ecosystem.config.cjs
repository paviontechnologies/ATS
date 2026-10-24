// ==============================================================================
// Enterprise ATS - PM2 Fleet Process Management
// Run in production: pm2 start ecosystem.config.cjs
// ==============================================================================

module.exports = {
  apps: [
    {
      name: 'ats-core-api',
      script: 'server/src/index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        TRUST_PROXY: '1'
      }
    },
    {
      name: 'ats-admin-api',
      script: 'server/src/adminServer.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        ADMIN_PORT: 5001,
        TRUST_PROXY: '1'
      }
    },
    {
      name: 'ats-frontend-ui',
      script: 'client/server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        CLIENT_PORT: 3001,
        CORE_API_URL: 'http://127.0.0.1:5000',
        ADMIN_API_URL: 'http://127.0.0.1:5001'
      }
    }
  ]
};
