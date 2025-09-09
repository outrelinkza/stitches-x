import { NextApiRequest, NextApiResponse } from 'next';
import jsPDF from 'jspdf';
import { supabase } from '../../lib/supabase';
import { sanitizeInput, checkRateLimit, validateRequiredFields, logSecurityEvent } from '../../lib/security';

interface PremiumInvoiceData {
  invoiceType: string;
  companyInfo: {
    name: string;
    address: string;
    email: string;
    phone: string;
    logo?: string;
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
  template: string;
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
  };
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
    const invoiceData: PremiumInvoiceData = sanitizedBody;

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

    // Create PDF with premium styling
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Premium header with styling
    const primaryColor = invoiceData.branding?.primaryColor || '#3B82F6';
    const secondaryColor = invoiceData.branding?.secondaryColor || '#1E40AF';
    
    // Header background
    pdf.setFillColor(primaryColor);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Company logo area (if provided)
    if (invoiceData.companyInfo.logo) {
      // In a real implementation, you'd decode and add the logo image
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('LOGO', 20, 25);
    }

    // Invoice title
    pdf.setFontSize(28);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INVOICE', pageWidth - 60, 25);
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
    yPosition = 50;

    // Company Info with premium styling
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(invoiceData.companyInfo.name, 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoiceData.companyInfo.address, 20, yPosition);
    yPosition += 5;
    pdf.text(invoiceData.companyInfo.email, 20, yPosition);
    yPosition += 5;
    pdf.text(invoiceData.companyInfo.phone, 20, yPosition);
    yPosition += 20;

    // Invoice Details in a styled box
    pdf.setFillColor(240, 240, 240);
    pdf.rect(pageWidth - 80, yPosition - 10, 70, 30, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Invoice #: ${invoiceData.invoiceDetails.number}`, pageWidth - 75, yPosition);
    yPosition += 6;
    pdf.text(`Date: ${invoiceData.invoiceDetails.date}`, pageWidth - 75, yPosition);
    yPosition += 6;
    if (invoiceData.invoiceDetails.dueDate) {
      pdf.text(`Due Date: ${invoiceData.invoiceDetails.dueDate}`, pageWidth - 75, yPosition);
      yPosition += 6;
    }
    yPosition += 15;

    // Client Info with premium styling
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bill To:', 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoiceData.clientInfo.name, 20, yPosition);
    yPosition += 5;
    pdf.text(invoiceData.clientInfo.address, 20, yPosition);
    yPosition += 5;
    pdf.text(invoiceData.clientInfo.email, 20, yPosition);
    yPosition += 5;
    pdf.text(invoiceData.clientInfo.phone, 20, yPosition);
    yPosition += 20;

    // Premium line items table with styling
    pdf.setFillColor(primaryColor);
    pdf.rect(20, yPosition - 5, pageWidth - 40, 12, 'F');
    
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description', 25, yPosition);
    pdf.text('Qty', 120, yPosition);
    pdf.text('Rate', 140, yPosition);
    pdf.text('Total', pageWidth - 30, yPosition);
    yPosition += 15;

    // Reset text color
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');

    let subtotal = 0;
    
    invoiceData.lineItems.forEach((item, index) => {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Alternate row colors
      if (index % 2 === 0) {
        pdf.setFillColor(248, 248, 248);
        pdf.rect(20, yPosition - 3, pageWidth - 40, 8, 'F');
      }
      
      pdf.text(item.description, 25, yPosition);
      pdf.text(item.quantity.toString(), 120, yPosition);
      pdf.text(`${invoiceData.invoiceDetails.currency} ${item.rate.toFixed(2)}`, 140, yPosition);
      pdf.text(`${invoiceData.invoiceDetails.currency} ${item.total.toFixed(2)}`, pageWidth - 30, yPosition);
      yPosition += 8;
      subtotal += item.total;
    });

    yPosition += 10;

    // Premium totals section
    pdf.setFillColor(secondaryColor);
    pdf.rect(pageWidth - 80, yPosition - 5, 70, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Subtotal: ${invoiceData.invoiceDetails.currency} ${subtotal.toFixed(2)}`, pageWidth - 75, yPosition);
    yPosition += 8;
    
    if (invoiceData.taxRate > 0) {
      const taxAmount = (subtotal * invoiceData.taxRate) / 100;
      pdf.text(`Tax (${invoiceData.taxRate}%): ${invoiceData.invoiceDetails.currency} ${taxAmount.toFixed(2)}`, pageWidth - 75, yPosition);
      yPosition += 8;
      pdf.text(`Total: ${invoiceData.invoiceDetails.currency} ${(subtotal + taxAmount).toFixed(2)}`, pageWidth - 75, yPosition);
    } else {
      pdf.text(`Total: ${invoiceData.invoiceDetails.currency} ${subtotal.toFixed(2)}`, pageWidth - 75, yPosition);
    }

    yPosition += 20;

    // Premium notes section
    if (invoiceData.notes) {
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Notes:', 20, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoiceData.notes, 20, yPosition);
    }

    // Premium footer
    yPosition = pageHeight - 30;
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text('Generated by StitchesX Premium Invoice Generator', pageWidth / 2, yPosition, { align: 'center' });
    pdf.text('Professional invoice templates for modern businesses', pageWidth / 2, yPosition + 5, { align: 'center' });

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
      template: invoiceData.template,
      is_premium: true,
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
    res.setHeader('Content-Disposition', `attachment; filename="premium-invoice-${invoiceData.invoiceDetails.number}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    logSecurityEvent('PREMIUM_INVOICE_GENERATED', { 
      invoiceNumber: invoiceData.invoiceDetails.number,
      userId: req.body.userId || 'anonymous',
      template: invoiceData.template
    }, req);

    res.send(pdfBuffer);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logSecurityEvent('PREMIUM_INVOICE_GENERATION_ERROR', { error: errorMessage }, req);
    console.error('Error generating premium invoice:', error);
    res.status(500).json({ error: 'Failed to generate premium invoice' });
  }
}
