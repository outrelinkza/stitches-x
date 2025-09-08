import { NextApiRequest, NextApiResponse } from 'next';
import jsPDF from 'jspdf';

interface PremiumInvoiceData {
  template: string;
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    companyName: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  client: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  paymentTerms: string;
  dueDate: string;
  issueDate: string;
  invoiceNumber: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const invoiceData: PremiumInvoiceData = req.body;

    // Create PDF
    const pdf = new jsPDF();
    
    // Set font based on branding
    const fontFamily = invoiceData.branding.fontFamily || 'helvetica';
    
    // Template-specific styling
    if (invoiceData.template === 'modern-minimal') {
      // Modern minimal template
      pdf.setFontSize(24);
      pdf.setTextColor(invoiceData.branding.primaryColor);
      pdf.text(invoiceData.branding.companyName || 'Your Company', 20, 30);
      
      if (invoiceData.branding.tagline) {
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        pdf.text(invoiceData.branding.tagline, 20, 40);
      }
      
      // Invoice number
      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Invoice #${invoiceData.invoiceNumber}`, 150, 30);
      
    } else if (invoiceData.template === 'corporate-classic') {
      // Corporate classic template
      pdf.setFontSize(20);
      pdf.setTextColor(invoiceData.branding.primaryColor);
      pdf.text(invoiceData.branding.companyName || 'Your Company', 20, 30);
      
      // Invoice number
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Invoice #${invoiceData.invoiceNumber}`, 150, 30);
      
    } else if (invoiceData.template === 'creative-bold') {
      // Creative bold template
      pdf.setFontSize(22);
      pdf.setTextColor(invoiceData.branding.primaryColor);
      pdf.text(invoiceData.branding.companyName || 'Your Company', 20, 30);
      
      // Invoice number
      pdf.setFontSize(12);
      pdf.setTextColor(invoiceData.branding.primaryColor);
      pdf.text(`Invoice #${invoiceData.invoiceNumber}`, 150, 30);
      
    } else if (invoiceData.template === 'elegant-luxury') {
      // Elegant luxury template
      pdf.setFontSize(18);
      pdf.setTextColor(invoiceData.branding.primaryColor);
      pdf.text(invoiceData.branding.companyName || 'Your Company', 20, 30);
      
      // Invoice number
      pdf.setFontSize(11);
      pdf.setTextColor(invoiceData.branding.primaryColor);
      pdf.text(`Invoice #${invoiceData.invoiceNumber}`, 150, 30);
    }

    // Company details
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    let yPos = 50;
    
    if (invoiceData.branding.address) {
      pdf.text(invoiceData.branding.address, 20, yPos);
      yPos += 5;
    }
    if (invoiceData.branding.phone) {
      pdf.text(invoiceData.branding.phone, 20, yPos);
      yPos += 5;
    }
    if (invoiceData.branding.email) {
      pdf.text(invoiceData.branding.email, 20, yPos);
      yPos += 5;
    }
    if (invoiceData.branding.website) {
      pdf.text(invoiceData.branding.website, 20, yPos);
      yPos += 10;
    }

    // Client information
    yPos += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Bill To:', 20, yPos);
    yPos += 8;
    
    pdf.setFontSize(10);
    pdf.text(invoiceData.client.name || 'Client Name', 20, yPos);
    yPos += 5;
    
    if (invoiceData.client.email) {
      pdf.text(invoiceData.client.email, 20, yPos);
      yPos += 5;
    }
    if (invoiceData.client.phone) {
      pdf.text(invoiceData.client.phone, 20, yPos);
      yPos += 5;
    }
    if (invoiceData.client.address) {
      pdf.text(invoiceData.client.address, 20, yPos);
      yPos += 15;
    }

    // Invoice details
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    pdf.text(`Issue Date: ${new Date(invoiceData.issueDate).toLocaleDateString()}`, 150, 50);
    pdf.text(`Due Date: ${invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString() : 'Not set'}`, 150, 55);
    pdf.text(`Payment Terms: ${invoiceData.paymentTerms}`, 150, 60);

    // Invoice items table
    yPos += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Items', 20, yPos);
    yPos += 10;

    // Table headers
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Description', 20, yPos);
    pdf.text('Qty', 120, yPos);
    pdf.text('Rate', 140, yPos);
    pdf.text('Amount', 170, yPos);
    yPos += 5;

    // Draw line
    pdf.line(20, yPos, 190, yPos);
    yPos += 8;

    // Invoice items
    invoiceData.items.forEach((item) => {
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text(item.description || 'Item description', 20, yPos);
      pdf.text(item.quantity.toString(), 120, yPos);
      pdf.text(`$${item.rate.toFixed(2)}`, 140, yPos);
      pdf.text(`$${item.amount.toFixed(2)}`, 170, yPos);
      yPos += 6;
    });

    // Totals
    yPos += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    pdf.text(`Subtotal: $${invoiceData.subtotal.toFixed(2)}`, 150, yPos);
    yPos += 6;
    pdf.text(`Tax (${invoiceData.taxRate}%): $${invoiceData.taxAmount.toFixed(2)}`, 150, yPos);
    yPos += 6;
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Total: $${invoiceData.total.toFixed(2)}`, 150, yPos);

    // Notes
    if (invoiceData.notes) {
      yPos += 20;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Notes:', 20, yPos);
      yPos += 8;
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      const notesLines = pdf.splitTextToSize(invoiceData.notes, 170);
      pdf.text(notesLines, 20, yPos);
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('Error generating premium invoice:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
}
