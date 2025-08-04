import mongoose from 'mongoose';


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

    phone:{
        type: String,
        required: [true,'Phone number is required'],
        trim: true,
        match: [/^\d{10}$/, 'Please enter a valid phone number']
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

    isVerifiedAgent:{
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Agent = mongoose.model('Agent', agentSchema);
export default Agent;

