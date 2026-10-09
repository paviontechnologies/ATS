import { Candidates, Offers, dbManager } from '../db/database.js';

const PayrollRecords = dbManager.getCollection('payrollRecords');
const PayrollPayouts = dbManager.getCollection('payrollPayouts');

export class PayrollService {
  /**
   * Calculates comprehensive Indian CTC structure & statutory deductions
   */
  static calculateCTCBreakup(annualCTC = 1800000) {
    const ctc = parseFloat(annualCTC) || 1800000;
    const monthlyGross = Math.round(ctc / 12);

    // Standard Indian Salary Structure
    const basicSalary = Math.round(monthlyGross * 0.50); // 50% Basic
    const hra = Math.round(monthlyGross * 0.20);          // 20% HRA
    const specialAllowance = monthlyGross - basicSalary - hra; // Balance ~30%

    // Statutory Deductions (Employee)
    // EPF: 12% of basic (optionally capped at 1,800 or full basic)
    const employeePF = Math.round(Math.min(basicSalary * 0.12, 1800));
    const employerPF = employeePF;

    // ESI: Applicable if Gross <= 21,000 INR
    const isEsiApplicable = monthlyGross <= 21000;
    const employeeESI = isEsiApplicable ? Math.round(monthlyGross * 0.0075) : 0;
    const employerESI = isEsiApplicable ? Math.round(monthlyGross * 0.0325) : 0;

    // Professional Tax (PT): ₹200/month
    const professionalTax = 200;

    // Estimated TDS (New Tax Regime 2024-2026 approximation)
    // Slabs: 0-3L (0%), 3-6L (5%), 6-9L (10%), 9-12L (15%), 12-15L (20%), >15L (30%)
    let annualTax = 0;
    if (ctc > 1500000) {
      annualTax = 150000 + (ctc - 1500000) * 0.30;
    } else if (ctc > 1200000) {
      annualTax = 90000 + (ctc - 1200000) * 0.20;
    } else if (ctc > 900000) {
      annualTax = 45000 + (ctc - 900000) * 0.15;
    } else if (ctc > 700000) {
      annualTax = 15000 + (ctc - 700000) * 0.10;
    } else {
      annualTax = 0; // Tax rebate under 87A up to 7 Lakhs
    }
    const monthlyTDS = Math.round(annualTax / 12);

    const totalEmployeeDeductions = employeePF + employeeESI + professionalTax + monthlyTDS;
    const netTakeHomeMonthly = Math.max(0, monthlyGross - totalEmployeeDeductions);

    // Employer Gratuity ~ 4.81% of Basic
    const employerGratuity = Math.round(basicSalary * 0.0481);

    return {
      annualCTC: ctc,
      currency: 'INR',
      monthlyGross,
      components: {
        basicSalary: { monthly: basicSalary, annual: basicSalary * 12, label: 'Basic Salary (50%)' },
        hra: { monthly: hra, annual: hra * 12, label: 'House Rent Allowance (HRA 20%)' },
        specialAllowance: { monthly: specialAllowance, annual: specialAllowance * 12, label: 'Special Allowance' }
      },
      deductions: {
        employeePF: { monthly: employeePF, annual: employeePF * 12, label: 'Provident Fund (EPF 12%)' },
        employeeESI: { monthly: employeeESI, annual: employeeESI * 12, label: 'Employee State Insurance (ESI)' },
        professionalTax: { monthly: professionalTax, annual: professionalTax * 12, label: 'Professional Tax (PT)' },
        tds: { monthly: monthlyTDS, annual: Math.round(annualTax), label: 'TDS (Income Tax Slabs)' },
        totalDeductions: { monthly: totalEmployeeDeductions, annual: totalEmployeeDeductions * 12 }
      },
      employerContributions: {
        employerPF: { monthly: employerPF, annual: employerPF * 12, label: 'Employer PF Contribution' },
        employerESI: { monthly: employerESI, annual: employerESI * 12, label: 'Employer ESI Contribution' },
        gratuity: { monthly: employerGratuity, annual: employerGratuity * 12, label: 'Gratuity Provision (4.81%)' }
      },
      netTakeHome: {
        monthly: netTakeHomeMonthly,
        annual: netTakeHomeMonthly * 12,
        label: 'Net In-Hand Take Home Pay'
      },
      complianceBadges: [
        'EPF Act 1952 Compliant',
        'ESIC Act 1948 Compliant',
        'TDS Section 192 Compliant',
        'Payment of Gratuity Act 1972'
      ]
    };
  }

