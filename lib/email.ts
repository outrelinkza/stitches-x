import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmailConfirmation(email: string, confirmationUrl: string) {
  try {
    if (!resend) {
      console.log('Resend not configured, skipping email confirmation');
      return null;
    }
    
    const { data, error } = await resend.emails.send({
      from: 'Stitches <noreply@stitches.com>',
      to: [email],
      subject: 'Confirm your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Stitches!</h2>
          <p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>
          <a href="${confirmationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Confirm Email</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${confirmationUrl}</p>
          <p>Best regards,<br>The Stitches Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  try {
    if (!resend) {
      console.log('Resend not configured, skipping password reset email');
      return null;
    }
    
    const { data, error } = await resend.emails.send({
      from: 'Stitches <noreply@stitches.com>',
      to: [email],
      subject: 'Reset your password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Stitches Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    if (!resend) {
      console.log('Resend not configured, skipping welcome email');
      return null;
    }
    
    const { data, error } = await resend.emails.send({
      from: 'Stitches <noreply@stitches.com>',
      to: [email],
      subject: 'Welcome to Stitches!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Stitches, ${name}!</h2>
          <p>Thank you for joining Stitches AI Invoice Generator. You're all set to create professional invoices with the power of AI.</p>
          <p>Get started by creating your first invoice or exploring our features.</p>
          <p>Best regards,<br>The Stitches Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}