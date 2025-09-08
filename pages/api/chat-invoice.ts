import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory } = req.body;

    // Analyze the user's message to extract invoice information
    const invoiceData = await extractInvoiceData(message);
    
    if (invoiceData) {
      // Generate the invoice
      const invoiceResponse = await generateInvoiceFromData(invoiceData);
      
      res.json({
        response: `Perfect! I've created your ${invoiceData.invoiceType} for ${invoiceData.clientInfo.name}. Here are the details:\n\n` +
                 `• Client: ${invoiceData.clientInfo.name}\n` +
                 `• Items: ${invoiceData.lineItems.map((item: any) => `${item.description} (${item.quantity} × $${item.rate})`).join(', ')}\n` +
                 `• Total: $${invoiceData.lineItems.reduce((sum: number, item: any) => sum + item.total, 0)}\n\n` +
                 `Your invoice is ready for download!`,
        invoiceGenerated: true,
        downloadUrl: invoiceResponse.downloadUrl
      });
    } else {
      // Ask for clarification
      const clarificationResponse = await getClarification(message, conversationHistory);
      res.json({
        response: clarificationResponse,
        invoiceGenerated: false
      });
    }

  } catch (error) {
    console.error('Error processing chat invoice:', error);
    res.status(500).json({ 
      response: "I'm sorry, I encountered an error. Please try again or use the traditional form.",
      invoiceGenerated: false
    });
  }
}

async function extractInvoiceData(message: string): Promise<any> {
  const prompt = `Extract invoice information from this message: "${message}"

Return a JSON object with this structure if you can extract enough information:
{
  "invoiceType": "Freelancer / Service Invoice" | "Product / Sales Invoice" | "Consulting / Agency Invoice" | "Simple Receipt" | "Subscription / Recurring Invoice",
  "clientInfo": {
    "name": "client name",
    "email": "client@email.com",
    "phone": "phone number",
    "address": "client address"
  },
  "lineItems": [
    {
      "description": "item description",
      "quantity": number,
      "rate": number,
      "total": number
    }
  ],
  "additionalOptions": {
    "taxRate": 0,
    "discount": 0,
    "notes": "any notes",
    "terms": "payment terms"
  }
}

If you cannot extract enough information, return null.

Examples:
- "Invoice John for 5 hours of design work at $100/hour" → Freelancer invoice
- "Bill ABC Corp for 2 laptops at $1500 each" → Product invoice
- "Create receipt for Sarah's consulting fee of $500" → Simple receipt`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an invoice data extraction assistant. Extract structured invoice data from natural language. Return only valid JSON or null."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.1,
    });

    const response = completion.choices[0]?.message?.content;
    if (response && response !== 'null') {
      return JSON.parse(response);
    }
    return null;
  } catch (error) {
    console.error('Error extracting invoice data:', error);
    return null;
  }
}

async function getClarification(message: string, conversationHistory: ChatMessage[]): Promise<string> {
  const prompt = `The user said: "${message}"

Based on this message, ask for clarification to help create an invoice. Be helpful and specific about what information is missing.

Examples of good clarifications:
- "I'd be happy to create that invoice! I need a bit more information: What's the client's name and email address?"
- "Great! For the consulting invoice, what's the hourly rate and how many hours were worked?"
- "I can help with that! What's the client's company name and billing address?"

Keep it conversational and helpful.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful invoice assistant. Ask for clarification when you need more information to create an invoice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "I'd be happy to help create that invoice! Could you provide a bit more detail about what you need?";
  } catch (error) {
    console.error('Error getting clarification:', error);
    return "I'd be happy to help create that invoice! Could you provide a bit more detail about what you need?";
  }
}

async function generateInvoiceFromData(invoiceData: any): Promise<{ downloadUrl: string }> {
  // Add default company info if not provided
  const fullInvoiceData = {
    ...invoiceData,
    companyInfo: {
      name: "Your Company",
      address: "Your Address",
      email: "your@email.com",
      phone: "Your Phone",
      ...invoiceData.companyInfo
    },
    invoiceDetails: {
      number: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      currency: "USD",
      ...invoiceData.invoiceDetails
    }
  };

  // Store the invoice data temporarily and return a download URL
  const invoiceId = `chat-${Date.now()}`;
  
  // In a real app, you'd store this in a database or cache
  // For now, we'll pass it as a parameter
  return {
    downloadUrl: `/api/download-chat-invoice?data=${encodeURIComponent(JSON.stringify(fullInvoiceData))}`
  };
}
