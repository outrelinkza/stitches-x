import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Create welcome email content
    const welcomeEmailContent = {
      to: email,
      subject: 'Welcome to StitchesX - Your Invoice Generator is Ready!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to StitchesX</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: white;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .welcome-title {
              font-size: 24px;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .content {
              margin-bottom: 30px;
            }
            .feature-list {
              background: #f8fafc;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .feature-list ul {
              margin: 0;
              padding-left: 20px;
            }
            .feature-list li {
              margin-bottom: 8px;
            }
            .cta-button {
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              color: #2563eb;
              text-decoration: none;
              margin: 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">StitchesX</div>
              <h1 class="welcome-title">Welcome to StitchesX, ${name}!</h1>
            </div>
            
            <div class="content">
              <p>Thank you for joining StitchesX! We're excited to help you create professional invoices quickly and easily.</p>
              
              <p>Your account is now ready, and you can start generating invoices immediately. Here's what you can do:</p>
              
              <div class="feature-list">
                <h3>What's Included:</h3>
                <ul>
                  <li><strong>Professional Invoice Templates</strong> - 30+ industry-specific invoice types</li>
                  <li><strong>Multiple Currencies</strong> - GBP, USD, EUR, CAD, AUD, JPY support</li>
                  <li><strong>PDF Generation</strong> - High-quality, downloadable invoices</li>
                  <li><strong>Payment Integration</strong> - Optional Stripe payment processing</li>
                  <li><strong>Client Management</strong> - Store and manage client information</li>
                  <li><strong>Recurring Invoices</strong> - Set up automatic recurring billing</li>
                  <li><strong>GDPR Compliant</strong> - Your data is secure and protected</li>
                </ul>
              </div>
              
              <p>Ready to create your first invoice? Click the button below to get started!</p>
              
              <div style="text-align: center;">
                <a href="https://stitchesx.vercel.app" class="cta-button">Start Creating Invoices</a>
              </div>
              
              <p><strong>Need Help?</strong></p>
              <p>If you have any questions or need assistance, don't hesitate to reach out to our support team. We're here to help you succeed!</p>
            </div>
            
            <div class="footer">
              <div class="social-links">
                <a href="https://stitchesx.vercel.app">Website</a>
                <a href="mailto:support@stitchesx.com">Support</a>
                <a href="https://stitchesx.vercel.app/privacy">Privacy Policy</a>
              </div>
              <p>This email was sent to ${email} because you created an account with StitchesX.</p>
              <p>© 2024 StitchesX. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to StitchesX, ${name}!
        
        Thank you for joining StitchesX! We're excited to help you create professional invoices quickly and easily.
        
        Your account is now ready, and you can start generating invoices immediately.
        
        What's Included:
        • Professional Invoice Templates - 30+ industry-specific invoice types
        • Multiple Currencies - GBP, USD, EUR, CAD, AUD, JPY support
        • PDF Generation - High-quality, downloadable invoices
        • Payment Integration - Optional Stripe payment processing
        • Client Management - Store and manage client information
        • Recurring Invoices - Set up automatic recurring billing
        • GDPR Compliant - Your data is secure and protected
        
        Ready to create your first invoice? Visit: https://stitchesx.vercel.app
        
        Need Help?
        If you have any questions or need assistance, don't hesitate to reach out to our support team.
        
        Support: support@stitchesx.com
        Website: https://stitchesx.vercel.app
        
        © 2024 StitchesX. All rights reserved.
      `
    };

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email using Resend
    try {
      const { data, error } = await resend.emails.send({
        from: 'StitchesX <onboarding@resend.dev>', // Using Resend's testing domain
        to: [email],
        subject: welcomeEmailContent.subject,
        html: welcomeEmailContent.html,
        text: welcomeEmailContent.text,
      });

      if (error) {
        console.error('Resend email error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to send welcome email',
          error: error.message
        });
      }

      console.log('Welcome email sent successfully via Resend:', data);
      return res.status(200).json({ 
        success: true, 
        message: 'Welcome email sent successfully',
        emailSent: true,
        emailId: data?.id
      });

    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send welcome email',
        error: emailError instanceof Error ? emailError.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Welcome email error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
