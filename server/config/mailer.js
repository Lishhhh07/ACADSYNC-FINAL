import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure dotenv is loaded
dotenv.config();

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

/**
 * Send email using Nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 * @param {string} text - Plain text email body (optional)
 */
export const sendEmail = async (to, subject, html, text = '') => {
  try {
    const mailOptions = {
      from: `ACADSYNC <${process.env.EMAIL}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send registration confirmation email
 */
export const sendRegistrationEmail = async (email, role) => {
  const subject = 'Welcome to ACADSYNC - Registration Successful';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #06b6d4;">Welcome to ACADSYNC!</h2>
      <p>Your ${role} account has been successfully created.</p>
      <p>You can now log in to your dashboard and start using ACADSYNC.</p>
      <p style="margin-top: 30px; color: #666;">Best regards,<br>The ACADSYNC Team</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

/**
 * Send login notification email
 */
export const sendLoginEmail = async (email, role) => {
  const subject = 'ACADSYNC - Login Notification';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #06b6d4;">Login Successful</h2>
      <p>You have successfully logged into your ${role} account.</p>
      <p>If this wasn't you, please contact support immediately.</p>
      <p style="margin-top: 30px; color: #666;">Best regards,<br>The ACADSYNC Team</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

export default transporter;
