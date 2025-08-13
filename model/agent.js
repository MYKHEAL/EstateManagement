import mongoose from 'mongoose';
import bcrypt from 'bcrypt'


const agentSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: [true, 'Full Name is required'],
        trim: true
    },

    email: {
        type: String,
        required: [true,'email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },

    phoneNumber:{
        type: String,
        required: [true,'Phone number is required'],
        trim: true,
        match: [/^\d{11}$/, 'Please enter a valid phone number']
    },


    password:{
        type: String,
        required: [true,'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },

    ninDocumentUrl: {
        type: String,
        required: [true,'NIN document URL is required'],

    },

    emailVerificationCode:{
        type: String
    },

    isVerifiedAgent:{
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

agentSchema.pre('save', async function (next){
    if(!this.isModified('password'))return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(err){
        next(err)
    }

});

const Agent = mongoose.model('agent', agentSchema);
export default Agent;

