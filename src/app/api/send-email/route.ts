// src/app/api/send-email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email, company, message, budget, projectTypes } = body;

    // Validation
    const errors: Record<string, string> = {};

    // Required field validation
    if (!name || name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!email || email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!message || message.trim() === '') {
      errors.message = 'Message is required';
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors 
        },
        { status: 400 }
      );
    }

    // Prepare email content
    const budgetText = budget || 'Not specified';
    const companyText = company || 'Not provided';
    const projectTypesText = projectTypes && projectTypes.length > 0 
      ? projectTypes.join(', ') 
      : 'Not specified';

    // Email 1: Send notification to you
    const notificationEmail = await resend.emails.send({
      from: 'Contact Form <contact@indrabuildswebsites.com>',
      to: 'indranilmaiti222@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #4b5563; margin-bottom: 5px; }
              .value { background: white; padding: 12px; border-radius: 6px; border-left: 3px solid #667eea; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">🚀 New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></div>
                </div>
                
                <div class="field">
                  <div class="label">Company:</div>
                  <div class="value">${companyText}</div>
                </div>
                
                <div class="field">
                  <div class="label">Budget:</div>
                  <div class="value">${budgetText}</div>
                </div>
                
                <div class="field">
                  <div class="label">Project Types:</div>
                  <div class="value">${projectTypesText}</div>
                </div>
                
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div class="footer">
                  <p>Reply to this email directly from your Gmail to respond to ${name}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      replyTo: email, // This allows you to reply directly from Gmail
    });

    // Email 2: Send auto-reply to the user
    const autoReplyEmail = await resend.emails.send({
      from: 'Indranil Maiti <contact@indrabuildswebsites.com>',
      to: email,
      subject: 'Thanks for reaching out! I\'ll be in touch soon',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; }
              .social-links { margin-top: 20px; }
              .social-links a { color: #667eea; text-decoration: none; margin: 0 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">👋 Hi ${name}!</h1>
              </div>
              <div class="content">
                <div class="message">
                  <h2 style="color: #667eea; margin-top: 0;">Thank you for reaching out!</h2>
                  <p>I've received your message and I'm excited to learn more about your project.</p>
                  <p>I'll review your inquiry and get back to you within <strong>24 hours</strong>.</p>
                  <p>In the meantime, feel free to check out my portfolio and recent projects on my website.</p>
                </div>
                
                <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                  <p style="margin: 0;"><strong>📋 Your submission details:</strong></p>
                  <p style="margin: 5px 0 0 0; color: #4b5563;">Budget: ${budgetText}</p>
                  ${projectTypesText !== 'Not specified' ? `<p style="margin: 5px 0 0 0; color: #4b5563;">Project Types: ${projectTypesText}</p>` : ''}
                </div>
                
                <div class="footer">
                  <p><strong>Indranil Maiti</strong></p>
                  <p>Full Stack Developer</p>
                  <p>📧 indranilmaiti222@gmail.com</p>
                  <p>🌐 <a href="https://www.indrabuildswebsites.com" style="color: #667eea; text-decoration: none;">www.indrabuildswebsites.com</a></p>
                  
                  <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
                    If you have any questions before I respond, feel free to reply to this email directly.
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Check if emails were sent successfully
    if (notificationEmail.error || autoReplyEmail.error) {
      console.error('Email sending error:', {
        notification: notificationEmail.error,
        autoReply: autoReplyEmail.error,
      });
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send email. Please try again.' 
        },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully! I\'ll get back to you soon.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed. Please use POST.' },
    { status: 405 }
  );
}