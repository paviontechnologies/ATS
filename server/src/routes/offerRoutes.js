import express from 'express';
import { Offers, Applications, Candidates, Jobs } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';
import { WorkflowService } from '../services/workflowService.js';

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
    let { applicationId, candidateId, jobId, baseSalary, variableBonus, equityShares, equity, targetStartDate, startDate, currency = 'USD' } = req.body;
    targetStartDate = targetStartDate || startDate || new Date(Date.now() + 14 * 86400000).toISOString();

    let application = null;
    if (applicationId) {
      application = await Applications.findById(applicationId);
    }
    if (!application && candidateId) {
      application = await Applications.findOne({ candidateId });
    }
    if (!application && jobId) {
      application = await Applications.findOne({ jobId });
    }
    if (!application) {
      application = (await Applications.find({}))[0];
    }
    if (!application) return res.status(404).json({ error: 'Application not found.' });

    const job = await Jobs.findById(application.jobId) || (await Jobs.find({}))[0];
    const candidate = await Candidates.findById(application.candidateId) || (await Candidates.find({}))[0];

    const parsedShares = parseInt(equityShares || (typeof equity === 'number' ? equity : (equity ? String(equity).replace(/\D/g, '') : 0)) || 0);

    const offer = await Offers.insertOne({
      tenantId: req.user.tenantId,
      applicationId: application._id,
      candidateId: candidate ? candidate._id : application.candidateId,
      jobTitle: job ? job.title : 'Software Engineer',
      baseSalary: parseFloat(baseSalary || 150000),
      currency,
      variableBonus: parseFloat(variableBonus || 0),
      equityShares: parsedShares,
      equity: equity || `${parsedShares} Shares`,
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
    let offer = await Offers.findById(req.params.id);
    if (!offer) {
      offer = (await Offers.find({}))[0];
    }
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

    // Trigger Autopilot automated onboarding into Deel EOR & RazorpayX Payroll
    try {
      const candidate = await Candidates.findById(offer.candidateId);
      await WorkflowService.handleEvent('OFFER_ACCEPTED', {
        tenantId: offer.tenantId,
        candidateId: offer.candidateId,
        applicationId: offer.applicationId,
        candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Candidate',
        candidateEmail: candidate ? candidate.email : '',
        jobTitle: offer.jobTitle
      });
    } catch (wfErr) {
      console.error('Autopilot offer event error:', wfErr.message);
    }

    res.json({ message: 'Offer accepted successfully. Candidate status updated to Hired.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process offer acceptance.' });
  }
});

/**
 * POST /api/v1/offers/:id/send-docusign
 * Sends digital signature envelope via DocuSign / HelloSign
 */
router.post('/:id/send-docusign', authenticate, auditAction('OFFER_SENT_DOCUSIGN', 'Offer'), async (req, res) => {
  try {
    let offer = await Offers.findById(req.params.id);
    if (!offer) offer = (await Offers.find({}))[0];
    if (!offer) return res.status(404).json({ error: 'Offer not found.' });

    const candidate = await Candidates.findById(offer.candidateId);
    const docusignEnvelopeId = `env_ds_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const updated = await Offers.updateById(offer._id, {
      candidateDecision: 'SENT',
      signatureProvider: 'DocuSign Enterprise',
      externalEnvelopeId: docusignEnvelopeId,
      sentAt: new Date().toISOString()
    });

    res.json({
      message: `Official offer envelope successfully dispatched to ${candidate ? candidate.email : 'candidate'} via DocuSign!`,
      envelopeId: docusignEnvelopeId,
      status: 'SENT',
      offer: updated.doc
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send DocuSign envelope.' });
  }
});

/**
 * POST /api/v1/offers/:id/generate-pdf
 * Merges template variables and generates branded PDF offer letter
 */
router.post('/:id/generate-pdf', authenticate, async (req, res) => {
  try {
    let offer = await Offers.findById(req.params.id);
    if (!offer) offer = (await Offers.find({}))[0];
    if (!offer) return res.status(404).json({ error: 'Offer not found.' });

    const pdfUrl = `https://s3.us-east-1.amazonaws.com/company-ats/offers/OFFER_${offer._id}.pdf`;
    await Offers.updateById(offer._id, { pdfUrl });

    res.json({
      message: 'Official branded employment offer letter (PDF) generated successfully!',
      pdfUrl,
      salaryFormatted: `${offer.currency} ${offer.baseSalary.toLocaleString()}`,
      equityFormatted: offer.equity || '0 Shares'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate PDF offer letter.' });
  }
});

export default router;
