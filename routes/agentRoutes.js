import express from 'express';
import upload from '../middlewear/multer.js'; // keep your custom upload middleware
import { registerAgent, verifyEmail } from '../controllers/agentController.js';

const router = express.Router();

router.post('/register', upload.single('ninDocument'), registerAgent);

router.get('/verify-email/:token', verifyEmail);

export default router;
