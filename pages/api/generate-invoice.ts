import { NextApiRequest, NextApiResponse } from 'next';
import jsPDF from 'jspdf';
import { supabase } from '../../lib/supabase';
import { sanitizeInput, checkRateLimit, validateRequiredFields, logSecurityEvent } from '../../lib/security';

interface InvoiceData {
  invoiceType: string;
  companyInfo: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  clientInfo: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  invoiceDetails: {
    number: string;
    date: string;
    dueDate: string;
    currency: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }>;
  taxRate: number;
  notes: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rate limiting
  if (!checkRateLimit(req, res, 10, 15 * 60 * 1000)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Sanitize and validate input
    const sanitizedBody = sanitizeInput(req.body);
    const invoiceData: InvoiceData = sanitizedBody;

    // Validate required fields
    const validation = validateRequiredFields(sanitizedBody, [
      'companyInfo', 'clientInfo', 'invoiceDetails', 'lineItems'
    ]);
    if (!validation.isValid) {
      logSecurityEvent('INVALID_INPUT', { missingFields: validation.missingFields }, req);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missingFields: validation.missingFields 
      });
    }

    // Create PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INVOICE', pageWidth - 60, yPosition);
    yPosition += 20;

    // Company Info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(invoiceData.companyInfo.name, 20, yPosition);
    yPosition += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoiceData.companyInfo.address, 20, yPosition);
    yPosition += 6;
    pdf.text(invoiceData.companyInfo.email, 20, yPosition);
    yPosition += 6;
    pdf.text(invoiceData.companyInfo.phone, 20, yPosition);
    yPosition += 20;

    // Invoice Details
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Invoice #: ${invoiceData.invoiceDetails.number}`, pageWidth - 60, yPosition);
    yPosition += 6;
    pdf.text(`Date: ${invoiceData.invoiceDetails.date}`, pageWidth - 60, yPosition);
    yPosition += 6;
    if (invoiceData.invoiceDetails.dueDate) {
      pdf.text(`Due Date: ${invoiceData.invoiceDetails.dueDate}`, pageWidth - 60, yPosition);
      yPosition += 6;
    }
    yPosition += 10;

    // Client Info
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bill To:', 20, yPosition);
    yPosition += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoiceData.clientInfo.name, 20, yPosition);
    yPosition += 6;
    pdf.text(invoiceData.clientInfo.address, 20, yPosition);
    yPosition += 6;
    pdf.text(invoiceData.clientInfo.email, 20, yPosition);
    yPosition += 6;
    pdf.text(invoiceData.clientInfo.phone, 20, yPosition);
    yPosition += 20;

    // Line Items Table
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description', 20, yPosition);
    pdf.text('Qty', 120, yPosition);
    pdf.text('Rate', 140, yPosition);
    pdf.text('Total', pageWidth - 30, yPosition);
    yPosition += 10;

    // Draw line
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 5;

    let subtotal = 0;
    pdf.setFont('helvetica', 'normal');
    
    invoiceData.lineItems.forEach(item => {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.text(item.description, 20, yPosition);
      pdf.text(item.quantity.toString(), 120, yPosition);
      pdf.text(`${invoiceData.invoiceDetails.currency} ${item.rate.toFixed(2)}`, 140, yPosition);
      pdf.text(`${invoiceData.invoiceDetails.currency} ${item.total.toFixed(2)}`, pageWidth - 30, yPosition);
      yPosition += 8;
      subtotal += item.total;
    });

    yPosition += 10;

    // Totals
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Subtotal: ${invoiceData.invoiceDetails.currency} ${subtotal.toFixed(2)}`, pageWidth - 60, yPosition);
    yPosition += 8;
    
    if (invoiceData.taxRate > 0) {
      const taxAmount = (subtotal * invoiceData.taxRate) / 100;
      pdf.text(`Tax (${invoiceData.taxRate}%): ${invoiceData.invoiceDetails.currency} ${taxAmount.toFixed(2)}`, pageWidth - 60, yPosition);
      yPosition += 8;
      pdf.text(`Total: ${invoiceData.invoiceDetails.currency} ${(subtotal + taxAmount).toFixed(2)}`, pageWidth - 60, yPosition);
    } else {
      pdf.text(`Total: ${invoiceData.invoiceDetails.currency} ${subtotal.toFixed(2)}`, pageWidth - 60, yPosition);
    }

    yPosition += 20;

    // Notes
    if (invoiceData.notes) {
      pdf.setFont('helvetica', 'normal');
      pdf.text('Notes:', 20, yPosition);
      yPosition += 8;
      pdf.text(invoiceData.notes, 20, yPosition);
    }

    // Save invoice to database
    const invoiceRecord = {
      invoice_number: invoiceData.invoiceDetails.number,
      company_name: invoiceData.companyInfo.name,
      company_address: invoiceData.companyInfo.address,
      client_name: invoiceData.clientInfo.name,
      client_address: invoiceData.clientInfo.address,
      client_email: invoiceData.clientInfo.email,
      invoice_date: invoiceData.invoiceDetails.date,
      due_date: invoiceData.invoiceDetails.dueDate,
      line_items: invoiceData.lineItems,
      subtotal: subtotal,
      tax_rate: invoiceData.taxRate,
      tax_amount: invoiceData.taxRate > 0 ? (subtotal * invoiceData.taxRate) / 100 : 0,
      total: invoiceData.taxRate > 0 ? subtotal + (subtotal * invoiceData.taxRate) / 100 : subtotal,
      notes: invoiceData.notes,
      created_at: new Date().toISOString()
    };

    // Save to database (if user is authenticated)
    if (req.body.userId && req.body.userId !== 'anonymous') {
      await supabase
        .from('invoices')
        .insert({
          ...invoiceRecord,
          user_id: req.body.userId
        });
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceData.invoiceDetails.number}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    logSecurityEvent('INVOICE_GENERATED', { 
      invoiceNumber: invoiceData.invoiceDetails.number,
      userId: req.body.userId || 'anonymous'
    }, req);

    res.send(pdfBuffer);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('INVOICE_GENERATION_ERROR', { error: errorMessage }, req);
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
}

