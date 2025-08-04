// routes/emailRoute.js
import express from 'express';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    await sendEmail(to, subject, html);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

export default router;
