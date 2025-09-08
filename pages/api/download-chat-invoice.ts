import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import jsPDF from 'jspdf';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.query;
    
    if (!data) {
      return res.status(400).json({ error: 'No invoice data provided' });
    }

    const invoiceData = JSON.parse(decodeURIComponent(data as string));

    // Generate AI-formatted invoice text
    const invoiceText = await generateInvoiceText(invoiceData);
    
    // Create PDF
    const pdfBuffer = await generatePDF(invoiceText, invoiceData);
    
    // Return PDF as download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceData.invoiceDetails.number}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating chat invoice:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
}

async function generateInvoiceText(data: any): Promise<string> {
  const prompt = createInvoicePrompt(data);
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a professional invoice generator. Create clean, professional invoice text that can be formatted into a PDF. Use proper spacing and structure."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 1000,
    temperature: 0.3,
  });

  return completion.choices[0]?.message?.content || '';
}

function createInvoicePrompt(data: any): string {
  const { invoiceType, companyInfo, clientInfo, invoiceDetails, lineItems, additionalOptions } = data;
  
  let prompt = `Generate a professional ${invoiceType} with the following details:

COMPANY INFORMATION:
Name: ${companyInfo.name}
Address: ${companyInfo.address}
Email: ${companyInfo.email}
Phone: ${companyInfo.phone}

CLIENT INFORMATION:
Name: ${clientInfo.name}
Address: ${clientInfo.address}
Email: ${clientInfo.email}
Phone: ${clientInfo.phone}

INVOICE DETAILS:
Invoice Number: ${invoiceDetails.number}
Date: ${invoiceDetails.date}
Due Date: ${invoiceDetails.dueDate}
Currency: ${invoiceDetails.currency}

LINE ITEMS:`;

  lineItems.forEach((item: any, index: number) => {
    prompt += `
${index + 1}. ${item.description}
   Quantity: ${item.quantity}
   Rate: ${invoiceDetails.currency} ${item.rate}
   Total: ${invoiceDetails.currency} ${item.total}`;
  });

  const subtotal = lineItems.reduce((sum: number, item: any) => sum + item.total, 0);
  const discountAmount = subtotal * (additionalOptions.discount / 100);
  const taxAmount = (subtotal - discountAmount) * (additionalOptions.taxRate / 100);
  const total = subtotal - discountAmount + taxAmount;

  prompt += `

CALCULATIONS:
Subtotal: ${invoiceDetails.currency} ${subtotal.toFixed(2)}`;

  if (additionalOptions.discount > 0) {
    prompt += `
Discount (${additionalOptions.discount}%): -${invoiceDetails.currency} ${discountAmount.toFixed(2)}`;
  }

  if (additionalOptions.taxRate > 0) {
    prompt += `
Tax (${additionalOptions.taxRate}%): ${invoiceDetails.currency} ${taxAmount.toFixed(2)}`;
  }

  prompt += `
TOTAL: ${invoiceDetails.currency} ${total.toFixed(2)}`;

  if (additionalOptions.notes) {
    prompt += `

NOTES:
${additionalOptions.notes}`;
  }

  if (additionalOptions.terms) {
    prompt += `

TERMS & CONDITIONS:
${additionalOptions.terms}`;
  }

  return prompt;
}

async function generatePDF(invoiceText: string, data: any): Promise<Buffer> {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Add title
  doc.setFontSize(20);
  doc.text('INVOICE', 20, 30);
  
  // Add company info
  doc.setFontSize(10);
  doc.text(data.companyInfo.name, 20, 50);
  doc.text(data.companyInfo.address, 20, 60);
  doc.text(data.companyInfo.email, 20, 70);
  doc.text(data.companyInfo.phone, 20, 80);
  
  // Add invoice details
  doc.text(`Invoice #: ${data.invoiceDetails.number}`, 120, 50);
  doc.text(`Date: ${data.invoiceDetails.date}`, 120, 60);
  doc.text(`Due Date: ${data.invoiceDetails.dueDate}`, 120, 70);
  
  // Add client info
  doc.text('Bill To:', 20, 100);
  doc.text(data.clientInfo.name, 20, 110);
  doc.text(data.clientInfo.address, 20, 120);
  doc.text(data.clientInfo.email, 20, 130);
  
  // Add line items table
  let yPosition = 150;
  doc.text('Description', 20, yPosition);
  doc.text('Qty', 100, yPosition);
  doc.text('Rate', 120, yPosition);
  doc.text('Total', 160, yPosition);
  
  yPosition += 10;
  data.lineItems.forEach((item: any) => {
    doc.text(item.description, 20, yPosition);
    doc.text(item.quantity.toString(), 100, yPosition);
    doc.text(`${data.invoiceDetails.currency} ${item.rate}`, 120, yPosition);
    doc.text(`${data.invoiceDetails.currency} ${item.total}`, 160, yPosition);
    yPosition += 10;
  });
  
  // Add totals
  const subtotal = data.lineItems.reduce((sum: number, item: any) => sum + item.total, 0);
  const discountAmount = subtotal * (data.additionalOptions.discount / 100);
  const taxAmount = (subtotal - discountAmount) * (data.additionalOptions.taxRate / 100);
  const total = subtotal - discountAmount + taxAmount;
  
  yPosition += 10;
  doc.text(`Subtotal: ${data.invoiceDetails.currency} ${subtotal.toFixed(2)}`, 120, yPosition);
  
  if (data.additionalOptions.discount > 0) {
    yPosition += 10;
    doc.text(`Discount: -${data.invoiceDetails.currency} ${discountAmount.toFixed(2)}`, 120, yPosition);
  }
  
  if (data.additionalOptions.taxRate > 0) {
    yPosition += 10;
    doc.text(`Tax: ${data.invoiceDetails.currency} ${taxAmount.toFixed(2)}`, 120, yPosition);
  }
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.text(`TOTAL: ${data.invoiceDetails.currency} ${total.toFixed(2)}`, 120, yPosition);
  
  // Add notes if provided
  if (data.additionalOptions.notes) {
    yPosition += 20;
    doc.setFontSize(10);
    doc.text('Notes:', 20, yPosition);
    doc.text(data.additionalOptions.notes, 20, yPosition + 10);
  }
  
  // Add terms if provided
  if (data.additionalOptions.terms) {
    yPosition += 30;
    doc.text('Terms & Conditions:', 20, yPosition);
    doc.text(data.additionalOptions.terms, 20, yPosition + 10);
  }
  
  return Buffer.from(doc.output('arraybuffer'));
}
