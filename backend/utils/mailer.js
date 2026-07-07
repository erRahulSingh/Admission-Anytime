import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const isConfigured = 
  process.env.SMTP_USER && 
  process.env.SMTP_USER !== 'test_user' &&
  process.env.SMTP_PASS && 
  process.env.SMTP_PASS !== 'test_pass';

let transporter;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!isConfigured) {
      console.log('====== MOCK EMAIL SENT ======');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text || html}`);
      console.log('=============================');
      return { messageId: 'mock_message_id_' + Date.now() };
    }

    const mailOptions = {
      from: `"MBBS Consultancy" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendNotificationEmails = async (formData) => {
  // Email to Admin
  const adminSubject = `New MBBS Admission Form Lead: ${formData.fullName}`;
  const adminHtml = `
    <h2>New Admission Lead Received</h2>
    <p><strong>Name:</strong> ${formData.fullName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone}</p>
    <p><strong>NEET Score:</strong> ${formData.neetScore}</p>
    <p><strong>Interested In:</strong> ${formData.interestedIn}</p>
    <p><strong>Country:</strong> ${formData.country}</p>
  `;

  // Email to Student
  const studentSubject = `Thank you for contacting MBBS Admission Consultancy`;
  const studentHtml = `
    <h2>Dear ${formData.fullName},</h2>
    <p>We have received your request for MBBS admission counseling for <strong>${formData.country}</strong>.</p>
    <p>Our senior counselor will contact you shortly on <strong>${formData.phone}</strong>.</p>
    <br/>
    <p>Best Regards,<br/>Admission Anytime Team</p>
  `;

  await Promise.all([
    sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@admissionanytime.com',
      subject: adminSubject,
      html: adminHtml,
      text: `New Lead: ${formData.fullName}, Phone: ${formData.phone}, Country: ${formData.country}`
    }),
    sendEmail({
      to: formData.email,
      subject: studentSubject,
      html: studentHtml,
      text: `Hello ${formData.fullName}, We have received your admission form request. We will contact you soon.`
    })
  ]);
};
