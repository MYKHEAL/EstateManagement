import Agent from '../model/agent.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../middleware/cloudinary.js';
import sendEmail from '../utils/sendEmail.js';
import validateAgent from '../validators/validateAgent.js';

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerAgent = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;



    const { isValid, errors } = validateAgent({ fullName, email, phoneNumber, password });
    if (!isValid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }



    if (!req.file) {
      return res.status(400).json({ message: 'NIN Document is required' });
    }



    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(409).json({ message: 'Agent with this email already exists' });
    }




    const verificationCode = generateVerificationCode();

    // Send verification email
    const emailHtml = `
      <h1>Welcome to Real Estate App</h1>
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h2>${verificationCode}</h2>
      <p>Enter this code in the app to verify your email.</p>
      <p>this code expire in 5 minutes</p>
    `;
    await sendEmail(email, 'Verify Your Email', emailHtml);



    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'nin_docs',
    });


    const hashedPassword = await bcrypt.hash(password, 10);

    // Create agent
    const newAgent = new Agent({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      ninDocumentUrl: result.secure_url,
      emailVerificationCode: verificationCode, 
      isVerifiedAgent: false
    });

    await newAgent.save();

    return res.status(201).json({
      message: 'Agent registered successfully. Please check your email for the verification code.'
    });
  } catch (error) {
    console.error('Error during agent registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// VERIFY EMAIL USING CODE
export const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const agent = await Agent.findOne({ email });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    if (agent.emailVerificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    agent.isVerifiedAgent = true;
    agent.emailVerificationCode = undefined;

    await agent.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({ message: 'Something went wrong while verifying email' });
  }
};
