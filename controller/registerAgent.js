import Agent from '../model/agent.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../middleware/cloudinary.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

export const registerAgent = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password || !req.file) {
      return res.status(400).json({
        message: 'All fields are required including NIN Document',
      });
    }

    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(409).json({
        message: 'Agent with this email already exists',
      });
    }

    // Generate verification token and link
    const token = crypto.randomBytes(32).toString('hex');
    const verificationUrl = `${process.env.BASE_URL}/api/agents/verify-email/${token}`;

    // Send verification email
    const emailHtml = `
      <h1>Welcome to Real Estate App</h1>
      <h2>Email Verification</h2>
      <p>Click the button or link below to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `;

    await sendEmail(email, 'Verify Your Email', emailHtml);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'nin_docs',
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = new Agent({
      fullName,
      email,
      phone,
      password: hashedPassword,
      ninDocumentUrl: result.secure_url,
      emailVerificationToken: token,
    });

    await newAgent.save();

    return res.status(201).json({
      message:
        'Agent registered successfully. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Error during agent registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const agent = await Agent.findOne({ emailVerificationToken: token });

    if (!agent) {
      return res
        .status(404)
        .json({ message: 'Invalid or expired verification token' });
    }

    agent.isVerifiedAgent = true;
    agent.emailVerificationToken = undefined;

    await agent.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res
      .status(500)
      .json({ message: 'Something went wrong while verifying email' });
  }
};
