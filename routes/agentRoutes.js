import express from 'express';
import upload from '../middleware/multer.js'; // keep your custom upload middleware
import { registerAgent, verifyEmail } from '../controller/registerAgent.js';

const router = express.Router();

router.post('/register', upload.single('ninDocument'), registerAgent);

router.get('/verify-email/:token', verifyEmail);

export default router;
