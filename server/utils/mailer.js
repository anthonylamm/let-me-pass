const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text'); // Import htmlToText

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT, 
  secure: process.env.SMTP_SECURE === 'true', 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
  debug: true,  // Enables detailed debug output
  logger: true, // Enables logging
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer transporter configuration error:', error);
  } else {
    console.log('Nodemailer transporter is ready to send emails');
  }
});
/**
 * Sends an authentication email.
 * 
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Subject of the email.
 * @param {string} html - HTML content of the email.
 */
const sendAuthEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Let Me Pass" <${process.env.SMTP_USER}>`,
    to,
    subject: `Let Me Pass - ${subject}`,
    text: htmlToText(html), // Convert HTML to plain text
    html,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
};

module.exports = { transporter, sendAuthEmail };