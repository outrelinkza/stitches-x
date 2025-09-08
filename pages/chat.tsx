import { useState } from 'react';
import Head from 'next/head';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatInvoice() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Invoice Assistant. Just tell me what kind of invoice you need and I'll create it for you. For example:\n\n• 'Create an invoice for John Smith for 10 hours of web development at $75/hour'\n• 'Invoice ABC Company for 3 laptops at $1200 each'\n• 'Bill Sarah for consulting services, 5 hours at $150/hour'\n\nWhat can I help you with?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      // Send to AI for processing
      const response = await fetch('/api/chat-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages
        }),
      });

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If AI generated an invoice, show download option
      if (data.invoiceGenerated) {
        const downloadMessage: ChatMessage = {
          role: 'assistant',
          content: `🎉 Your invoice has been generated! Click the button below to download your PDF.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, downloadMessage]);
        
        // Add download button
        setTimeout(() => {
          const downloadButton = document.createElement('a');
          downloadButton.href = data.downloadUrl;
          downloadButton.download = `invoice-${Date.now()}.pdf`;
          downloadButton.click();
        }, 1000);
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again or use the traditional form.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Stitches - AI Chat Invoice Generator</title>
        <meta name="description" content="Generate invoices through natural conversation with AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-md border-b border-white/30">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AI Invoice Assistant</h1>
                <p className="text-gray-600">Just tell me what you need</p>
              </div>
              <a 
                href="/" 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                📝 Traditional Form
              </a>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg h-96 overflow-y-auto p-6 mb-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/30 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-white/30 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span>Generating your invoice...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the invoice you need..."
              className="flex-1 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/20 backdrop-blur-md"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Send'}
            </button>
          </form>

          {/* Quick Examples */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Quick examples:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Invoice John for 5 hours of design work at $100/hour",
                "Bill ABC Corp for 2 laptops at $1500 each",
                "Create receipt for Sarah's consulting fee of $500",
                "Invoice for monthly retainer of $2000"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInput(example)}
                  className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm text-gray-700 hover:bg-white/30 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
