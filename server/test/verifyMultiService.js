import { TEST_CREDENTIALS } from '../src/seed.js';

async function checkService(name, url) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      console.log(`  ✅ [${name}] Responded OK (${res.status}) at ${url}`);
      return true;
    } else {
      console.error(`  ❌ [${name}] Error status (${res.status}) at ${url}`);
      return false;
    }
  } catch (err) {
    console.error(`  ❌ [${name}] Connection failed at ${url}: ${err.message}`);
    return false;
  }
}

async function testAllLogins() {
  console.log('\n🔑 Testing Authentication for All 7 Role Credentials:');
  let passed = 0;

  for (const cred of TEST_CREDENTIALS) {
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cred.email, password: cred.password })
      });
      const data = await res.json();
      if (res.ok && data.token && data.user.role === cred.role) {
        console.log(`  ✅ Authenticated: ${cred.role.padEnd(16)} | ${cred.email.padEnd(28)} | ${cred.password.padEnd(16)} (Token issued)`);
        passed++;
      } else {
        console.error(`  ❌ Failed login for ${cred.email}:`, data);
      }
    } catch (err) {
      console.error(`  ❌ Request failed for ${cred.email}:`, err.message);
    }
  }

  return passed === TEST_CREDENTIALS.length;
}

async function runVerification() {
  console.log('=====================================================');
  console.log('🌐 ENTERPRISE ATS MULTI-SERVICE VERIFICATION SUITE');
  console.log('=====================================================');

  console.log('\n📡 Probing Services:');
  const frontendOk = await checkService('FRONTEND (Port 3001)', 'http://localhost:3001/health');
  const coreOk = await checkService('CORE API (Port 5000)', 'http://localhost:5000/health');
  const adminOk = await checkService('ADMIN API (Port 5001)', 'http://localhost:5001/health');
  const coreSwagger = await checkService('CORE SWAGGER (5000)', 'http://localhost:5000/api/v1/swagger.json');
  const adminSwagger = await checkService('ADMIN SWAGGER (5001)', 'http://localhost:5001/api/v1/swagger.json');

  const loginsOk = await testAllLogins();

  console.log('\n=====================================================');
  if (frontendOk && coreOk && adminOk && coreSwagger && adminSwagger && loginsOk) {
    console.log('🎉 ALL MULTI-PORT SERVICES & AUTH CREDENTIALS VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('⚠️ Verification failed for some services or accounts.');
    process.exit(1);
  }
}

runVerification();