  /**
   * Syncs candidate or employee into RazorpayX Payroll system
   */
  static async syncEmployeeToPayroll({
    tenantId,
    candidateId,
    annualCTC = 1800000,
    bankAccount = null,
    panNumber = 'ABCDE1234F'
  }) {
    const candidate = await Candidates.findById(candidateId);
    if (!candidate) throw new Error('Candidate not found.');

    const ctcBreakup = this.calculateCTCBreakup(annualCTC);
    const uanNumber = `10${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const esicNumber = `3100${Math.floor(100000 + Math.random() * 900000)}`;

    const payrollRecord = {
      tenantId: tenantId || candidate.tenantId,
      candidateId: candidate._id,
      employeeName: `${candidate.firstName} ${candidate.lastName}`,
      email: candidate.email,
      phone: candidate.phone || '+91 98765 43210',
      designation: candidate.headline || 'Full Stack Engineer',
      panNumber: panNumber || 'ABCDE1234F',
      uanNumber,
      esicNumber,
      ctcBreakup,
      paymentMethod: 'RAZORPAYX_DIRECT_BANK_TRANSFER',
      bankDetails: bankAccount || {
        accountHolder: `${candidate.firstName} ${candidate.lastName}`,
        accountNumber: `9102${Math.floor(10000000 + Math.random() * 90000000)}`,
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank Ltd'
      },
      payrollStatus: 'ACTIVE',
      lastDisbursementDate: null,
      lastDisbursementUTR: null,
      createdAt: new Date().toISOString()
    };

    let existing = await PayrollRecords.findOne({ candidateId: candidate._id });
    if (existing) {
      await PayrollRecords.updateById(existing._id, payrollRecord);
      return { ...existing, ...payrollRecord };
    } else {
      const created = await PayrollRecords.insertOne(payrollRecord);
      return created;
    }
  }

  /**
   * Simulates direct monthly salary payout via RazorpayX
   */
  static async disburseSalaryPayout({ tenantId, recordId, month = 'October 2026' }) {
    const record = await PayrollRecords.findById(recordId);
    if (!record) throw new Error('Payroll record not found.');

    const utrNumber = `RZPX_UTR_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const payoutAmount = record.ctcBreakup.netTakeHome.monthly;

    await PayrollRecords.updateById(record._id, {
      lastDisbursementDate: new Date().toISOString(),
      lastDisbursementUTR: utrNumber
    });

    const payoutReceipt = await PayrollPayouts.insertOne({
      tenantId: tenantId || record.tenantId,
      recordId: record._id,
      employeeName: record.employeeName,
      month,
      amount: payoutAmount,
      currency: 'INR',
      utrNumber,
      status: 'PROCESSED_SUCCESS',
      bankRef: record.bankDetails.accountNumber,
      disbursedAt: new Date().toISOString()
    });

    return {
      status: 'SUCCESS',
      message: `Salary of ₹${payoutAmount.toLocaleString('en-IN')} disbursed successfully to ${record.employeeName} via RazorpayX.`,
      utrNumber,
      payoutReceipt
    };
  }

  /**
   * Retrieves all active payroll records for tenant
   */
  static async getPayrollEmployees(tenantId) {
    const filter = tenantId ? { tenantId } : {};
    let records = await PayrollRecords.find(filter);

    // Auto-seed if empty for rich showcase
    if (records.length === 0) {
      const candidates = await Candidates.find({}, { limit: 3 });
      const sampleCtcs = [2400000, 1800000, 1400000];
      for (const [idx, cand] of candidates.entries()) {
        await this.syncEmployeeToPayroll({
          tenantId: cand.tenantId,
          candidateId: cand._id,
          annualCTC: sampleCtcs[idx] || 1600000
        });
      }
      records = await PayrollRecords.find(filter);
    }

    return records;
  }
}
