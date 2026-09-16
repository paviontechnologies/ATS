import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'enterprise_ats_super_secret_jwt_key_2026',
  jwtExpiresIn: '24h',
  pythonAiServiceUrl: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000',
  mongoUri: process.env.MONGODB_URI || '',
  dataPath: path.resolve(__dirname, '../../data'),
  scoringWeights: {
    skills: 0.40,
    experience: 0.30,
    education: 0.15,
    semantic: 0.15
  },
  defaultTenant: {
    id: 'tenant_techcorp_global',
    name: 'TechCorp Global Solutions',
    subdomain: 'techcorp',
    branding: {
      primaryColor: '#2563eb',
      accentColor: '#10b981',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60'
    }
  }
};
