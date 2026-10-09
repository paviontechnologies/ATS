import express from 'express';
import { dbManager, Candidates, Jobs } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();
const AgencyClients = dbManager.getCollection('agencyClients');
const AgencySubmissions = dbManager.getCollection('agencySubmissions');
const AgencyInvoices = dbManager.getCollection('agencyInvoices');

export const DEFAULT_CLIENTS = [
  {
    name: 'Nexus Cloud Technologies',
    contactPerson: 'David Vance',
    contactEmail: 'david.vance@nexuscloud.io',
    industry: 'Enterprise SaaS',
    placementFeePercentage: 20,
    paymentTerms: 'NET_30',
    activeRequisitions: 3,
    status: 'ACTIVE'
  },
  {
    name: 'FinVanguard Global',
    contactPerson: 'Sophia Chen',
    contactEmail: 'sophia@finvanguard.com',
    industry: 'Fintech & Payments',
    placementFeePercentage: 22,
    paymentTerms: 'NET_15',
    activeRequisitions: 5,
    status: 'ACTIVE'
  },
  {
    name: 'OmniHealth AI',
    contactPerson: 'Liam Gallagher',
    contactEmail: 'liam@omnihealth.ai',
    industry: 'Healthcare AI',
    placementFeePercentage: 25,
    paymentTerms: 'NET_30',
    activeRequisitions: 2,
    status: 'ACTIVE'
  }
];

/**
 * GET /api/v1/agency/clients
 * Lists agency client CRM accounts
 */
router.get('/clients', authenticate, async (req, res) => {
  try {
    let clients = await AgencyClients.find({});
    if (clients.length === 0) {
      for (const cl of DEFAULT_CLIENTS) {
        await AgencyClients.insertOne({ ...cl, tenantId: req.user.tenantId, createdAt: new Date().toISOString() });
      }
      clients = await AgencyClients.find({});
    }
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch agency clients.' });
  }
});

/**
 * GET /api/v1/agency/submissions
 * Lists candidate submissions sent to client companies
 */
router.get('/submissions', authenticate, async (req, res) => {
  try {
    let submissions = await AgencySubmissions.find({});
    if (submissions.length === 0) {
      const candidates = await Candidates.find({}, { limit: 3 });
      const clients = await AgencyClients.find({}, { limit: 2 });
      if (candidates.length > 0 && clients.length > 0) {
        for (const [idx, cand] of candidates.entries()) {
          const client = clients[idx % clients.length];
          await AgencySubmissions.insertOne({
            tenantId: req.user.tenantId,
            candidateId: cand._id,
            candidateName: `${cand.firstName} ${cand.lastName}`,
            candidateEmail: cand.email,
            clientId: client._id,
            clientName: client.name,
            targetRole: 'Staff Infrastructure Architect',
            expectedCTC: 2200000,
            status: idx === 0 ? 'CLIENT_PLACED' : (idx === 1 ? 'INTERVIEW_SCHEDULED' : 'UNDER_REVIEW'),
            submittedAt: new Date(Date.now() - (idx + 1) * 86400000).toISOString()
          });
        }
      }
      submissions = await AgencySubmissions.find({});
    }
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch candidate submissions.' });
  }
});

/**
 * POST /api/v1/agency/invoices/generate
 * Generates placement fee invoice for client
 */
router.post('/invoices/generate', authenticate, auditAction('AGENCY_INVOICE_GENERATED', 'Agency'), async (req, res) => {
  try {
    const { clientName, candidateName, annualCTC, feePercentage = 20 } = req.body;
    const ctc = parseFloat(annualCTC) || 2000000;
    const feePct = parseFloat(feePercentage) || 20;
    const feeAmount = Math.round((ctc * feePct) / 100);
    const gstOrVat = Math.round(feeAmount * 0.18); // 18% GST standard in agency billing
    const totalAmount = feeAmount + gstOrVat;
    const invoiceNumber = `INV-AGY-${Date.now().toString().slice(-6)}`;

    const invoice = await AgencyInvoices.insertOne({
      tenantId: req.user.tenantId,
      invoiceNumber,
      clientName: clientName || 'Nexus Cloud Technologies',
      candidateName: candidateName || 'Candidate',
      annualCTC: ctc,
      feePercentage: feePct,
      baseFee: feeAmount,
      taxAmount: gstOrVat,
      totalAmount,
      currency: 'INR',
      status: 'ISSUED',
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      issuedAt: new Date().toISOString()
    });

    res.status(201).json({
      message: `Placement invoice ${invoiceNumber} created for ₹${totalAmount.toLocaleString('en-IN')}.`,
      invoice
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate agency invoice.' });
  }
});

/**
 * GET /api/v1/agency/invoices
 * Lists all generated placement invoices
 */
router.get('/invoices', authenticate, async (req, res) => {
  try {
    let invoices = await AgencyInvoices.find({}, { sort: { issuedAt: -1 } });
    if (invoices.length === 0) {
      // Auto-create sample invoice
      await AgencyInvoices.insertOne({
        tenantId: req.user.tenantId,
        invoiceNumber: 'INV-AGY-902144',
        clientName: 'Nexus Cloud Technologies',
        candidateName: 'Vikram Mehta',
        annualCTC: 2400000,
        feePercentage: 20,
        baseFee: 480000,
        taxAmount: 86400,
        totalAmount: 566400,
        currency: 'INR',
        status: 'PAID',
        dueDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        issuedAt: new Date(Date.now() - 25 * 86400000).toISOString()
      });
      invoices = await AgencyInvoices.find({});
    }
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoices.' });
  }
});

export default router;
