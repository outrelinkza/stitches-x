import { NextApiRequest, NextApiResponse } from 'next';
import jsPDF from 'jspdf';

// Helper function to get payment terms text
function getPaymentTermsText(paymentTerms: string): string {
  switch (paymentTerms) {
    case 'due_on_receipt':
      return 'Payment is due upon receipt of this invoice.';
    case 'net_15':
      return 'Payment is due within 15 days of the invoice date.';
    case 'net_30':
      return 'Payment is due within 30 days of the invoice date.';
    case 'net_45':
      return 'Payment is due within 45 days of the invoice date.';
    case 'net_60':
      return 'Payment is due within 60 days of the invoice date.';
    case 'custom':
      return 'Payment terms as agreed upon.';
    default:
      return 'Payment is due within 30 days of the invoice date.';
  }
}

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
    paymentTerms: string;
    lateFeeRate: number;
    lateFeeAmount: number;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }>;
  additionalOptions: {
    taxRate: number;
    notes: string;
    recurring: boolean;
    recurringFrequency: string;
    recurringDuration: string;
    onlinePaymentMethods?: string[];
  };
  typeSpecificFields?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const invoiceData: InvoiceData = req.body;

    // Mock AI-generated content (since we don't have real OpenAI key)
    const mockAIContent = {
      title: `Professional ${(invoiceData.invoiceType || 'invoice').replace('_', ' ')} Invoice`,
      description: `Invoice for ${(invoiceData.invoiceType || 'invoice').replace('_', ' ')} services`,
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
    const isEstimate = invoiceData.invoiceType === 'estimate';
    doc.setFontSize(16);
    doc.text(isEstimate ? 'ESTIMATE' : 'INVOICE', 150, 30);
    doc.setFontSize(12);
    doc.text(`${isEstimate ? 'Estimate' : 'Invoice'} #: ${invoiceData.invoiceDetails.number}`, 150, 40);
    doc.text(`Date: ${invoiceData.invoiceDetails.date}`, 150, 50);
    
    // Only show due date for invoices, not estimates
    if (!isEstimate && invoiceData.invoiceDetails.dueDate) {
      doc.text(`Due Date: ${invoiceData.invoiceDetails.dueDate}`, 150, 60);
    }

    // Add client info
    doc.setFontSize(14);
    doc.text('Bill To:', 20, 80);
    doc.setFontSize(12);
    doc.text(invoiceData.clientInfo.name || 'Client Name', 20, 90);
    doc.text(invoiceData.clientInfo.address || 'Client Address', 20, 100);
    doc.text(invoiceData.clientInfo.email || 'client@email.com', 20, 110);

    // Add type-specific information (only if relevant fields are filled)
    let typeInfoYPos = 120;
    if (invoiceData.typeSpecificFields) {
      const typeFields = invoiceData.typeSpecificFields;
      
      // Medical/Dental fields
      if (typeFields.patientId || typeFields.insuranceProvider) {
        doc.setFontSize(12);
        doc.text('Medical Information:', 20, typeInfoYPos);
        typeInfoYPos += 10;
        if (typeFields.patientId) {
          doc.text(`Patient ID: ${typeFields.patientId}`, 20, typeInfoYPos);
          typeInfoYPos += 10;
        }
        if (typeFields.insuranceProvider) {
          doc.text(`Insurance: ${typeFields.insuranceProvider}`, 20, typeInfoYPos);
          typeInfoYPos += 10;
        }
      }
      
      // Legal fields
      if (typeFields.caseNumber) {
        doc.setFontSize(12);
        doc.text(`Case Number: ${typeFields.caseNumber}`, 20, typeInfoYPos);
        typeInfoYPos += 10;
      }
      
      // Product fields
      if (typeFields.sku || typeFields.inventory) {
        doc.setFontSize(12);
        doc.text('Product Details:', 20, typeInfoYPos);
        typeInfoYPos += 10;
        if (typeFields.sku) {
          doc.text(`SKU: ${typeFields.sku}`, 20, typeInfoYPos);
          typeInfoYPos += 10;
        }
        if (typeFields.inventory) {
          doc.text(`Location: ${typeFields.inventory}`, 20, typeInfoYPos);
          typeInfoYPos += 10;
        }
      }
    }

    // Add line items (only if there are valid line items)
    let yPos = typeInfoYPos + 10; // Start after type-specific fields
    let subtotal = 0;
    
    // Filter out empty line items
    const validLineItems = invoiceData.lineItems.filter(item => 
      item.description && item.description.trim() && item.rate > 0
    );
    
    if (validLineItems.length > 0) {
      doc.setFontSize(12);
      doc.text('Description', 20, yPos);
      doc.text('Qty', 120, yPos);
      doc.text('Rate', 140, yPos);
      doc.text('Total', 170, yPos);
      
      yPos += 10;
      doc.line(20, yPos, 190, yPos);
      yPos += 10;

      validLineItems.forEach(item => {
        doc.text(item.description, 20, yPos);
        doc.text(item.quantity.toString(), 120, yPos);
        doc.text(`$${item.rate.toFixed(2)}`, 140, yPos);
        doc.text(`$${item.total.toFixed(2)}`, 170, yPos);
        subtotal += item.total;
        yPos += 10;
      });
    } else {
      // If no valid line items, show a message
      doc.setFontSize(12);
      doc.text('No items specified', 20, yPos);
      yPos += 20;
    }

    // Add totals
    yPos += 10;
    doc.line(120, yPos, 190, yPos);
    yPos += 10;
    
    doc.text('Subtotal:', 140, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, 170, yPos);
    yPos += 10;
    
    // Only show tax if tax rate is set
    if (invoiceData.additionalOptions.taxRate > 0) {
      const tax = subtotal * (invoiceData.additionalOptions.taxRate / 100);
      doc.text(`Tax (${invoiceData.additionalOptions.taxRate}%):`, 140, yPos);
      doc.text(`$${tax.toFixed(2)}`, 170, yPos);
      yPos += 10;
    }
    
    const total = subtotal + (invoiceData.additionalOptions.taxRate > 0 ? subtotal * (invoiceData.additionalOptions.taxRate / 100) : 0);
    doc.setFontSize(14);
    doc.text('Total:', 140, yPos);
    doc.text(`$${total.toFixed(2)}`, 170, yPos);

    // Add payment terms (only for invoices, not estimates, and only if user set payment terms)
    if (!isEstimate && invoiceData.invoiceDetails.paymentTerms && invoiceData.invoiceDetails.paymentTerms !== 'custom') {
      yPos += 20;
      doc.setFontSize(12);
      doc.text('Payment Terms:', 20, yPos);
      yPos += 10;
      
      const paymentTermsText = getPaymentTermsText(invoiceData.invoiceDetails.paymentTerms);
      doc.text(paymentTermsText, 20, yPos);
      yPos += 10;
      
      // Add late payment fees ONLY if user actually set them
      if (invoiceData.invoiceDetails.lateFeeRate > 0 || invoiceData.invoiceDetails.lateFeeAmount > 0) {
        doc.text('Late Payment Fees:', 20, yPos);
        yPos += 10;
        if (invoiceData.invoiceDetails.lateFeeRate > 0) {
          doc.text(`• ${invoiceData.invoiceDetails.lateFeeRate}% per month on overdue amounts`, 20, yPos);
          yPos += 10;
        }
        if (invoiceData.invoiceDetails.lateFeeAmount > 0) {
          doc.text(`• $${invoiceData.invoiceDetails.lateFeeAmount.toFixed(2)} fixed late fee`, 20, yPos);
          yPos += 10;
        }
      }
    }

    // Add notes (only if provided)
    if (invoiceData.additionalOptions.notes && invoiceData.additionalOptions.notes.trim()) {
      yPos += 10;
      doc.setFontSize(12);
      doc.text('Notes:', 20, yPos);
      yPos += 10;
      doc.text(invoiceData.additionalOptions.notes, 20, yPos);
    }

    // Add online payment methods (only if user selected them and it's an invoice)
    if (!isEstimate && invoiceData.additionalOptions.onlinePaymentMethods) {
      const selectedMethods = invoiceData.additionalOptions.onlinePaymentMethods;
      if (selectedMethods.length > 0) {
        yPos += 20;
        doc.setFontSize(12);
        doc.text('Accepted Payment Methods:', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text(selectedMethods.join(', '), 20, yPos);
        yPos += 10;
      }
    }

    // Add estimate disclaimer (only for estimates)
    if (isEstimate) {
      yPos += 20;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('This is an estimate. Final pricing may vary based on actual work performed.', 20, yPos);
      yPos += 10;
      doc.text('Client approval required before work begins.', 20, yPos);
      doc.setTextColor(0, 0, 0); // Reset color
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
