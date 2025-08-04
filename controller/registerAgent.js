import Agent from '../models/agent.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../utils/cloudinary.js';
import crypto from 'crypto'
import sendEmail from '../utils/sendEmail.js'

export const registerAgent = async (req, res) => {
    try{
        const{fullName, email, phone, password} = req.body;
        if(!fullName || !email || !phone || !password || !req.file){
            return res.status(400).json({message: 'All fields are required including NIN Documentation'});
    }

    const existingAgent = await Agent.findOne({email});
    if(existingAgent){
        return res.status(409).json({message: 'Agent with this email already exists'});
    }

    const tokken = crypto.randomBytes(32).toString('hex');
    const verificationUrl = `${process.env.BASE_URL}/api/agents/verify-email/${token}`;
    

    await sendEmail(email, 'Verify Your Email', `
        <h1>Welcome to Real Estate App</h1>
        <h2>Email Verification</h2>
        <p>Click the button or link below to verify your email:</p>
        <a href="${verificationUrl}">verify Email</a>`);



    const result = await cloudinary.uploader(req.file.path,{
        folder: 'nin_docs'
    });


    const agent = new Agent({
        fullName,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
        ninDocumentUrl: result.secure_url,
        emailVerificationToken: token
    })

    await agent.save();
    return res.status(201).json({message: 'Agent registered Succesfully'});

}catch(error){
    console.log(error);
    return res.status(500).json({message: 'Internal server error'});
}
}
