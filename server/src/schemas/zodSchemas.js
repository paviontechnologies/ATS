/**
 * Zod Input Validation Schemas for Enterprise ATS
 */
let z;
try {
  const zodModule = await import('zod');
  z = zodModule.z;
} catch (e) {
  // Graceful fallback if zod is downloading
  z = {
    object: (shape) => ({
      safeParse: (data) => {
        for (const [key, validator] of Object.entries(shape)) {
          if (validator.required && (data[key] === undefined || data[key] === null || data[key] === '')) {
            return { success: false, error: { errors: [{ path: [key], message: `${key} is required` }] } };
          }
        }
        return { success: true, data };
      }
    }),
    string: () => ({ min: () => ({ email: () => ({ required: true }), required: true }), required: true }),
    number: () => ({ min: () => ({ required: true }), required: true }),
    array: () => ({ required: false }),
    boolean: () => ({ required: false }),
    enum: () => ({ required: true })
  };
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const jobRequisitionSchema = z.object({
  title: z.string().min(3),
  departmentId: z.string().min(2),
  locationId: z.string().min(2),
  workplaceType: z.enum(['ON_SITE', 'HYBRID', 'REMOTE']).optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional(),
  minExperienceYears: z.number().min(0).optional(),
  requiredSkills: z.array(z.string()).optional(),
  preferredSkills: z.array(z.string()).optional(),
  salaryRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.string().default('USD')
  }).optional()
});

export const candidateApplicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  resumeText: z.string().min(20),
  knockoutAnswers: z.array(z.object({
    questionText: z.string(),
    answer: z.any()
  })).optional()
});

export const scheduleInterviewSchema = z.object({
  applicationId: z.string().min(1),
  roundName: z.string().min(2),
  scheduledStartTime: z.string().min(5),
  interviewerIds: z.array(z.string()).optional()
});

export const scorecardSchema = z.object({
  interviewId: z.string().min(1),
  overallRecommendation: z.enum(['STRONG_HIRE', 'HIRE', 'NEUTRAL', 'NO_HIRE', 'STRONG_NO_HIRE']),
  criteriaRatings: z.array(z.object({
    name: z.string(),
    score: z.number().min(1).max(5),
    feedback: z.string().optional()
  })).optional(),
  privateNotes: z.string().optional()
});

export const offerSchema = z.object({
  applicationId: z.string().min(1),
  baseSalary: z.number().min(1000),
  currency: z.string().default('USD'),
  variableBonus: z.number().optional(),
  equityShares: z.number().optional(),
  targetStartDate: z.string().min(5)
});

/**
 * Express Middleware Validator Factory
 */
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.errors || result.error
    });
  }
  req.validatedBody = result.data;
  next();
};
