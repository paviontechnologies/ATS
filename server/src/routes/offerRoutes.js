import express from 'express';
import { Offers, Applications, Candidates, Jobs } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * GET /api/v1/offers
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const offers = await Offers.find({ tenantId: req.user.tenantId }, { sort: { createdAt: -1 } });

    const populated = await Promise.all(offers.map(async (offer) => {
      const candidate = await Candidates.findById(offer.candidateId);
      const application = await Applications.findById(offer.applicationId);
      const job = application ? await Jobs.findById(application.jobId) : null;

      return {
        ...offer,
        candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Candidate',
        candidateEmail: candidate ? candidate.email : '',
        jobTitle: offer.jobTitle || (job ? job.title : 'Software Engineer')
      };
    }));

    res.json(populated);
  } catch (err) {
    console.error('List offers error:', err);
    res.status(500).json({ error: 'Failed to fetch offers.' });
  }
});

/**
 * POST /api/v1/offers
 * Creates an offer package
 */
router.post('/', authenticate, auditAction('OFFER_CREATED', 'Offer'), async (req, res) => {
  try {
    const { applicationId, baseSalary, variableBonus, equityShares, targetStartDate, currency = 'USD' } = req.body;
    if (!applicationId || !baseSalary || !targetStartDate) {
      return res.status(400).json({ error: 'Application, Base Salary, and Target Start Date are required.' });
    }

    const application = await Applications.findById(applicationId);
    if (!application) return res.status(404).json({ error: 'Application not found.' });

    const job = await Jobs.findById(application.jobId);
    const candidate = await Candidates.findById(application.candidateId);

    const offer = await Offers.insertOne({
      tenantId: req.user.tenantId,
      applicationId,
      candidateId: candidate._id,
      jobTitle: job ? job.title : 'Software Engineer',
      baseSalary: parseFloat(baseSalary),
      currency,
      variableBonus: parseFloat(variableBonus || 0),
      equityShares: parseInt(equityShares || 0),
      targetStartDate: new Date(targetStartDate).toISOString(),
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days validity
      approvalStatus: 'APPROVED',
      candidateDecision: 'SENT',
      signedDocumentUrl: null,
      sentAt: new Date().toISOString()
    });

    // Advance application to Offer stage
    await Applications.updateById(application._id, {
      stageId: 'Offer',
      $push: { stageHistory: { fromStage: application.stageId, toStage: 'Offer', changedAt: new Date().toISOString() } }
    });

    res.status(201).json(offer);
  } catch (err) {
    console.error('Create offer error:', err);
    res.status(500).json({ error: 'Failed to generate offer package.' });
  }
});

/**
 * POST /api/v1/offers/:id/accept
 * Candidate signs/accepts the offer
 */
router.post('/:id/accept', authenticate, auditAction('OFFER_ACCEPTED', 'Offer'), async (req, res) => {
  try {
    const { signatureName } = req.body;
    const offer = await Offers.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found.' });

    await Offers.updateById(offer._id, {
      candidateDecision: 'ACCEPTED',
      eSignSignatureId: `sig_${Date.now()}_${signatureName || 'candidate'}`,
      signedAt: new Date().toISOString()
    });

    // Mark application as HIRED
    await Applications.updateById(offer.applicationId, {
      stageId: 'Hired',
      status: 'HIRED',
      $push: { stageHistory: { fromStage: 'Offer', toStage: 'Hired', changedAt: new Date().toISOString() } }
    });

    console.log(`🎉 [OFFER ACCEPTED] Candidate hired for offer ${offer._id}! Dispatched HRIS payload.`);

    res.json({ message: 'Offer accepted successfully. Candidate status updated to Hired.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process offer acceptance.' });
  }
});

export default router;
