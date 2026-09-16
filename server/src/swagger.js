export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Enterprise AI-Powered Applicant Tracking System (ATS) REST API',
    version: '1.0.0',
    description: 'Complete API documentation for enterprise multi-tenant recruitment operating system covering job requisitions, candidate CRM, explainable AI matching, structured scorecards, automated scheduling, and offer management.'
  },
  servers: [
    { url: 'http://localhost:5000/api/v1', description: 'Local Development Server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        summary: 'Authenticate user & issue JWT tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'recruiter@techcorp.com' },
                  password: { type: 'string', example: 'password123' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Authenticated successfully with JWT token' }
        }
      }
    },
    '/jobs': {
      get: {
        summary: 'List job requisitions',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of jobs' } }
      },
      post: {
        summary: 'Create a new job requisition',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Job requisition created' } }
      }
    },
    '/candidates': {
      get: {
        summary: 'Search & filter candidates (Boolean & skills)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of candidates' } }
      }
    },
    '/applications/pipeline/{jobId}': {
      get: {
        summary: 'Fetch Kanban candidate applications for a job',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Pipeline applications' } }
      }
    },
    '/interviews/schedule': {
      post: {
        summary: 'Schedule an interview round with Google Meet link',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Interview scheduled' } }
      }
    },
    '/scorecards': {
      post: {
        summary: 'Submit structured blind scorecard evaluation',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Scorecard submitted' } }
      }
    },
    '/offers': {
      post: {
        summary: 'Generate digital offer package',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Offer package created' } }
      }
    },
    '/analytics/funnel': {
      get: {
        summary: 'Get recruitment velocity, time-to-hire, and funnel conversion rates',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Funnel analytics' } }
      }
    },
    '/ai/assistant-chat': {
      post: {
        summary: 'Ask natural language queries to AI Recruitment Copilot',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'AI Assistant Answer' } }
      }
    },
    '/careers/jobs': {
      get: {
        summary: 'Public endpoint listing active published jobs',
        responses: { 200: { description: 'Public career openings' } }
      }
    },
    '/careers/apply/{jobId}': {
      post: {
        summary: 'Public candidate application submission with Knockout Screening & AI Parsing',
        responses: { 201: { description: 'Application submitted successfully' } }
      }
    }
  }
};

export const renderSwaggerHtml = (spec) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Enterprise ATS API Documentation (Swagger)</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #fafafa; font-family: sans-serif; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        spec: ${JSON.stringify(spec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ]
      });
    };
  </script>
</body>
</html>
`;
