import express from 'express';
import upload from '../middleware/multer.js'; 
import {registerAgent} from '../controller/registerAgent.js';
import {verifyEmailCode} from '../controller/verifyEmail.js'; 
import {resendVerificationCode}  from '../controller/resendVerificationCode.js';
const router = express.Router();

router.post('/register', upload.single('ninDocument'), registerAgent);

router.post('/verify-email/', verifyEmailCode);
router.post('/resend-verification-code', resendVerificationCode);

export default router;