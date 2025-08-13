import Agent from '../model/agent.js';

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
    console.error('Error verifying email code:', error);
    return res.status(500).json({ message: 'Internal server error' });
    }
};