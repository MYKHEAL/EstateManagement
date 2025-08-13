import Agent from "../model/agent.js";
import sendEmail from "../utils/sendEmail.js";

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const agent = await Agent.findOne({email});

    if(!agent){
        return res.status(404).json({ message: 'Agent not found' });
    }

    if(agent.isVerifiedAgent){
        return res.status(400).json({ message: 'Email is already verified' });
    }

    const newCode = generateVerificationCode();
    agent.emailVerificationCode = newCode;
    await agent.save();
    const emailHtml = `
      <h1>Resend Verification Code</h1>
      <p>Your new verification code is:</p>
      <h2>${newCode}</h2>
      <p>Enter this code in the app to verify your email.</p>
      <p>This code expires in 5 minutes.</p>
    `;

    await sendEmail(agent.email, 'New Verification Code', emailHtml);
    return res.status(200).json({sage: 'New verification code sent to your email'});
} catch (error) {
    console.error('Error resending verification code:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
