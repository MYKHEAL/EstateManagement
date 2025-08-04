import Agent from '../models/agent.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../utils/cloudinary.js';

export const registerAgent = assync (req, res) => {
    try{
        const{fullName, email, phone, password} = req.body;
        if(!fullName || !email || !phone || !password || !req.file){
            return res.status(400).json({message: 'All fields are required including NIN Documentation'});
    }

    const existingAgent = await Agent.findOne({email});
    if(existingAgent){
        return res.status(400).json({message: 'Agent with this email already exists'});
    }

    const result = await cloudinary.uploader(req.file.path,{
        folder: 'nin_docs'
    });


    const agent = new Agent({
        fullName,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
        ninDocumentUrl: result.secure_url
    })

    await agent.save();
    return res.status(201).json({message: 'Agent registered Succesfully'});

}catch(error){
    console.log(error);
    return res.status(500).json({message: 'Internal server error'});
}
}
