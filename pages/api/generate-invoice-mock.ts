import { NextApiRequest, NextApiResponse } from 'next';
import jsPDF from 'jspdf';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const invoiceData: InvoiceData = req.body;

    // Mock AI-generated content (since we don't have real OpenAI key)
    const mockAIContent = {
      title: `Professional ${invoiceData.invoiceType.replace('_', ' ')} Invoice`,
      description: `Invoice for ${invoiceData.invoiceType.replace('_', ' ')} services`,
      lineItems: invoiceData.lineItems.map(item => ({
        ...item,
        description: item.description || `Service item ${Math.floor(Math.random() * 1000)}`
      }))
    };

    // Create PDF
    const doc = new jsPDF();
    
    // Add company info
    doc.setFontSize(20);
    doc.text(invoiceData.companyInfo.name || 'Your Company', 20, 30);
    
    doc.setFontSize(12);
    doc.text(invoiceData.companyInfo.address || '123 Business St', 20, 40);
    doc.text(invoiceData.companyInfo.email || 'contact@company.com', 20, 50);
    doc.text(invoiceData.companyInfo.phone || '(555) 123-4567', 20, 60);

    // Add invoice details
    doc.setFontSize(16);
    doc.text('INVOICE', 150, 30);
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoiceData.invoiceDetails.number}`, 150, 40);
    doc.text(`Date: ${invoiceData.invoiceDetails.date}`, 150, 50);
    doc.text(`Due Date: ${invoiceData.invoiceDetails.dueDate}`, 150, 60);

    // Add client info
    doc.setFontSize(14);
    doc.text('Bill To:', 20, 80);
    doc.setFontSize(12);
    doc.text(invoiceData.clientInfo.name || 'Client Name', 20, 90);
    doc.text(invoiceData.clientInfo.address || 'Client Address', 20, 100);
    doc.text(invoiceData.clientInfo.email || 'client@email.com', 20, 110);

    // Add line items
    let yPos = 130;
    doc.setFontSize(12);
    doc.text('Description', 20, yPos);
    doc.text('Qty', 120, yPos);
    doc.text('Rate', 140, yPos);
    doc.text('Total', 170, yPos);
    
    yPos += 10;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    let subtotal = 0;
    invoiceData.lineItems.forEach(item => {
      if (item.description) {
        doc.text(item.description, 20, yPos);
        doc.text(item.quantity.toString(), 120, yPos);
        doc.text(`$${item.rate.toFixed(2)}`, 140, yPos);
        doc.text(`$${item.total.toFixed(2)}`, 170, yPos);
        subtotal += item.total;
        yPos += 10;
      }
    });

    // Add totals
    yPos += 10;
    doc.line(120, yPos, 190, yPos);
    yPos += 10;
    
    doc.text('Subtotal:', 140, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, 170, yPos);
    yPos += 10;
    
    const tax = subtotal * (invoiceData.taxRate / 100);
    doc.text(`Tax (${invoiceData.taxRate}%):`, 140, yPos);
    doc.text(`$${tax.toFixed(2)}`, 170, yPos);
    yPos += 10;
    
    const total = subtotal + tax;
    doc.setFontSize(14);
    doc.text('Total:', 140, yPos);
    doc.text(`$${total.toFixed(2)}`, 170, yPos);

    // Add notes
    if (invoiceData.notes) {
      yPos += 20;
      doc.setFontSize(12);
      doc.text('Notes:', 20, yPos);
      yPos += 10;
      doc.text(invoiceData.notes, 20, yPos);
    }

    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer');
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceData.invoiceDetails.number}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.byteLength);
    
    // Send PDF
    res.status(200).send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
}
